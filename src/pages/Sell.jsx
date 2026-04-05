import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db, CATEGORIES, CONDITIONS } from '../data/db'
import './Sell.css'

export default function Sell() {
  const { user, addToast } = useAuth()
  const navigate = useNavigate()
  const { id: editId } = useParams()
  const isEditing = Boolean(editId)
  const [form, setForm] = useState({
    title: '', description: '', category: 'consoles',
    condition: 'Good', price: '', location: 'Tunis'
  })
  const [loading, setLoading] = useState(false)
  const [previews, setPreviews] = useState([])

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  useEffect(() => {
    if (!isEditing) return
    
    const loadListing = async () => {
      try {
        const listing = await db.getListing(editId)
        if (!listing) {
          addToast('Listing not found', 'error')
          navigate('/dashboard')
          return
        }
        if (listing.sellerId !== user?.id) {
          addToast('You can only edit your own listing', 'error')
          navigate('/dashboard')
          return
        }

        setForm({
          title: listing.title || '',
          description: listing.description || '',
          category: listing.category || 'consoles',
          condition: listing.condition || 'Good',
          price: String(listing.price ?? ''),
          location: listing.location || 'Tunis'
        })
        setPreviews(Array.isArray(listing.images) ? listing.images : [])
      } catch (error) {
        console.error('Error loading listing:', error)
        addToast('Failed to load listing', 'error')
        navigate('/dashboard')
      }
    }
    
    loadListing()
  }, [isEditing, editId, user, addToast, navigate])

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) {
      setPreviews([])
      return
    }

    const maxFiles = 6
    if (files.length > maxFiles) {
      addToast(`You can upload up to ${maxFiles} images`, 'error')
      e.target.value = ''
      return
    }

    const maxSize = 5 * 1024 * 1024
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        addToast('Please choose image files only', 'error')
        e.target.value = ''
        return
      }
      if (file.size > maxSize) {
        addToast('Each image must be smaller than 5MB', 'error')
        e.target.value = ''
        return
      }
    }

    const readFile = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    try {
      const results = await Promise.all(files.map(readFile))
      setPreviews(results.filter(r => typeof r === 'string'))
    } catch {
      addToast('Could not read selected images', 'error')
      setPreviews([])
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.description) {
      addToast('Please fill all required fields', 'error'); return
    }
    setLoading(true)
    
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        seller: user.username,
        sellerId: user.id,
        images: previews,
      }

      if (isEditing) {
        await db.updateListing(editId, payload)
        addToast('Listing updated successfully ✨', 'success')
      } else {
        await db.createListing(payload)
        addToast('Listing posted successfully! 🎮', 'success')
      }
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving listing:', error)
      addToast('Failed to save listing', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sell-page page-enter">
      <div className="container">
        <div className="sell-header">
          <h1>{isEditing ? 'Edit Listing' : 'Post a Listing'}</h1>
          <p>{isEditing ? 'Update your listing details below' : 'Fill in the details below to list your item on GameSouk'}</p>
        </div>

        <div className="sell-grid">
          <form className="sell-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Item Details</h2>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" required placeholder="e.g. PS5 Digital Edition" value={form.title} onChange={e => update('title', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => update('category', e.target.value)}>
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Condition *</label>
                  <select value={form.condition} onChange={e => update('condition', e.target.value)}>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea required placeholder="Describe your item in detail — include specs, accessories, reason for selling..." value={form.description} onChange={e => update('description', e.target.value)} />
              </div>
            </div>

            <div className="form-section">
              <h2>Pricing & Location</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (TND) *</label>
                  <input type="number" required min="1" placeholder="0" value={form.price} onChange={e => update('price', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <select value={form.location} onChange={e => update('location', e.target.value)}>
                    {['Tunis','Sfax','Sousse','Bizerte','Monastir','Nabeul','Kairouan','Gabès'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Image Upload (optional)</h2>
              <div className="form-group">
                <label>Upload Images (up to 6)</label>
                <input type="file" accept="image/*" multiple onChange={handleFileChange} />
              </div>
              {previews.length > 0 && (
                <div className="img-preview-grid">
                  {previews.map((src, idx) => (
                    <div key={idx} className="img-preview">
                      <img src={src} alt={`preview-${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary sell-submit" disabled={loading}>
              {loading ? (isEditing ? 'Saving...' : 'Posting...') : (isEditing ? '💾 Save Changes' : '🚀 Post Listing')}
            </button>
          </form>

          {/* LIVE PREVIEW */}
          <div className="sell-preview">
            <h3>Preview</h3>
            <div className="preview-card">
              <div className="preview-img">
                {previews[0] ? <img src={previews[0]} alt="preview" /> : <span>🎮</span>}
              </div>
              <div className="preview-body">
                <span className="preview-category badge badge-gray">{form.category}</span>
                <p className="preview-title">{form.title || 'Your listing title'}</p>
                <div className="preview-footer">
                  <strong className="preview-price">{form.price ? `${Number(form.price).toLocaleString()} TND` : '0 TND'}</strong>
                  <span className="preview-seller">@{user?.username}</span>
                </div>
              </div>
            </div>
            <p className="preview-hint">This is how your listing will appear to buyers</p>
          </div>
        </div>
      </div>
    </div>
  )
}
