import React from 'react'
import clsx from 'clsx'

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false,
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const classes = clsx(
    'card animate-fade-in',
    paddings[padding],
    hover && 'hover:shadow-md transition-shadow duration-200',
    className
  )
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = '' }) => (
  <div className={clsx('mb-4', className)}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '' }) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900 dark:text-gray-100', className)}>
    {children}
  </h3>
)

const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Title = CardTitle
Card.Content = CardContent

export default Card 