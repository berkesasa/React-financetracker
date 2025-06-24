import React from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { formatCurrency, formatCompactCurrency } from '../utils/formatters'
import Card from './ui/Card'

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label, currency = true }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm" style={{ color: item.color }}>
            <span className="font-medium">{item.dataKey}:</span>{' '}
            {currency ? formatCurrency(item.value) : item.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function MonthlyTrendChart({ transactions }) {
  const months = [];
  const today = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = month.toLocaleDateString('tr-TR', { month: 'short' });
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === month.getMonth() && 
             transactionDate.getFullYear() === month.getFullYear();
    });
    
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    months.push({
      month: monthName,
      gelir: income,
      gider: expense,
    });
  }

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Henüz işlem verisi yok</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={months}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="month" 
          className="text-xs"
          stroke="currentColor"
        />
        <YAxis 
          className="text-xs"
          stroke="currentColor"
          tickFormatter={(value) => `₺${value.toLocaleString('tr-TR')}`}
        />
        <Tooltip 
          formatter={(value, name) => [`₺${value.toLocaleString('tr-TR')}`, name === 'gelir' ? 'Gelir' : 'Gider']}
          labelStyle={{ color: 'var(--text-color)' }}
          contentStyle={{ 
            backgroundColor: 'var(--bg-color)', 
            border: '1px solid var(--border-color)',
            borderRadius: '8px'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="gelir" 
          stroke="#10b981" 
          strokeWidth={3}
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="gider" 
          stroke="#ef4444" 
          strokeWidth={3}
          dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export const IncomeExpenseChart = ({ data, title = "Gelir vs Gider" }) => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCompactCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.6}
                name="Gelir"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
                name="Gider"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card.Content>
    </Card>
  )
}

export const CategoryChart = ({ transactions, categories }) => {
  const categoryData = categories.map(category => {
    const categoryTransactions = transactions.filter(t => t.categoryId === category.id);
    const total = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    
    return {
      name: category.name,
      value: total,
      color: category.color
    };
  }).filter(item => item.value > 0); // Sadece değeri olan kategorileri göster

  if (categoryData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Henüz kategori verisi yok</p>
      </div>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Kategori Dağılımı</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`₺${value.toLocaleString('tr-TR')}`, 'Tutar']}
                contentStyle={{ 
                  backgroundColor: 'var(--bg-color)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          {categoryData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {item.name}
              </span>
              <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                {formatCompactCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  )
}

export const ComparisonChart = ({ data, title = "Karşılaştırma" }) => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCompactCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="income" 
                fill="#22c55e" 
                name="Gelir"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                fill="#ef4444" 
                name="Gider"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Content>
    </Card>
  )
}

export const DonutChart = ({ data, title = "Gelir/Gider Oranı" }) => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value, name) => [formatCurrency(value), name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Toplam</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatCompactCurrency(data.reduce((sum, item) => sum + item.value, 0))}
            </p>
          </div>
        </div>
        
        
        <div className="mt-4 flex justify-center space-x-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  )
}

export default function DashboardCharts({ transactions = [] }) {
  return (
    <div className="space-y-8">
      <MonthlyTrendChart transactions={transactions} />
    </div>
  );
} 