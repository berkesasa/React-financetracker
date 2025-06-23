import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import Charts from '../components/Charts';
import { formatCurrency } from '../utils/formatters';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/ui/Modal';
import { 
  ArrowTrendingUpIcon as TrendingUpIcon, 
  ArrowTrendingDownIcon as TrendingDownIcon, 
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { Plus } from 'lucide-react'
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatCard from '../components/StatCard';
import TransactionList from '../components/TransactionList';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { transactions, categories } = useContext(TransactionContext);
  const navigate = useNavigate();
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });

  const lastMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthIncome = lastMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExpense = lastMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const incomeChange = lastMonthIncome > 0 
    ? ((monthlyIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1)
    : null;

  const expenseChange = lastMonthExpense > 0 
    ? ((monthlyExpense - lastMonthExpense) / lastMonthExpense * 100).toFixed(1)
    : null;

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const monthlyData = (() => {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === date.getMonth() && 
               transactionDate.getFullYear() === date.getFullYear();
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: monthName,
        income,
        expenses
      });
    }
    
    return months;
  })();

  const categoryData = categories
    .filter(category => category.type === 'expense')
    .map(category => {
      const categoryTransactions = transactions.filter(t => 
        t.categoryId === category.id && t.type === 'expense'
      );
      const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        name: category.name,
        value: total,
        color: category.color
      };
    })
    .filter(item => item.value > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome to your personal finance tracker
            </p>
          </div>
          
          <Button onClick={() => setShowTransactionForm(true)}>
            <Plus size={20} className="mr-2" />
            New Transaction
          </Button>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Balance"
            value={formatCurrency(balance)}
            icon={TrendingUpIcon}
            trend={balance >= 0 ? 'up' : 'down'}
            change={`${balance >= 0 ? '+' : ''}${formatCurrency(balance)}`}
          />
          
          <StatCard
            title="This Month Income"
            value={formatCurrency(monthlyIncome)}
            icon={ArrowUpIcon}
            trend="up"
            change={`+${formatCurrency(monthlyIncome)}`}
            variant="success"
          />
          
          <StatCard
            title="This Month Expenses"
            value={formatCurrency(monthlyExpense)}
            icon={ArrowDownIcon}
            trend="down"
            change={`-${formatCurrency(monthlyExpense)}`}
            variant="danger"
          />
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          <Card>
            <Card.Header>
              <Card.Title>Monthly Trend</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="h-64">
                {monthlyData.some(m => m.income > 0 || m.expenses > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#22c55e" 
                        strokeWidth={3}
                        name="Income"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        name="Expenses"
                      />
                    </LineChart>
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
              <div className="h-64">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
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
            <div className="flex justify-between items-center">
              <Card.Title>Recent Transactions</Card.Title>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/transactions')}
              >
                View All
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            <TransactionList 
              limit={5} 
              showFilters={false}
              showHeader={false}
            />
          </Card.Content>
        </Card>

      </div>

      
      <Modal 
        isOpen={showTransactionForm} 
        onClose={() => setShowTransactionForm(false)}
        title="Add New Transaction"
      >
        <TransactionForm 
          onSuccess={() => setShowTransactionForm(false)}
          onCancel={() => setShowTransactionForm(false)}
        />
      </Modal>
    </div>
  );
} 