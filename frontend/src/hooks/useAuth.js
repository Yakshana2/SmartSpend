import { useState, useCallback } from 'react'
import { login as apiLogin, register as apiRegister } from '../api/auth'

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiLogin(email, password)
      localStorage.setItem('token', data.access_token)
      setToken(data.access_token)
      return true
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (email, password, fullName) => {
    setLoading(true)
    setError(null)
    try {
      await apiRegister(email, password, fullName)
      return await login(email, password)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [login])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
  }, [])

  return { token, error, loading, login, register, logout }
}
