const API_BASE = 'http://localhost:3001/api'

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🎮' },
  { id: 'accounts', label: 'Accounts', icon: '👤' },
  { id: 'pcs', label: 'PCs & Laptops', icon: '💻' },
  { id: 'consoles', label: 'Consoles', icon: '🕹️' },
  { id: 'games', label: 'Games', icon: '📀' },
  { id: 'peripherals', label: 'Peripherals', icon: '🖱️' },
  { id: 'other', label: 'Other', icon: '📦' },
]

export const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Used']

export const db = {
  getStats: async () => {
    const response = await fetch(`${API_BASE}/stats`)
    if (!response.ok) throw new Error('Failed to get stats')
    return await response.json()
  },

  getListings: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const response = await fetch(`${API_BASE}/listings?${params}`)
    if (!response.ok) throw new Error('Failed to get listings')
    return await response.json()
  },

  getListing: async (id) => {
    const response = await fetch(`${API_BASE}/listings/${id}`)
    if (!response.ok) throw new Error('Failed to get listing')
    return await response.json()
  },

  createListing: async (data) => {
    const response = await fetch(`${API_BASE}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create listing')
    return await response.json()
  },

  deleteListing: async (id) => {
    const response = await fetch(`${API_BASE}/listings/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete listing')
    return await response.json()
  },

  updateListing: async (id, data) => {
    const response = await fetch(`${API_BASE}/listings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update listing')
    return await response.json()
  },

  getUser: async (id) => {
    const response = await fetch(`${API_BASE}/users/${id}`)
    if (!response.ok) throw new Error('Failed to get user')
    return await response.json()
  },

  getUserByUsername: async (username) => {
    const response = await fetch(`${API_BASE}/users/username/${username}`)
    if (!response.ok) throw new Error('Failed to get user by username')
    return await response.json()
  },

  updateUser: async (id, data) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update user')
    return await response.json()
  },

  getUserListings: async (userId) => {
    const response = await fetch(`${API_BASE}/users/${userId}/listings`)
    if (!response.ok) throw new Error('Failed to get user listings')
    return await response.json()
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) throw new Error('Login failed')
    return await response.json()
  },

  register: async (data) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Registration failed')
    return await response.json()
  },

  getConversations: async (userId) => {
    const response = await fetch(`${API_BASE}/conversations/${userId}`)
    if (!response.ok) throw new Error('Failed to get conversations')
    return await response.json()
  },

  getMessages: async (conversationId) => {
    const response = await fetch(`${API_BASE}/messages/${conversationId}`)
    if (!response.ok) throw new Error('Failed to get messages')
    return await response.json()
  },

  createMessage: async (data) => {
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create message')
    return await response.json()
  },

  createConversation: async (data) => {
    const response = await fetch(`${API_BASE}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create conversation')
    return await response.json()
  },

  getOrCreateConversation: async (buyerId, sellerId, listingId) => {
    try {
      // First try to get existing conversations
      const conversations = await db.getConversations(buyerId)
      
      // Look for existing conversation with this seller and listing
      const existingConv = conversations.find(conv => 
        conv.listingId === listingId && 
        (conv.buyerId === buyerId || conv.sellerId === buyerId) &&
        (conv.buyerId === sellerId || conv.sellerId === sellerId)
      )
      
      if (existingConv) {
        return existingConv
      }
      
      // Create new conversation if none exists
      const newConv = await db.createConversation({
        buyerId,
        sellerId,
        listingId
      })
      
      return newConv
    } catch (error) {
      console.error('Error getting or creating conversation:', error)
      throw error
    }
  }
}
