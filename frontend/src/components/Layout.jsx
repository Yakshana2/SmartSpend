import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Layout.module.css'

export default function Layout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.shell}>
      <nav className={styles.sidebar}>
        <div className={styles.logo}>💰 SmartSpend</div>
        <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/expenses" className={({ isActive }) => isActive ? styles.active : ''}>
          Expenses
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => isActive ? styles.active : ''}>
          Categories
        </NavLink>
        <button className={`ghost ${styles.logoutBtn}`} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
