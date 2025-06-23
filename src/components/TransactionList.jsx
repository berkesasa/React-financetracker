import React, { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useTransactions } from '../context/TransactionContext'
import { formatCurrency } from '../utils/formatters'
import { getRelativeDate } from '../utils/dateUtils'
import Button from './ui/Button'
import Input from './ui/Input'
import Select from './ui/Select'
import Card from './ui/Card'

const TransactionList = ({ 
  onEdit, 
  showFilters = true, 
  limit = null,
  showHeader = true 
}) => {
  const { transactions, categories, deleteTransaction } = useTransactions()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.amount.toString().includes(searchTerm)
      
      const matchesCategory = !selectedCategory || transaction.categoryId === selectedCategory
      const matchesType = !selectedType || transaction.type === selectedType
      
      return matchesSearch && matchesCategory && matchesType
    })
    
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'amount':
          aValue = parseFloat(a.amount)
          bValue = parseFloat(b.amount)
          break
        case 'category':
          const aCat = categories.find(c => c.id === a.categoryId)
          const bCat = categories.find(c => c.id === b.categoryId)
          aValue = aCat?.name || ''
          bValue = bCat?.name || ''
          break
        case 'date':
        default:
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    
    return limit ? filtered.slice(0, limit) : filtered
  }, [transactions, categories, searchTerm, selectedCategory, selectedType, sortBy, sortOrder, limit])
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }
  
  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown size={16} />
    return sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
  }
  
  const getCategory = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)
  }
  
  const handleDelete = (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div>
          <p className="mb-3">Are you sure you want to delete this transaction?</p>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              onClick={() => {
                deleteTransaction(id)
                toast.success('Transaction deleted successfully! 🗑️', {
                  position: "top-right",
                  autoClose: 2000,
                })
                closeToast()
              }}
            >
              Yes, Delete
            </button>
            <button
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              onClick={closeToast}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
      }
    )
  }
  
  return (
    <Card>
      {showHeader && (
        <Card.Header>
          <Card.Title>Transactions</Card.Title>
        </Card.Header>
      )}
      
      {showFilters && (
        <div className="mb-6 space-y-4">
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              placeholder="All categories"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            
            <Select
              placeholder="All types"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </div>
        </div>
      )}
      
      
      <div className="space-y-2">
        
        {!limit && (
          <div className="hidden md:grid md:grid-cols-12 gap-4 py-2 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <div className="col-span-3">
              <button
                onClick={() => handleSort('date')}
                className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span>Date</span>
                {getSortIcon('date')}
              </button>
            </div>
            <div className="col-span-3">
              <button
                onClick={() => handleSort('category')}
                className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span>Category</span>
                {getSortIcon('category')}
              </button>
            </div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2">
              <button
                onClick={() => handleSort('amount')}
                className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span>Amount</span>
                {getSortIcon('amount')}
              </button>
            </div>
            <div className="col-span-1">Actions</div>
          </div>
        )}
        
        
        {filteredAndSortedTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No transactions found.</p>
          </div>
        ) : (
          filteredAndSortedTransactions.map((transaction) => {
            const category = getCategory(transaction.categoryId)
            
            return (
              <div
                key={transaction.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                
                <div className="md:hidden space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        {category && (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {category?.name || 'No category'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {getRelativeDate(transaction.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'income' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(Math.abs(parseFloat(transaction.amount)))}
                      </p>
                    </div>
                  </div>
                  
                  {transaction.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.description}
                    </p>
                  )}
                  
                  <div className="flex space-x-2">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(transaction)}
                      >
                        <Edit size={16} />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                
                <div className="hidden md:contents">
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {getRelativeDate(transaction.date)}
                    </span>
                  </div>
                  
                  <div className="col-span-3 flex items-center space-x-2">
                    {category && (
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                      {category?.name || 'No category'}
                    </span>
                  </div>
                  
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {transaction.description || '-'}
                    </span>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <span className={`text-sm font-semibold ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(Math.abs(parseFloat(transaction.amount)))}
                    </span>
                  </div>
                  
                  <div className="col-span-1 flex items-center space-x-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(transaction)}
                        className="p-1"
                      >
                        <Edit size={16} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}

export default TransactionList 