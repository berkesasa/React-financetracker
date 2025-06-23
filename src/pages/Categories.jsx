import React, { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useTransactions } from '../context/TransactionContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useTransactions()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      type: 'expense',
      color: '#ef4444',
      icon: 'Tag'
    }
  })
  
  const watchColor = watch('color')
  
  const colorOptions = [
    { value: '#ef4444', label: 'Red' },
    { value: '#f59e0b', label: 'Orange' },
    { value: '#eab308', label: 'Yellow' },
    { value: '#22c55e', label: 'Green' },
    { value: '#3b82f6', label: 'Blue' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#06b6d4', label: 'Cyan' },
  ]
  
  const handleEdit = (category) => {
    setEditingCategory(category)
    setValue('name', category.name)
    setValue('type', category.type)
    setValue('color', category.color)
    setValue('icon', category.icon)
    setIsFormOpen(true)
  }
  
  const handleDelete = (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div>
          <p className="mb-3">Are you sure you want to delete this category?</p>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              onClick={() => {
                deleteCategory(id)
                toast.success('Category deleted successfully! 🗑️', {
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
  
  const onSubmit = async (data) => {
    try {
      if (editingCategory) {
        updateCategory({ ...editingCategory, ...data })
        toast.success('Category updated successfully! ✏️', {
          position: "top-right",
          autoClose: 2000,
        })
      } else {
        addCategory(data)
        toast.success('New category added successfully! ➕', {
          position: "top-right",
          autoClose: 2000,
        })
      }
      setIsFormOpen(false)
      setEditingCategory(null)
      reset()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Error saving category! ❌', {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }
  
  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingCategory(null)
    reset()
  }
  
  const incomeCategories = categories.filter(cat => cat.type === 'income')
  const expenseCategories = categories.filter(cat => cat.type === 'expense')
  
  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your transaction categories
          </p>
        </div>
        
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Category
        </Button>
      </div>
      
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card>
          <Card.Header>
            <Card.Title className="text-green-600 dark:text-green-400">
              Income Categories ({incomeCategories.length})
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {incomeCategories.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No income categories yet
                </p>
              ) : (
                incomeCategories.map(category => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {category.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="p-1"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card.Content>
        </Card>
        
        
        <Card>
          <Card.Header>
            <Card.Title className="text-red-600 dark:text-red-400">
              Expense Categories ({expenseCategories.length})
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {expenseCategories.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No expense categories yet
                </p>
              ) : (
                expenseCategories.map(category => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {category.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="p-1"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card.Content>
        </Card>
      </div>
      
      
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <Input
            label="Category Name"
            placeholder="Enter category name"
            required
            error={errors.name?.message}
            {...register('name', { required: 'Category name is required' })}
          />
          
          
          <Select
            label="Category Type"
            required
            error={errors.type?.message}
            {...register('type', { required: 'Please select category type' })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    value={option.value}
                    {...register('color', { required: 'Please select a color' })}
                    className="sr-only"
                  />
                  <div className={`w-full p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    watchColor === option.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}>
                    <div className="flex items-center justify-center">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: option.value }}
                      />
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.color && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.color.message}
              </p>
            )}
          </div>
          
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex-1"
            >
              {editingCategory ? 'Update' : 'Add'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleFormCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Categories 