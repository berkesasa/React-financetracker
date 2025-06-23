import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { useTransactions } from '../context/TransactionContext'
import Input from './ui/Input'
import Select from './ui/Select'
import Button from './ui/Button'
import Card from './ui/Card'

const TransactionForm = ({ 
  transaction = null, 
  onSuccess = () => {}, 
  onCancel = () => {} 
}) => {
  const { categories, addTransaction, updateTransaction } = useTransactions()
  const [selectedType, setSelectedType] = useState(transaction?.type || 'expense')
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      type: transaction?.type || 'expense',
      amount: transaction?.amount || '',
      categoryId: transaction?.categoryId || '',
      description: transaction?.description || '',
      date: transaction?.date || format(new Date(), 'yyyy-MM-dd')
    }
  })
  
  const watchType = watch('type')
  
  useEffect(() => {
    setSelectedType(watchType)
  }, [watchType])
  
  useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        description: transaction.description,
        date: transaction.date
      })
      setSelectedType(transaction.type)
    }
  }, [transaction, reset])
  
  const filteredCategories = categories.filter(cat => cat.type === selectedType)
  
  const onSubmit = async (data) => {
    try {
      if (transaction) {
        updateTransaction({ ...transaction, ...data })
        toast.success('Transaction updated successfully! ✏️', {
          position: "top-right",
          autoClose: 2000,
        })
      } else {
        addTransaction(data)
        toast.success('New transaction added successfully! ➕', {
          position: "top-right",
          autoClose: 2000,
        })
      }
      onSuccess()
      if (!transaction) {
        reset()
      }
    } catch (error) {
      console.error('Error saving transaction:', error)
      toast.error('Error saving transaction! ❌', {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }
  
  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {transaction ? 'Edit Transaction' : 'Add New Transaction'}
        </Card.Title>
      </Card.Header>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="income"
              {...register('type', { required: 'Please select transaction type' })}
              className="sr-only"
            />
            <div className={`flex-1 p-3 text-center border-2 rounded-lg cursor-pointer transition-colors ${
              selectedType === 'income'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}>
              <span className="font-medium">Income</span>
            </div>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              value="expense"
              {...register('type', { required: 'Please select transaction type' })}
              className="sr-only"
            />
            <div className={`flex-1 p-3 text-center border-2 rounded-lg cursor-pointer transition-colors ${
              selectedType === 'expense'
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}>
              <span className="font-medium">Expense</span>
            </div>
          </label>
        </div>
        {errors.type && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.type.message}
          </p>
        )}
        
        
        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          error={errors.amount?.message}
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' }
          })}
        />
        
        
        <Select
          label="Category"
          required
          error={errors.categoryId?.message}
          {...register('categoryId', { required: 'Please select a category' })}
        >
          <option value="">Select category</option>
          {filteredCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        
        
        <Input
          label="Description"
          placeholder="Transaction description (optional)"
          {...register('description')}
        />
        
        
        <Input
          label="Date"
          type="date"
          required
          error={errors.date?.message}
          {...register('date', { required: 'Date is required' })}
        />
        
        
        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            loading={isSubmitting}
            className="flex-1"
          >
            {transaction ? 'Update' : 'Add'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

export default TransactionForm 