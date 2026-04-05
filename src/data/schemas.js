export const listingSchema = {
  _id: String,
  id: String,
  title: String,
  description: String,
  category: String,
  condition: String,
  price: Number,
  location: String,
  seller: String,
  sellerId: String,
  images: [String],
  createdAt: String,
  status: String,
  soldAt: String
}

export const userSchema = {
  _id: String,
  id: String,
  username: String,
  email: String,
  password: String,
  avatar: String,
  bio: String,
  joinedAt: String,
  listings: [String]
}

export const conversationSchema = {
  _id: String,
  id: String,
  listingId: String,
  buyerId: String,
  sellerId: String,
  createdAt: String,
  lastMessage: String,
  lastMessageAt: String
}

export const messageSchema = {
  _id: String,
  id: String,
  conversationId: String,
  senderId: String,
  content: String,
  createdAt: String
}
