import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { db } from '../data/db'
import { useAuth } from '../context/AuthContext'
import ListingCard from '../components/ListingCard'
import './Profile.css'

const formatMemberSince = (dateStr) => {
  if (!dateStr) return 'Unknown'
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Profile() {
  const { username } = useParams()
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [profileUser, setProfileUser] = useState(null)
  const [listings, setListings] = useState([])
  const [form, setForm] = useState({ username: '', bio: '' })
  const [avatarPreview, setAvatarPreview] = useState('')

  const isAvatarImage = (avatar) => typeof avatar === 'string' && (avatar.startsWith('data:image/') || avatar.startsWith('http'))
  const isOwnProfile = Boolean(user && profileUser && user.id === profileUser.id)

  useEffect(() => {
    const u = db.getUserByUsername(username)
    if (u) {
      setProfileUser(u)
      setListings(db.getUserListings(u.id))
      setForm({ username: u.username || '', bio: u.bio || '' })
      setAvatarPreview(isAvatarImage(u.avatar) ? u.avatar : '')
    }
  }, [username])

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const ok = updateProfile({
      username: form.username,
      bio: form.bio,
      avatar: avatarPreview || (form.username || profileUser.username).slice(0, 2).toUpperCase()
    })

    if (ok) {
      const refreshed = db.getUser(user.id)
      if (refreshed) {
        setProfileUser(refreshed)
        setListings(db.getUserListings(refreshed.id))
        navigate(`/profile/${refreshed.username}`, { replace: true })
      }
    }
  }

  if (!profileUser) return (
    <div className="profile-notfound">
      <span>👤</span>
      <p>Profile not found</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  )

  return (
    <div className="profile-page page-enter">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {isAvatarImage(profileUser.avatar)
              ? <img src={profileUser.avatar} alt={profileUser.username} />
              : (profileUser.avatar || profileUser.username.slice(0,2).toUpperCase())}
          </div>
          <div className="profile-info">
            <h1>{profileUser.username}</h1>
            {profileUser.bio && <p className="profile-bio">{profileUser.bio}</p>}
            <div className="profile-meta">
              <span>📅 Member since {formatMemberSince(profileUser.joinedAt)}</span>
              <span>📦 {listings.length} listings</span>
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <form className="profile-form" onSubmit={handleSave}>
            <h2 className="section-title">Edit Profile</h2>
            <div className="profile-form-grid">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Photo Upload</label>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
              </div>
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary">Save Preferences</button>
          </form>
        )}

        <div className="profile-listings">
          <h2 className="section-title">{isOwnProfile ? 'My Listings' : `${profileUser.username}'s Listings`}</h2>
          {listings.length === 0 ? (
            <div className="profile-empty">
              <span>🎮</span>
              <p>No listings yet</p>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
