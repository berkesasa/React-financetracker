import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  CreditCard, 
  Tag, 
  BarChart3, 
  Settings, 
  Moon, 
  Sun,
  Menu,
  X,
  Wallet
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useTransactions } from '../context/TransactionContext'
import { formatCompactCurrency } from '../utils/formatters'
import Button from './ui/Button'

const Header = () => {
  const { theme, toggleTheme } = useTheme()
  const { getBalance } = useTransactions()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const balance = getBalance()
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
    { name: 'Categories', href: '/categories', icon: Tag },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-primary-600 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Finans Takip
              </span>
            </Link>
          </div>
          
          
          <nav className="hidden md:flex space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
          
          
          <div className="flex items-center space-x-4">
            
            <div className="hidden sm:block">
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                <p className={`text-sm font-semibold ${
                  balance >= 0 
                    ? 'text-success-600 dark:text-success-400' 
                    : 'text-danger-600 dark:text-danger-400'
                }`}>
                  {formatCompactCurrency(balance)}
                </p>
              </div>
            </div>
            
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
            
            
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        
        
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                <p className={`text-lg font-semibold ${
                  balance >= 0 
                    ? 'text-success-600 dark:text-success-400' 
                    : 'text-danger-600 dark:text-danger-400'
                }`}>
                  {formatCompactCurrency(balance)}
                </p>
              </div>
              
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 