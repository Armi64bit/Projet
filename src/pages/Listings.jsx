import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { db, CATEGORIES, CONDITIONS } from '../data/db'
import ListingCard from '../components/ListingCard'
import './Listings.css'

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    sort: 'newest'
  })

  useEffect(() => {
    const loadListings = async () => {
      try {
        const results = await db.getListings(filters)
        setListings(results)
      } catch (error) {
        console.error('Error loading listings:', error)
      }
    }
    
    loadListings()
  }, [filters])

  const updateFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }))
  }

  const clearFilters = () => {
    setFilters({ category: 'all', search: '', minPrice: '', maxPrice: '', condition: '', sort: 'newest' })
    setSearchParams({})
  }

  return (
    <div className="listings-page page-enter">
      <div className="container">
        <div className="listings-page-header">
          <h1>Browse Listings</h1>
          <span className="results-count">{listings.length} results</span>
        </div>

        {/* CATEGORY TABS */}
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`cat-tab ${filters.category === cat.id ? 'active' : ''}`}
              onClick={() => updateFilter('category', cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div className="listings-page-body">
          {/* SIDEBAR */}
          <aside className="filters-sidebar">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Keywords..."
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Price Range (TND)</label>
              <div className="price-range">
                <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} className="filter-input" />
                <span>—</span>
                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} className="filter-input" />
              </div>
            </div>
            <div className="filter-group">
              <label>Condition</label>
              <select value={filters.condition} onChange={e => updateFilter('condition', e.target.value)} className="filter-input">
                <option value="">Any condition</option>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Sort By</label>
              <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} className="filter-input">
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            <button className="btn btn-ghost" style={{width:'100%'}} onClick={clearFilters}>Clear Filters</button>
          </aside>

          {/* GRID */}
          <div>
            {listings.length === 0 ? (
              <div className="no-results">
                <span>🎮</span>
                <p>No listings found. Try different filters.</p>
              </div>
            ) : (
              <div className="listings-grid">
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
