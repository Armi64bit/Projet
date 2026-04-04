import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-game">Game</span><span className="logo-souk">Souk</span>
          </Link>
          <p>Tunisia's #1 Gaming Marketplace.<br />Trade. Game. Dominate.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Marketplace</h4>
            <Link to="/listings">Browse All</Link>
            <Link to="/listings?category=consoles">Consoles</Link>
            <Link to="/listings?category=pcs">PCs</Link>
            <Link to="/listings?category=accounts">Accounts</Link>
          </div>
          <div className="footer-col">
            <h4>My Account</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/sell">Sell Item</Link>
            <Link to="/inbox">Messages</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© 2025 GameSouk. All rights reserved.</span>
          <span>Made with ❤️ for Tunisian Gamers</span>
        </div>
      </div>
    </footer>
  )
}
