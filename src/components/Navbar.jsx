import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/listings?search=${encodeURIComponent(search.trim())}`)
  }

  const avatarIsImage = typeof user?.avatar === 'string' && (user.avatar.startsWith('data:image/') || user.avatar.startsWith('http'))

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-game">Game</span><span className="logo-souk">Souk</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search games, consoles, accounts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="navbar-actions">
          <Link to="/listings" className={`nav-link ${location.pathname === '/listings' ? 'active' : ''}`}>Browse</Link>
          {user ? (
            <>
              <Link to="/sell" className="btn btn-primary nav-sell">+ Sell</Link>
              <Link to="/inbox" className="nav-link">💬 Inbox</Link>
              <div className="nav-user" onClick={() => setMenuOpen(!menuOpen)}>
                <div className="nav-avatar">
                  {avatarIsImage ? <img src={user.avatar} alt={user.username} /> : (user.avatar || user.username.slice(0,2).toUpperCase())}
                </div>
                <span>{user.username}</span>
                {menuOpen && (
                  <div className="nav-dropdown">
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)}>My Dashboard</Link>
                    <Link to={`/profile/${user.username}`} onClick={() => setMenuOpen(false)}>{`@${user.username}`}</Link>
                    <button onClick={() => { logout(); setMenuOpen(false); navigate('/') }}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
