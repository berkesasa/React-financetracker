import React, { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({ 
  type = 'text',
  label,
  error,
  help,
  required = false,
  className = '',
  ...props 
}, ref) => {
  const inputClasses = clsx(
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
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
      />
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

Input.displayName = 'Input'

export default Input 