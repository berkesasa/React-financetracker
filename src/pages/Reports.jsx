import React, { useState, useContext } from 'react'
import { CalendarDays, Download } from 'lucide-react'
import { TransactionContext } from '../context/TransactionContext'
import { getDateRange } from '../utils/dateUtils'
import { formatCurrency } from '../utils/formatters'
import Charts from '../components/Charts'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import StatCard from '../components/StatCard'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts'

const Reports = () => {
  const [period, setPeriod] = useState('thisMonth')
  const [chartPeriod, setChartPeriod] = useState(6)
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'))
  
  const { transactions, categories } = useContext(TransactionContext)
  
  const dateRange = getDateRange(period)
  
  const periodTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate >= dateRange.start && transactionDate <= dateRange.end
  })
  
  const periodIncome = periodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)
    
  const periodExpenses = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)
    
  const periodNet = periodIncome - periodExpenses
  
  const periodOptions = [
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'lastYear', label: 'Last Year' },
  ]
  
  const chartPeriodOptions = [
    { value: 3, label: 'Last 3 Months' },
    { value: 6, label: 'Last 6 Months' },
    { value: 12, label: 'Last 12 Months' },
  ]
  
  const exportData = () => {
    const data = {
      transactions,
      period: dateRange.label,
      summary: {
        income: periodIncome,
        expenses: periodExpenses,
        net: periodNet
      },
      generatedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  const categoryBreakdown = categories.map(category => {
    const categoryTransactions = periodTransactions.filter(t => t.categoryId === category.id && t.type === 'expense')
    const total = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
    const percentage = periodExpenses > 0 ? (total / periodExpenses) * 100 : 0
    
    return {
      id: category.id,
      name: category.name,
      count: categoryTransactions.length,
      total,
      percentage,
      color: category.color
    }
  }).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total)

  const chartData = (() => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthTransactions = periodTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === date.getMonth() && 
               transactionDate.getFullYear() === date.getFullYear();
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      months.push({
        month: monthName,
        income,
        expenses
      });
    }
    
    return months;
  })()
  
  const pieData = categoryBreakdown.map(cat => ({
    name: cat.name,
    value: cat.total,
    color: cat.color
  }))
  
  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analyze your financial data with detailed reports
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="min-w-[140px]"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          
          <Button variant="outline" onClick={exportData}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      
      <Card>
        <Card.Header>
          <Card.Title>Time Period</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="flex items-end">
              <Button 
                variant="outline"
                onClick={() => {
                  setStartDate(format(startOfMonth(new Date()), 'yyyy-MM-dd'))
                  setEndDate(format(endOfMonth(new Date()), 'yyyy-MM-dd'))
                }}
                className="w-full"
              >
                This Month
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
      
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Income"
          value={formatCurrency(periodIncome)}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(periodExpenses)}
          icon={TrendingDown}
          variant="danger"
        />
        <StatCard
          title="Net Balance"
          value={formatCurrency(periodNet)}
          icon={DollarSign}
          variant={periodNet >= 0 ? 'success' : 'danger'}
        />
      </div>
      
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card>
          <Card.Header>
            <Card.Title>Income vs Expenses</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="h-80">
              {chartData.some(m => m.income > 0 || m.expenses > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <p>No data available for chart</p>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
        
        
        <Card>
          <Card.Header>
            <Card.Title>Expense Categories</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="h-80">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <p>No expense data available</p>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      </div>
      
      
      <Card>
        <Card.Header>
          <Card.Title>Category Breakdown</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {categoryBreakdown.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No data available for the selected period
              </p>
            ) : (
              categoryBreakdown.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {category.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category.count} transactions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(category.total)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.percentage.toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default Reports 