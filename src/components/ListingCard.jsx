import React from 'react'
import { Link } from 'react-router-dom'
import './ListingCard.css'

export default function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing.id}`} className="listing-card">
      <div className="listing-card-img">
        <img src={listing.images?.[0] || 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop'} alt={listing.title} loading="lazy" />
        {listing.status === 'sold' && <div className="sold-overlay">SOLD</div>}
        <span className="listing-card-category">{listing.category}</span>
      </div>
      <div className="listing-card-body">
        <h3 className="listing-card-title">{listing.title}</h3>
        <div className="listing-card-meta">
          <span className="listing-card-condition badge badge-gray">{listing.condition}</span>
          <span className="listing-card-location">📍 {listing.location}</span>
        </div>
        <div className="listing-card-footer">
          <span className="listing-card-price">{listing.price.toLocaleString()} TND</span>
          <span className="listing-card-seller">@{listing.seller}</span>
        </div>
      </div>
    </Link>
  )
}
