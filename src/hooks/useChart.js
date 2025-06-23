import { useMemo } from 'react'
import { useTransactions } from '../context/TransactionContext'
import { format, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'
import { tr } from 'date-fns/locale'

export const useChart = (period = 6) => {
  const { transactions, categories } = useTransactions()

  const monthlyData = useMemo(() => {
    const endDate = new Date()
    const startDate = startOfMonth(subMonths(endDate, period - 1))
    
    const months = eachMonthOfInterval({ start: startDate, end: endDate })
    
    return months.map(month => {
      const monthStr = format(month, 'yyyy-MM')
      const monthTransactions = transactions.filter(t => 
        t.date.startsWith(monthStr)
      )
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
      
      return {
        month: format(month, 'MMM yy', { locale: tr }),
        income,
        expenses,
        net: income - expenses
      }
    })
  }, [transactions, period])

  const categoryData = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense')
    
    const categoryTotals = {}
    expenseTransactions.forEach(transaction => {
      const categoryId = transaction.categoryId
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0
      }
      categoryTotals[categoryId] += parseFloat(transaction.amount) || 0
    })

    return Object.entries(categoryTotals)
      .map(([categoryId, total]) => {
        const category = categories.find(c => c.id === categoryId)
        return {
          id: categoryId,
          name: category?.name || 'Bilinmeyen',
          value: total,
          color: category?.color || '#6b7280'
        }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8) // Top 8 categories
  }, [transactions, categories])

  const incomeVsExpenseData = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

    return [
      { name: 'Gelir', value: totalIncome, color: '#22c55e' },
      { name: 'Gider', value: totalExpenses, color: '#ef4444' }
    ]
  }, [transactions])

  return {
    monthlyData,
    categoryData,
    incomeVsExpenseData
  }
} 