import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

const Transactions = () => {
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setShowTransactionForm(true)
  }
  
  const handleFormSuccess = () => {
    setShowTransactionForm(false)
    setEditingTransaction(null)
  }
  
  const handleFormCancel = () => {
    setShowTransactionForm(false)
    setEditingTransaction(null)
  }
  
  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your income and expenses
          </p>
        </div>
        
        <Button onClick={() => setShowTransactionForm(true)}>
          <Plus size={20} className="mr-2" />
          New Transaction
        </Button>
      </div>
      
      
      <TransactionList onEdit={handleEdit} />
      
      
      <Modal
        isOpen={showTransactionForm}
        onClose={() => {
          setShowTransactionForm(false)
          setEditingTransaction(null)
        }}
        title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        size="md"
      >
        <TransactionForm
          transaction={editingTransaction}
          onSuccess={() => {
            setShowTransactionForm(false)
            setEditingTransaction(null)
          }}
          onCancel={() => {
            setShowTransactionForm(false)
            setEditingTransaction(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default Transactions 