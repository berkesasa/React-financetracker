import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { 
  Moon, 
  Sun, 
  Download, 
  Upload, 
  Trash2, 
  Shield,
  Database,
  Palette
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { TransactionContext } from '../context/TransactionContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'

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

const Settings = () => {
  const { theme, toggleTheme } = useTheme()
  const { transactions, categories, setTransactions, setCategories } = useContext(TransactionContext)
  const [showClearModal, setShowClearModal] = useState(false)
  const [clearType, setClearType] = useState('')
  
  const handleExportData = () => {
    try {
      const data = {
        transactions,
        categories,
        exportDate: new Date().toISOString(),
        version: '1.0'
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Data exported successfully! 📥', {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Error exporting data! ❌', {
        position: "top-right",
        autoClose: 5000,
      })
    }
  }
  
  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        if (data.transactions && data.categories) {
          toast.warn(
            ({ closeToast }) => (
              <div>
                <p className="mb-3">This action will replace your current data. Do you want to continue?</p>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
                    onClick={() => {
                      setTransactions(data.transactions)
                      setCategories(data.categories)
                      
                      toast.success('Data imported successfully! 📤', {
                        position: "top-right",
                        autoClose: 3000,
                      })
                      closeToast()
                    }}
                  >
                    Yes
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
        } else {
          toast.error('Invalid file format! File must contain transactions and categories fields. 📄', {
            position: "top-right",
            autoClose: 5000,
          })
        }
      } catch (error) {
        toast.error('File reading error! Please select a valid JSON file. 📄', {
          position: "top-right",
          autoClose: 5000,
        })
        console.error('Import error:', error)
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }
  
  const handleClearData = (type) => {
    setClearType(type)
    setShowClearModal(true)
  }
  
  const confirmClearData = () => {
    try {
      if (clearType === 'transactions') {
        setTransactions([])
        toast.success('All transactions cleared successfully! 🗑️', {
          position: "top-right",
          autoClose: 3000,
        })
      } else if (clearType === 'categories') {
        setCategories(defaultCategories)
        toast.success('Categories reset to default values! 🔄', {
          position: "top-right",
          autoClose: 3000,
        })
      } else if (clearType === 'all') {
        setTransactions([])
        setCategories(defaultCategories)
        toast.success('All data cleared! Categories reset to default values! 🧹', {
          position: "top-right",
          autoClose: 4000,
        })
      }
      
      setShowClearModal(false)
      setClearType('')
    } catch (error) {
      console.error('Clear data error:', error)
      toast.error('Error clearing data! ❌', {
        position: "top-right",
        autoClose: 5000,
      })
    }
  }
  
  const getClearMessage = () => {
    switch (clearType) {
      case 'transactions':
        return 'Are you sure you want to delete all your transactions? This action cannot be undone.'
      case 'categories':
        return 'Are you sure you want to delete all your categories and restore default categories? This action cannot be undone.'
      case 'all':
        return 'Are you sure you want to delete all your data (transactions and categories)? Categories will be reset to default values. This action cannot be undone.'
      default:
        return ''
    }
  }
  
  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your application settings
        </p>
      </div>
      
      
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Palette className="text-emerald-600" size={20} />
            <Card.Title>Appearance</Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Theme
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose light or dark theme
                </p>
              </div>
              
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="flex items-center space-x-2"
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={16} />
                    <span>Dark Theme</span>
                  </>
                ) : (
                  <>
                    <Sun size={16} />
                    <span>Light Theme</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
      
      
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Database className="text-emerald-600" size={20} />
            <Card.Title>Data Management</Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Export Data
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Download all your data in JSON format
                </p>
              </div>
              
              <Button variant="outline" onClick={handleExportData}>
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </div>
            
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Import Data
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Restore previously exported data
                </p>
              </div>
              
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <label htmlFor="import-file" className="cursor-pointer">
                  <Button variant="outline" as="span" className="cursor-pointer">
                    <Upload size={16} className="mr-2" />
                    Import
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
      
      
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Shield className="text-emerald-600" size={20} />
            <Card.Title>Data Statistics</Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {transactions.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Transactions
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {categories.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Categories
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {transactions.filter(t => t.type === 'income').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Income Transactions
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {transactions.filter(t => t.type === 'expense').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Expense Transactions
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
      
      
      <Card>
        <Card.Header>
          <div className="flex items-center space-x-2">
            <Trash2 className="text-red-600" size={20} />
            <Card.Title className="text-red-600 dark:text-red-400">
              Danger Zone
            </Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                ⚠️ The actions below are permanent and cannot be undone. Please be careful.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-900 dark:text-red-100">
                      Clear Transactions
                    </h4>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Delete all transaction records
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleClearData('transactions')}
                  >
                    Clear
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-900 dark:text-red-100">
                      Reset Categories
                    </h4>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Reset categories to default
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleClearData('categories')}
                  >
                    Reset
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-900 dark:text-red-100">
                      Clear All Data
                    </h4>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Clear all transactions and categories
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleClearData('all')}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
      
      
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Data Deletion Confirmation"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Trash2 className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-sm text-red-700 dark:text-red-300">
              {getClearMessage()}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="danger"
              onClick={confirmClearData}
              className="flex-1"
            >
              Yes, Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowClearModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Settings 