import express from 'express'
import cors from 'cors'
import { connectDB } from './src/data/mongodb.js'
import { CATEGORIES, CONDITIONS } from './src/data/db.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Get stats
app.get('/api/stats', async (req, res) => {
  try {
    const database = await connectDB()
    const today = new Date().toISOString().split('T')[0]
    
    const [activeListingsCount, gamersCount, dailySalesCount] = await Promise.all([
      database.collection('listings').countDocuments({ status: { $ne: 'sold' } }),
      database.collection('users').countDocuments(),
      database.collection('listings').countDocuments({ 
        status: 'sold', 
        soldAt: today 
      })
    ])
    
    res.json({ 
      activeListings: activeListingsCount, 
      gamers: gamersCount, 
      dailySales: dailySalesCount 
    })
  } catch (error) {
    console.error('Error getting stats:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

// Get listings
app.get('/api/listings', async (req, res) => {
  try {
    const database = await connectDB()
    let query = {}
    
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category
    }
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' }
    }
    if (req.query.minPrice) {
      query.price = { $gte: Number(req.query.minPrice) }
    }
    if (req.query.maxPrice) {
      query.price = { ...query.price, $lte: Number(req.query.maxPrice) }
    }
    if (req.query.condition) {
      query.condition = req.query.condition
    }
    
    let cursor = database.collection('listings').find(query)
    
    if (req.query.sort === 'price-asc') {
      cursor = cursor.sort({ price: 1 })
    } else if (req.query.sort === 'price-desc') {
      cursor = cursor.sort({ price: -1 })
    } else {
      cursor = cursor.sort({ createdAt: -1 })
    }
    
    const listings = await cursor.toArray()
    res.json(listings)
  } catch (error) {
    console.error('Error getting listings:', error)
    res.status(500).json({ error: 'Failed to get listings' })
  }
})

// Get single listing
app.get('/api/listings/:id', async (req, res) => {
  try {
    const database = await connectDB()
    const listing = await database.collection('listings').findOne({ id: req.params.id })
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' })
    }
    
    res.json(listing)
  } catch (error) {
    console.error('Error getting listing:', error)
    res.status(500).json({ error: 'Failed to get listing' })
  }
})

// Create listing
app.post('/api/listings', async (req, res) => {
  try {
    const database = await connectDB()
    const nextId = await getNextId('listings')
    
    const listing = { 
      ...req.body, 
      id: String(nextId), 
      createdAt: new Date().toISOString().split('T')[0], 
      status: 'active' 
    }
    
    await database.collection('listings').insertOne(listing)
    res.status(201).json(listing)
  } catch (error) {
    console.error('Error creating listing:', error)
    res.status(500).json({ error: 'Failed to create listing' })
  }
})

// Update listing
app.put('/api/listings/:id', async (req, res) => {
  try {
    const database = await connectDB()
    const result = await database.collection('listings').updateOne(
      { id: req.params.id },
      { $set: req.body }
    )
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Listing not found' })
    }
    
    const updatedListing = await database.collection('listings').findOne({ id: req.params.id })
    res.json(updatedListing)
  } catch (error) {
    console.error('Error updating listing:', error)
    res.status(500).json({ error: 'Failed to update listing' })
  }
})

// Delete listing
app.delete('/api/listings/:id', async (req, res) => {
  try {
    const database = await connectDB()
    const result = await database.collection('listings').deleteOne({ id: req.params.id })
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Listing not found' })
    }
    
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting listing:', error)
    res.status(500).json({ error: 'Failed to delete listing' })
  }
})

// Get user
app.get('/api/users/:id', async (req, res) => {
  try {
    const database = await connectDB()
    const user = await database.collection('users').findOne({ id: req.params.id })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error getting user:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

// Get user by username
app.get('/api/users/username/:username', async (req, res) => {
  try {
    const database = await connectDB()
    const user = await database.collection('users').findOne({ username: req.params.username })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error getting user by username:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const database = await connectDB()
    
    const nextUsername = req.body.username?.trim()
    if (nextUsername) {
      const existingUser = await database.collection('users').findOne({
        username: nextUsername,
        id: { $ne: req.params.id }
      })
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' })
      }
    }

    const updateData = {
      ...req.body,
      ...(nextUsername ? { username: nextUsername } : {})
    }

    const result = await database.collection('users').updateOne(
      { id: req.params.id },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (nextUsername) {
      await database.collection('listings').updateMany(
        { sellerId: req.params.id },
        { $set: { seller: nextUsername } }
      )
    }

    const updatedUser = await database.collection('users').findOne({ id: req.params.id })
    res.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// Get user listings
app.get('/api/users/:userId/listings', async (req, res) => {
  try {
    const database = await connectDB()
    const listings = await database.collection('listings').find({ sellerId: req.params.userId }).toArray()
    res.json(listings)
  } catch (error) {
    console.error('Error getting user listings:', error)
    res.status(500).json({ error: 'Failed to get user listings' })
  }
})

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const database = await connectDB()
    const { email, password } = req.body
    
    const user = await database.collection('users').findOne({ email, password })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const database = await connectDB()
    
    const existingUser = await database.collection('users').findOne({ email: req.body.email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }
    
    const nextId = await getNextId('users')
    const user = { 
      ...req.body, 
      id: String(nextId), 
      avatar: req.body.username.slice(0, 2).toUpperCase(), 
      joinedAt: new Date().toISOString().split('T')[0] 
    }
    
    await database.collection('users').insertOne(user)
    res.status(201).json(user)
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Get conversations
app.get('/api/conversations/:userId', async (req, res) => {
  try {
    const database = await connectDB()
    const conversations = await database.collection('conversations')
      .find({ $or: [{ buyerId: req.params.userId }, { sellerId: req.params.userId }] })
      .toArray()
    
    const enrichedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const listing = await database.collection('listings').findOne({ id: conversation.listingId })
        const otherUser = await database.collection('users').findOne({
          id: conversation.buyerId === req.params.userId ? conversation.sellerId : conversation.buyerId
        })
        
        return {
          ...conversation,
          listing,
          otherUser
        }
      })
    )
    
    res.json(enrichedConversations)
  } catch (error) {
    console.error('Error getting conversations:', error)
    res.status(500).json({ error: 'Failed to get conversations' })
  }
})

// Create conversation
app.post('/api/conversations', async (req, res) => {
  try {
    const database = await connectDB()
    const nextId = await getNextId('conversations')
    
    const conversation = { 
      ...req.body, 
      id: String(nextId), 
      createdAt: new Date().toISOString().split('T')[0] 
    }
    
    await database.collection('conversations').insertOne(conversation)
    res.status(201).json(conversation)
  } catch (error) {
    console.error('Error creating conversation:', error)
    res.status(500).json({ error: 'Failed to create conversation' })
  }
})

// Get messages
app.get('/api/messages/:conversationId', async (req, res) => {
  try {
    const database = await connectDB()
    const messages = await database.collection('messages')
      .find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 })
      .toArray()
    
    res.json(messages)
  } catch (error) {
    console.error('Error getting messages:', error)
    res.status(500).json({ error: 'Failed to get messages' })
  }
})

// Create message
app.post('/api/messages', async (req, res) => {
  try {
    const database = await connectDB()
    const nextId = await getNextId('messages')
    
    const message = { 
      ...req.body, 
      id: String(nextId), 
      createdAt: new Date().toISOString().split('T')[0] 
    }
    
    await database.collection('messages').insertOne(message)
    
    await database.collection('conversations').updateOne(
      { id: req.body.conversationId },
      { 
        $set: { 
          lastMessage: message.content,
          lastMessageAt: message.createdAt
        } 
      }
    )
    
    res.status(201).json(message)
  } catch (error) {
    console.error('Error creating message:', error)
    res.status(500).json({ error: 'Failed to create message' })
  }
})

// Helper function to get next ID
async function getNextId(collection) {
  const database = await connectDB()
  const lastDoc = await database.collection(collection)
    .find()
    .sort({ id: -1 })
    .limit(1)
    .toArray()
  
  if (lastDoc.length === 0) {
    return 1
  }
  
  return parseInt(lastDoc[0].id) + 1
}

// Static data endpoints
app.get('/api/categories', (req, res) => {
  res.json(CATEGORIES)
})

app.get('/api/conditions', (req, res) => {
  res.json(CONDITIONS)
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
