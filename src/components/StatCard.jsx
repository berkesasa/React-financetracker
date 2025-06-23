import { formatCurrency } from '../utils/formatters';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType, 
  color = 'blue',
  className = '' 
}) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600',
      icon: 'text-blue-600'
    },
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/20',
      text: 'text-emerald-600',
      icon: 'text-emerald-600'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/20',
      text: 'text-red-600',
      icon: 'text-red-600'
    },
    gray: {
      bg: 'bg-gray-100 dark:bg-gray-900/20',
      text: 'text-gray-600',
      icon: 'text-gray-600'
    }
  };

  const currentColor = colorClasses[color] || colorClasses.blue;
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          
          <p className={`text-2xl font-bold ${currentColor.text} mb-2`}>
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
          
          {change && (
            <div className="flex items-center">
              <span className={`text-sm font-medium ${
                changeType === 'positive' 
                  ? 'text-emerald-600' 
                  : changeType === 'negative'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}>
                {changeType === 'positive' && '+'}
                {change}
                {typeof change === 'number' && '%'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                vs previous month
              </span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 ${currentColor.bg} rounded-xl`}>
            <Icon className={`w-6 h-6 ${currentColor.icon}`} />
          </div>
        )}
      </div>
    </div>
  )
} 