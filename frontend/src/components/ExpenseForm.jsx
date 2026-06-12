import { useState, useEffect } from 'react'
import { getCategories } from '../api/categories'
import styles from './ExpenseForm.module.css'

export default function ExpenseForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    category_id: '',
    ...initial,
  })
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!form.title || !form.amount || !form.date) {
      setError('Title, amount and date are required')
      return
    }
    setLoading(true)
    try {
      await onSubmit({
        ...form,
        amount: parseFloat(form.amount),
        category_id: form.category_id ? parseInt(form.category_id) : null,
        date: new Date(form.date).toISOString(),
      })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Grocery shopping" />
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="amount">Amount ($)</label>
          <input id="amount" name="amount" type="number" step="0.01" min="0" value={form.amount} onChange={handleChange} placeholder="0.00" />
        </div>
        <div className={styles.field}>
          <label htmlFor="date">Date</label>
          <input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="category_id">Category</label>
        <select id="category_id" name="category_id" value={form.category_id} onChange={handleChange}>
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="description">Description (optional)</label>
        <textarea id="description" name="description" rows={2} value={form.description} onChange={handleChange} placeholder="Additional notes..." />
      </div>
      {error && <p className="error-msg">{error}</p>}
      <div className={styles.actions}>
        <button type="button" className="ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
