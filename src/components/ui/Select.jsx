import React, { forwardRef } from 'react'
import clsx from 'clsx'

const Select = forwardRef(({ 
  label,
  error,
  help,
  required = false,
  options = [],
  placeholder = 'Seçiniz...',
  className = '',
  children,
  ...props 
}, ref) => {
  const selectClasses = clsx(
    'input-field',
    error && 'border-danger-500 focus:ring-danger-500',
    className
  )
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <p className="text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
      {help && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {help}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select 