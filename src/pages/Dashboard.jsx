import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../data/db'
import './Dashboard.css'

const formatMemberSince = (dateStr) => {
  if (!dateStr) return 'Unknown'
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Dashboard() {
  const { user, addToast } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [tab, setTab] = useState('listings')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    setListings(db.getUserListings(user.id))
  }, [user])

  const handleDelete = (id) => {
    if (!confirm('Delete this listing?')) return
    db.deleteListing(id)
    setListings(prev => prev.filter(l => l.id !== id))
    addToast('Listing deleted', 'success')
  }

  const handleToggleSold = (id) => {
    const l = db.getListing(id)
    const newStatus = l.status === 'sold' ? 'active' : 'sold'
    const soldAt = newStatus === 'sold' ? new Date().toISOString().split('T')[0] : null
    db.updateListing(id, { status: newStatus, soldAt })
    setListings(db.getUserListings(user.id))
    addToast(`Marked as ${newStatus}`, 'success')
  }

  return (
    <div className="dashboard page-enter">
      <div className="container">
        {/* PROFILE HEADER */}
        <div className="dash-header">
          <div className="dash-avatar">{user?.avatar || user?.username?.slice(0,2).toUpperCase()}</div>
          <div className="dash-user-info">
            <h1>{user?.username}</h1>
            <span>{user?.email}</span>
            <span className="dash-since">Member since {formatMemberSince(user?.joinedAt)}</span>
          </div>
          <Link to="/sell" className="btn btn-primary">+ New Listing</Link>
        </div>

        {/* STATS */}
        <div className="dash-stats">
          <div className="dash-stat">
            <span>{listings.length}</span>
            <label>Total Listings</label>
          </div>
          <div className="dash-stat">
            <span>{listings.filter(l => l.status === 'active').length}</span>
            <label>Active</label>
          </div>
          <div className="dash-stat">
            <span>{listings.filter(l => l.status === 'sold').length}</span>
            <label>Sold</label>
          </div>
        </div>

        {/* TABS */}
        <div className="dash-tabs">
          <button className={`dash-tab ${tab === 'listings' ? 'active' : ''}`} onClick={() => setTab('listings')}>My Listings</button>
          <button className={`dash-tab ${tab === 'messages' ? 'active' : ''}`} onClick={() => { setTab('messages'); navigate('/inbox') }}>Messages</button>
        </div>

        {/* LISTINGS TABLE */}
        {tab === 'listings' && (
          <div className="dash-listings">
            {listings.length === 0 ? (
              <div className="dash-empty">
                <span>🎮</span>
                <p>No listings yet. Start selling!</p>
                <Link to="/sell" className="btn btn-primary">Post Your First Listing</Link>
              </div>
            ) : (
              <div className="dash-table">
                {listings.map(l => (
                  <div key={l.id} className="dash-row">
                    <img src={l.images?.[0]} alt={l.title} className="dash-row-img" />
                    <div className="dash-row-info">
                      <Link to={`/listings/${l.id}`} className="dash-row-title">{l.title}</Link>
                      <div className="dash-row-meta">
                        <span className="badge badge-gray">{l.category}</span>
                        <span className="badge badge-gray">{l.condition}</span>
                        <span className={`badge ${l.status === 'sold' ? 'badge-red' : 'badge-green'}`}>
                          {l.status === 'sold' ? 'SOLD' : 'ACTIVE'}
                        </span>
                      </div>
                    </div>
                    <div className="dash-row-price">{l.price.toLocaleString()} TND</div>
                    <div className="dash-row-actions">
                      <Link to={`/sell/${l.id}`} className="btn btn-outline">Edit</Link>
                      <button className="btn btn-ghost" onClick={() => handleToggleSold(l.id)}>
                        {l.status === 'sold' ? 'Mark Active' : 'Mark Sold'}
                      </button>
                      <button className="btn btn-outline delete-btn" onClick={() => handleDelete(l.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
