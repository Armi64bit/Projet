import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db } from '../data/db'
import './Inbox.css'

export default function Inbox() {
  const { convId } = useParams()
  const { user, addToast } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimerRef = useRef(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    loadConversations()
  }, [user])

  useEffect(() => {
    if (convId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === convId)
      if (conv) openConversation(conv)
    }
  }, [convId, conversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = () => {
    const convs = db.getConversations(user.id)
    setConversations(convs)
  }

  const openConversation = (conv) => {
    setActiveConv(conv)
    const msgs = db.getMessages(conv.id)
    setMessages(msgs)
    db.markRead(conv.id, user.id)
    navigate(`/inbox/${conv.id}`, { replace: true })
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim() || !activeConv) return
    const msg = db.sendMessage(activeConv.id, user.id, input.trim())
    setMessages(prev => [...prev, msg])
    setInput('')
    loadConversations()

    // Simulate reply after 1-2s
    const delay = 1000 + Math.random() * 1000
    setTyping(true)
    typingTimerRef.current = setTimeout(() => {
      const replies = [
        "Hey! Is this still available?",
        "Can you do a better price?",
        "I'm interested! Where are you located?",
        "Is there any warranty?",
        "Can I see more photos?",
        "What's the lowest you'd go?",
        "Perfect condition?",
        "I can pick it up today if you want!"
      ]
      const reply = db.sendMessage(activeConv.id, activeConv.otherUser?.id || '2', replies[Math.floor(Math.random() * replies.length)])
      setMessages(prev => [...prev, reply])
      setTyping(false)
      loadConversations()
    }, delay)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e) }
  }

  const getUnreadCount = (conv) => {
    return db.getMessages(conv.id).filter(m => !m.read && m.senderId !== user.id).length
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts)
    const now = new Date()
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString()
  }

  if (!user) return null

  return (
    <div className="inbox-page page-enter">
      {/* CONVERSATIONS LIST */}
      <div className={`inbox-sidebar ${activeConv ? 'hidden-mobile' : ''}`}>
        <div className="inbox-sidebar-header">
          <h2>Messages</h2>
          <span className="conv-count">{conversations.length}</span>
        </div>
        {conversations.length === 0 ? (
          <div className="inbox-empty">
            <span>💬</span>
            <p>No conversations yet</p>
            <Link to="/listings" className="btn btn-primary" style={{fontSize:'13px',padding:'10px 20px'}}>Browse Listings</Link>
          </div>
        ) : (
          <div className="conv-list">
            {conversations.map(conv => {
              const unread = getUnreadCount(conv)
              return (
                <div
                  key={conv.id}
                  className={`conv-item ${activeConv?.id === conv.id ? 'active' : ''}`}
                  onClick={() => openConversation(conv)}
                >
                  <div className="conv-avatar">{conv.otherUser?.username?.slice(0,2).toUpperCase() || '??'}</div>
                  <div className="conv-info">
                    <div className="conv-top">
                      <span className="conv-username">{conv.otherUser?.username || 'Unknown'}</span>
                      <span className="conv-time">{formatTime(conv.lastMsg?.createdAt)}</span>
                    </div>
                    <div className="conv-bottom">
                      <span className="conv-preview">{conv.listing?.title || 'Listing'}</span>
                      {unread > 0 && <span className="unread-badge">{unread}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* CHAT WINDOW */}
      <div className={`chat-window ${!activeConv ? 'hidden-mobile' : ''}`}>
        {!activeConv ? (
          <div className="chat-placeholder">
            <span>🎮</span>
            <p>Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            {/* CHAT HEADER */}
            <div className="chat-header">
              <button className="back-btn" onClick={() => { setActiveConv(null); navigate('/inbox') }}>← Back</button>
              <div className="chat-header-user">
                <div className="chat-avatar">{activeConv.otherUser?.username?.slice(0,2).toUpperCase()}</div>
                <div>
                  <span className="chat-username">{activeConv.otherUser?.username}</span>
                  <span className="chat-status">Active</span>
                </div>
              </div>
              {activeConv.listing && (
                <Link to={`/listings/${activeConv.listing.id}`} className="chat-listing-pin">
                  <img src={activeConv.listing.images?.[0]} alt="" />
                  <div>
                    <span>{activeConv.listing.title}</span>
                    <strong>{activeConv.listing.price?.toLocaleString()} TND</strong>
                  </div>
                </Link>
              )}
            </div>

            {/* MESSAGES */}
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="chat-start">
                  <span>👋</span>
                  <p>Start the conversation about {activeConv.listing?.title}</p>
                </div>
              )}
              {messages.map((msg, i) => {
                const isMine = msg.senderId === user.id
                const showAvatar = !isMine && (i === 0 || messages[i-1]?.senderId !== msg.senderId)
                return (
                  <div key={msg.id} className={`msg-row ${isMine ? 'mine' : 'theirs'}`}>
                    {!isMine && showAvatar && (
                      <div className="msg-avatar">{activeConv.otherUser?.username?.slice(0,2).toUpperCase()}</div>
                    )}
                    {!isMine && !showAvatar && <div className="msg-avatar-spacer" />}
                    <div className="msg-bubble-wrap">
                      <div className="msg-bubble">{msg.content}</div>
                      <span className="msg-time">
                        {formatTime(msg.createdAt)}
                        {isMine && <span className="msg-read">{msg.read ? ' ✓✓' : ' ✓'}</span>}
                      </span>
                    </div>
                  </div>
                )
              })}
              {typing && (
                <div className="msg-row theirs">
                  <div className="msg-avatar">{activeConv.otherUser?.username?.slice(0,2).toUpperCase()}</div>
                  <div className="msg-bubble typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <form className="chat-input-bar" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button type="submit" className="btn btn-primary send-btn" disabled={!input.trim()}>Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
