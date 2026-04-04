import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { db } from '../data/db'
import { useAuth } from '../context/AuthContext'
import './ListingDetail.css'

const formatMemberSince = (dateStr) => {
  if (!dateStr) return 'Unknown'
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function ListingDetail() {
  const { id } = useParams()
  const { user, addToast } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    const l = db.getListing(id)
    if (!l) navigate('/listings')
    else setListing(l)
  }, [id])

  const handleMessage = () => {
    if (!user) { addToast('Please login to message the seller', 'error'); navigate('/login'); return; }
    if (user.id === listing.sellerId) { addToast('This is your own listing!', 'info'); return; }
    const conv = db.getOrCreateConversation(user.id, listing.sellerId, listing.id)
    navigate(`/inbox/${conv.id}`)
  }

  if (!listing) return <div className="loading">Loading...</div>

  const images = listing.images?.length ? listing.images : []
  const hasImages = images.length > 0

  const goToImage = (nextIndex) => {
    if (!hasImages) return
    const normalized = (nextIndex + images.length) % images.length
    setImgIdx(normalized)
  }

  const handlePrevImage = () => goToImage(imgIdx - 1)
  const handleNextImage = () => goToImage(imgIdx + 1)

  const seller = db.getUser(listing.sellerId)
  const sellerListings = db.getUserListings(listing.sellerId).filter(l => l.id !== id).slice(0, 4)

  return (
    <div className="listing-detail page-enter">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/listings">Listings</Link> / <span>{listing.title}</span>
        </div>

        <div className="detail-grid">
          {/* IMAGES */}
          <div className="detail-images">
            <div className="detail-main-img">
              {hasImages ? (
                <img key={imgIdx} className="detail-main-photo" src={images[imgIdx]} alt={`${listing.title} ${imgIdx + 1}`} />
              ) : (
                <div className="detail-no-image">No Image</div>
              )}
              {hasImages && images.length > 1 && (
                <>
                  <button type="button" className="photo-nav photo-nav-left" onClick={handlePrevImage} aria-label="Previous photo">‹</button>
                  <button type="button" className="photo-nav photo-nav-right" onClick={handleNextImage} aria-label="Next photo">›</button>
                  <span className="photo-count">{imgIdx + 1} / {images.length}</span>
                </>
              )}
              {listing.status === 'sold' && <div className="sold-badge-big">SOLD</div>}
            </div>
          </div>

          {/* INFO */}
          <div className="detail-info">
            <div className="detail-category-row">
              <span className="badge badge-gray">{listing.category}</span>
              <span className="badge badge-gray">{listing.condition}</span>
              <span className="detail-location">📍 {listing.location}</span>
            </div>

            <h1 className="detail-title">{listing.title}</h1>
            <div className="detail-price">{listing.price.toLocaleString()} TND</div>

            <div className="detail-desc">
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>

            {/* SELLER */}
            <div className="detail-seller">
              <div className="seller-avatar">{seller?.username?.slice(0,2).toUpperCase() || '??'}</div>
              <div className="seller-info">
                <Link to={`/profile/${seller?.username}`} className="seller-name">{seller?.username}</Link>
                <span className="seller-since">Member since {formatMemberSince(seller?.joinedAt)}</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="detail-actions">
              {user?.id === listing.sellerId ? (
                <div className="owner-actions">
                  <span className="badge badge-green">✓ Your listing</span>
                  <Link to={`/sell/${listing.id}`} className="btn btn-ghost">Edit</Link>
                  <button className="btn btn-outline" onClick={() => {
                    if (confirm('Delete this listing?')) {
                      db.deleteListing(listing.id)
                      addToast('Listing deleted', 'success')
                      navigate('/dashboard')
                    }
                  }}>Delete</button>
                </div>
              ) : (
                <>
                  <button className="btn btn-primary" style={{flex:1}} onClick={handleMessage} disabled={listing.status === 'sold'}>
                    💬 Message Seller
                  </button>
                </>
              )}
            </div>

            <div className="detail-meta">
              <span>Listed on {listing.createdAt}</span>
            </div>
          </div>
        </div>

        {/* MORE FROM SELLER */}
        {sellerListings.length > 0 && (
          <div className="more-from-seller">
            <h2 className="section-title">More from {seller?.username}</h2>
            <div className="listings-grid">
              {sellerListings.map(l => (
                <Link key={l.id} to={`/listings/${l.id}`} className="listing-card mini">
                  <img src={l.images?.[0]} alt={l.title} />
                  <div className="mini-info">
                    <span>{l.title}</span>
                    <strong>{l.price.toLocaleString()} TND</strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
