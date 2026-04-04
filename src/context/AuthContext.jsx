import React, { createContext, useContext, useState } from 'react'
import { db } from '../data/db'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gs_user')) } catch { return null }
  })
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }

  const login = (email, password) => {
    const found = db.login(email, password)
    if (found) {
      setUser(found)
      localStorage.setItem('gs_user', JSON.stringify(found))
      addToast(`Welcome back, ${found.username}!`, 'success')
      return true
    }
    addToast('Invalid email or password', 'error')
    return false
  }

  const register = (data) => {
    const created = db.register(data)
    if (created) {
      setUser(created)
      localStorage.setItem('gs_user', JSON.stringify(created))
      addToast(`Welcome to GameSouk, ${created.username}!`, 'success')
      return true
    }
    addToast('Email already in use', 'error')
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('gs_user')
    addToast('Logged out successfully', 'info')
  }

  const updateProfile = (data) => {
    if (!user) return false
    const updated = db.updateUser(user.id, data)
    if (!updated) {
      addToast('Username already taken', 'error')
      return false
    }
    setUser(updated)
    localStorage.setItem('gs_user', JSON.stringify(updated))
    addToast('Profile updated successfully', 'success')
    return true
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>{t.message}</div>
        ))}
      </div>
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
