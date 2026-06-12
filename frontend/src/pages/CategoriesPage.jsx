import { useEffect, useState } from 'react'
import { getCategories, createCategory, deleteCategory } from '../api/categories'
import styles from './CategoriesPage.module.css'

const DEFAULT_COLORS = ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#06b6d4', '#a855f7', '#ec4899']

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = () => getCategories().then(setCategories)

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setError(null)
    setLoading(true)
    try {
      await createCategory({ name: name.trim(), color })
      setName('')
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Expenses will become uncategorized.')) return
    await deleteCategory(id)
    load()
  }

  return (
    <div>
      <h1 className={styles.heading}>Categories</h1>

      <div className={styles.grid}>
        <div className="card">
          <h2>Add Category</h2>
          <form onSubmit={handleAdd} className={styles.form}>
            <div>
              <label htmlFor="catName">Name</label>
              <input id="catName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Food" required />
            </div>
            <div>
              <label>Color</label>
              <div className={styles.colorPicker}>
                {DEFAULT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`${styles.swatch} ${color === c ? styles.selected : ''}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Your Categories</h2>
          {categories.length === 0 ? (
            <p className={styles.empty}>No categories yet.</p>
          ) : (
            <ul className={styles.list}>
              {categories.map((c) => (
                <li key={c.id} className={styles.item}>
                  <span className={styles.dot} style={{ background: c.color }} />
                  <span className={styles.catName}>{c.name}</span>
                  <button className="danger" onClick={() => handleDelete(c.id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
