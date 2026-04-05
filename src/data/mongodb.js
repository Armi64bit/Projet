import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.VITE_MONGODB_URI
const client = new MongoClient(uri)

let db = null

export const connectDB = async () => {
  if (db) return db
  
  try {
    await client.connect()
    db = client.db('gamesouk')
    console.log('Connected to MongoDB')
    return db
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.')
  }
  return db
}

export const closeDB = async () => {
  if (client) {
    await client.close()
    db = null
    console.log('MongoDB connection closed')
  }
}
