import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { format } from 'date-fns'

const TransactionContext = createContext()

export { TransactionContext }

const defaultCategories = [
  { id: 'food', name: 'Food', type: 'expense', color: '#f59e0b', icon: 'UtensilsCrossed' },
  { id: 'transport', name: 'Transportation', type: 'expense', color: '#3b82f6', icon: 'Car' },
  { id: 'shopping', name: 'Shopping', type: 'expense', color: '#ef4444', icon: 'ShoppingBag' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: 'Gamepad2' },
  { id: 'health', name: 'Health', type: 'expense', color: '#06b6d4', icon: 'Heart' },
  { id: 'salary', name: 'Salary', type: 'income', color: '#22c55e', icon: 'Banknote' },
  { id: 'freelance', name: 'Freelance', type: 'income', color: '#84cc16', icon: 'Laptop' },
  { id: 'investment', name: 'Investment', type: 'income', color: '#f97316', icon: 'TrendingUp' },
]

const initialState = {
  transactions: [],
  categories: defaultCategories,
}

const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload }
    
    case 'ADD_TRANSACTION':
      return { 
        ...state, 
        transactions: [action.payload, ...state.transactions] 
      }
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      }
    
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      }
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload }
    
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload]
      }
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload)
      }
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c => 
          c.id === action.payload.id ? action.payload : c
        )
      }
    
    default:
      return state
  }
}

export const useTransactions = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider')
  }
  return context
}

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState)

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    const savedCategories = localStorage.getItem('categories')
    
    if (savedTransactions) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: JSON.parse(savedTransactions) })
    }
    
    if (savedCategories) {
      dispatch({ type: 'SET_CATEGORIES', payload: JSON.parse(savedCategories) })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions))
  }, [state.transactions])

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(state.categories))
  }, [state.categories])

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: transaction.date || format(new Date(), 'yyyy-MM-dd'),
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction })
  }

  const deleteTransaction = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id })
  }

  const updateTransaction = (transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction })
  }

  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    }
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory })
  }

  const deleteCategory = (id) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id })
  }

  const updateCategory = (category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category })
  }

  const setTransactions = (transactions) => {
    dispatch({ type: 'SET_TRANSACTIONS', payload: transactions })
  }

  const setCategories = (categories) => {
    dispatch({ type: 'SET_CATEGORIES', payload: categories })
  }

  const getBalance = () => {
    return state.transactions.reduce((balance, transaction) => {
      const amount = parseFloat(transaction.amount) || 0
      return transaction.type === 'income' ? balance + amount : balance - amount
    }, 0)
  }

  const getTotalIncome = (startDate, endDate) => {
    return state.transactions
      .filter(t => {
        const transactionDate = new Date(t.date)
        const start = startDate ? new Date(startDate) : new Date(0)
        const end = endDate ? new Date(endDate) : new Date()
        return t.type === 'income' && transactionDate >= start && transactionDate <= end
      })
      .reduce((total, t) => total + (parseFloat(t.amount) || 0), 0)
  }

  const getTotalExpenses = (startDate, endDate) => {
    return state.transactions
      .filter(t => {
        const transactionDate = new Date(t.date)
        const start = startDate ? new Date(startDate) : new Date(0)
        const end = endDate ? new Date(endDate) : new Date()
        return t.type === 'expense' && transactionDate >= start && transactionDate <= end
      })
      .reduce((total, t) => total + (parseFloat(t.amount) || 0), 0)
  }

  const value = {
    ...state,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    addCategory,
    deleteCategory,
    updateCategory,
    setTransactions,
    setCategories,
    getBalance,
    getTotalIncome,
    getTotalExpenses,
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
} 