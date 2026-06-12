import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getSummary, getExpenses } from '../api/expenses'
import styles from './DashboardPage.module.css'

const COLORS = ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#06b6d4', '#a855f7']

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getSummary().catch(() => ({ total: 0, count: 0, by_category: [] })),
      getExpenses({ limit: 5 }).catch(() => []),
    ]).then(([s, r]) => {
      setSummary(s)
      setRecent(r)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className={styles.page}>
      <h1>Dashboard</h1>

      <div className={styles.statsRow}>
        <div className="card">
          <p className={styles.statLabel}>Total Spent</p>
          <p className={styles.statValue}>${summary?.total?.toFixed(2) ?? '0.00'}</p>
        </div>
        <div className="card">
          <p className={styles.statLabel}>Transactions</p>
          <p className={styles.statValue}>{summary?.count ?? 0}</p>
        </div>
        <div className="card">
          <p className={styles.statLabel}>Categories</p>
          <p className={styles.statValue}>{summary?.by_category?.length ?? 0}</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className="card">
          <h2>Spending by Category</h2>
          {summary?.by_category?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={summary.by_category}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {summary.by_category.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className={styles.empty}>No data yet. Add some expenses!</p>
          )}
        </div>

        <div className="card">
          <h2>Recent Expenses</h2>
          {recent.length > 0 ? (
            <ul className={styles.list}>
              {recent.map((e) => (
                <li key={e.id} className={styles.item}>
                  <span className={styles.itemTitle}>{e.title}</span>
                  <span className={styles.itemAmt}>${e.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>No expenses yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
