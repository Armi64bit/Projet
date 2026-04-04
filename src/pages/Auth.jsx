import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const ok = login(form.email, form.password)
      if (ok) navigate('/')
      setLoading(false)
    }, 400)
  }

  return (
    <div className="auth-page page-enter">
      <div className="auth-box">
        <div className="auth-logo"><span className="logo-game">Game</span><span className="logo-souk">Souk</span></div>
        <h1>Welcome back</h1>
        <p className="auth-sub">Login to your GameSouk account</p>
        <div className="auth-hint">Demo: <strong>ahmed@gamesouk.tn</strong> / <strong>123456</strong></div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', bio: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password.length < 6) return
    setLoading(true)
    setTimeout(() => {
      const ok = register(form)
      if (ok) navigate('/')
      setLoading(false)
    }, 400)
  }

  return (
    <div className="auth-page page-enter">
      <div className="auth-box">
        <div className="auth-logo"><span className="logo-game">Game</span><span className="logo-souk">Souk</span></div>
        <h1>Join GameSouk</h1>
        <p className="auth-sub">Create your free account and start trading</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input type="text" required minLength={3} value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="GamerTag123" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}
