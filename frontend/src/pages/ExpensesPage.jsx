import { useEffect, useState } from 'react'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../api/expenses'
import { format } from 'date-fns'
import Modal from '../components/Modal'
import ExpenseForm from '../components/ExpenseForm'
import styles from './ExpensesPage.module.css'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = () => {
    setLoading(true)
    getExpenses().then(setExpenses).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleCreate = async (data) => {
    await createExpense(data)
    setShowAdd(false)
    load()
  }

  const handleUpdate = async (data) => {
    await updateExpense(editing.id, data)
    setEditing(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    await deleteExpense(id)
    load()
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>Expenses</h1>
        <button className="primary" onClick={() => setShowAdd(true)}>+ Add Expense</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : expenses.length === 0 ? (
        <div className={`card ${styles.empty}`}>
          <p>No expenses yet. Add your first one!</p>
        </div>
      ) : (
        <div className="card">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td>{format(new Date(e.date), 'MMM d, yyyy')}</td>
                  <td>{e.title}</td>
                  <td>
                    {e.category ? (
                      <span className={styles.badge} style={{ background: e.category.color + '22', color: e.category.color }}>
                        {e.category.name}
                      </span>
                    ) : (
                      <span className={styles.badgeGray}>Uncategorized</span>
                    )}
                  </td>
                  <td className={styles.amount}>${e.amount.toFixed(2)}</td>
                  <td className={styles.actions}>
                    <button className="ghost" onClick={() => setEditing(e)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <Modal title="Add Expense" onClose={() => setShowAdd(false)}>
          <ExpenseForm onSubmit={handleCreate} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Expense" onClose={() => setEditing(null)}>
          <ExpenseForm
            initial={{ ...editing, date: editing.date.slice(0, 10), category_id: editing.category_id ?? '' }}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  )
}
