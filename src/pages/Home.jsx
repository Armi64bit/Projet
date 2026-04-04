import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { db, CATEGORIES } from '../data/db'
import { useAuth } from '../context/AuthContext'
import ListingCard from '../components/ListingCard'
import './Home.css'

function AnimatedCount({ value, duration = 900 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    let animationFrame

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const next = Math.round(progress * value)
      setCount(next)
      if (progress < 1) animationFrame = window.requestAnimationFrame(step)
    }

    animationFrame = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}

export default function Home() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState({ activeListings: 0, gamers: 0, dailySales: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    setListings(db.getListings().slice(0, 8))
    setStats(db.getStats())
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/listings?search=${encodeURIComponent(search.trim())}`)
    else navigate('/listings')
  }

  const handleStartSelling = () => {
    navigate(user ? '/sell' : '/login')
  }

  return (
    <div className="home page-enter">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge badge badge-red">🎮 Tunisia's #1 Gaming Marketplace</div>
          <h1 className="hero-title">
            <span className="hero-title-main">Trade.</span>
            <span className="hero-title-main">Game.</span>
            <span className="hero-title-accent">Dominate.</span>
          </h1>
          <p className="hero-sub">Buy and sell gaming accounts, PCs, consoles, peripherals and more. Join thousands of Tunisian gamers.</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for PS5, RTX 4090, Valorant account..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <div className="hero-stats">
            <div className="hero-stat"><AnimatedCount value={stats.activeListings} /><label>Active Listings</label></div>
            <div className="hero-stat"><AnimatedCount value={stats.gamers} /><label>Gamers</label></div>
            <div className="hero-stat"><AnimatedCount value={stats.dailySales} /><label>Daily Sales</label></div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <Link key={cat.id} to={`/listings?category=${cat.id}`} className="cat-card">
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-label">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST LISTINGS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Listings</h2>
            <Link to="/listings" className="btn btn-ghost">View All →</Link>
          </div>
          <div className="listings-grid">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-glow"></div>
            <h2>Ready to sell your gear?</h2>
            <p>Post your listing in under 2 minutes. It's free.</p>
            <button type="button" className="btn btn-primary" onClick={handleStartSelling}>Start Selling</button>
          </div>
        </div>
      </section>
    </div>
  )
}
