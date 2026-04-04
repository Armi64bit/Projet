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

let listingsStore = [
  {
    id: '1',
    title: 'PS5 Digital Edition + Extra Controller',
    description: 'Very clean PS5 Digital in excellent condition. Comes with 2 controllers and original box.',
    category: 'consoles',
    condition: 'Like New',
    price: 1750,
    location: 'Tunis',
    seller: 'AhmedGamer',
    sellerId: '2',
    images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&h=800&fit=crop'],
    createdAt: '2026-03-28',
    status: 'active',
  },
  {
    id: '2',
    title: 'Gaming PC RTX 4070 / Ryzen 7',
    description: 'High-end gaming PC. RTX 4070, Ryzen 7 7700X, 32GB RAM, 1TB NVMe SSD. Ready for 1440p ultra.',
    category: 'pcs',
    condition: 'Good',
    price: 4200,
    location: 'Sousse',
    seller: 'TechDealer',
    sellerId: '3',
    images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&h=800&fit=crop'],
    createdAt: '2026-03-30',
    status: 'active',
  },
  {
    id: '3',
    title: 'DualSense Edge Controller',
    description: 'Official DualSense Edge with case and accessories. Works perfectly.',
    category: 'peripherals',
    condition: 'Good',
    price: 620,
    location: 'Nabeul',
    seller: 'AhmedGamer',
    sellerId: '2',
    images: ['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=1200&h=800&fit=crop'],
    createdAt: '2026-03-25',
    status: 'active',
  },
  {
    id: '4',
    title: 'Apex Legends Account (Heirloom)',
    description: 'Level 500+ account with rare skins and one heirloom unlocked.',
    category: 'accounts',
    condition: 'Used',
    price: 450,
    location: 'Sfax',
    seller: 'You',
    sellerId: '1',
    images: ['https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=800&fit=crop'],
    createdAt: '2026-03-24',
    status: 'active',
  },
  {
    id: '5',
    title: 'Nintendo Switch OLED + Zelda TOTK',
    description: 'Switch OLED in mint condition with Zelda Tears of the Kingdom cartridge included.',
    category: 'consoles',
    condition: 'Like New',
    price: 1150,
    location: 'Monastir',
    seller: 'AhmedGamer',
    sellerId: '2',
    images: ['https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=1200&h=800&fit=crop'],
    createdAt: '2026-03-21',
    status: 'active',
  },
  {
    id: '6',
    title: 'Gaming Monitor 27” 165Hz',
    description: '27-inch 1440p IPS gaming monitor, 165Hz refresh rate, no dead pixels.',
    category: 'peripherals',
    condition: 'Good',
    price: 780,
    location: 'Bizerte',
    seller: 'TechDealer',
    sellerId: '3',
    images: ['https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&h=800&fit=crop'],
    createdAt: '2026-03-19',
    status: 'active',
  },
  {
    id: '7',
    title: 'God of War Ragnarök (PS5)',
    description: 'Physical copy in perfect shape, played once.',
    category: 'games',
    condition: 'Like New',
    price: 120,
    location: 'Tunis',
    seller: 'You',
    sellerId: '1',
    images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=800&fit=crop'],
    createdAt: '2026-03-18',
    status: 'sold',
    soldAt: '2026-03-31',
  },
  {
    id: '8',
    title: 'Mechanical Keyboard RGB (Hot-swappable)',
    description: 'TKL mechanical keyboard with red switches, RGB lighting, and USB-C cable.',
    category: 'peripherals',
    condition: 'Good',
    price: 230,
    location: 'Gabès',
    seller: 'TechDealer',
    sellerId: '3',
    images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=1200&h=800&fit=crop'],
    createdAt: '2026-03-16',
    status: 'active',
  },
]

let usersStore = [
  { id: '1', username: 'You', email: 'demo@gamesouk.tn', password: '123456', avatar: 'YO', bio: 'GameSouk demo user', joinedAt: '2024-12-01', listings: [] },
  { id: '2', username: 'AhmedGamer', email: 'ahmed@gamesouk.tn', password: '123456', avatar: 'AG', bio: 'Passionate gamer from Tunis', joinedAt: '2024-10-15', listings: ['1', '5'] },
  { id: '3', username: 'TechDealer', email: 'tech@gamesouk.tn', password: '123456', avatar: 'TD', bio: 'Gaming hardware specialist', joinedAt: '2024-09-20', listings: ['2', '8'] },
]

let conversationsStore = []
let messagesStore = []
let nextId = 100

export const db = {
  getStats: () => {
    const today = new Date().toISOString().split('T')[0]
    const activeListings = listingsStore.filter(l => l.status !== 'sold').length
    const gamers = usersStore.length
    const dailySales = listingsStore.filter(l => l.status === 'sold' && l.soldAt === today).length
    return { activeListings, gamers, dailySales }
  },
  getListings: (filters = {}) => {
    let result = [...listingsStore]
    if (filters.category && filters.category !== 'all') result = result.filter(l => l.category === filters.category)
    if (filters.search) result = result.filter(l => l.title.toLowerCase().includes(filters.search.toLowerCase()))
    if (filters.minPrice) result = result.filter(l => l.price >= Number(filters.minPrice))
    if (filters.maxPrice) result = result.filter(l => l.price <= Number(filters.maxPrice))
    if (filters.condition) result = result.filter(l => l.condition === filters.condition)
    if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    else if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return result
  },
  getListing: (id) => listingsStore.find(l => l.id === id),
  createListing: (data) => {
    const listing = { ...data, id: String(++nextId), createdAt: new Date().toISOString().split('T')[0], status: 'active' }
    listingsStore.unshift(listing)
    return listing
  },
  deleteListing: (id) => { listingsStore = listingsStore.filter(l => l.id !== id) },
  updateListing: (id, data) => {
    const idx = listingsStore.findIndex(l => l.id === id)
    if (idx !== -1) listingsStore[idx] = { ...listingsStore[idx], ...data }
    return listingsStore[idx]
  },
  getUser: (id) => usersStore.find(u => u.id === id),
  getUserByUsername: (username) => usersStore.find(u => u.username === username),
  updateUser: (id, data) => {
    const idx = usersStore.findIndex(u => u.id === id)
    if (idx === -1) return null

    const nextUsername = data.username?.trim()
    if (nextUsername && usersStore.some(u => u.id !== id && u.username.toLowerCase() === nextUsername.toLowerCase())) {
      return null
    }

    usersStore[idx] = {
      ...usersStore[idx],
      ...data,
      ...(nextUsername ? { username: nextUsername } : {})
    }

    if (nextUsername) {
      listingsStore = listingsStore.map(l => l.sellerId === id ? { ...l, seller: nextUsername } : l)
    }

    return usersStore[idx]
  },
  getUserListings: (userId) => listingsStore.filter(l => l.sellerId === userId),
  login: (email, password) => usersStore.find(u => u.email === email && u.password === password),
  register: (data) => {
    if (usersStore.find(u => u.email === data.email)) return null
    const user = { ...data, id: String(++nextId), avatar: data.username.slice(0, 2).toUpperCase(), joinedAt: new Date().toISOString().split('T')[0] }
    usersStore.push(user)
    return user
  },
  getConversations: (userId) => conversationsStore.filter(c => c.buyerId === userId || c.sellerId === userId).map(c => ({
    ...c,
    listing: listingsStore.find(l => l.id === c.listingId),
    otherUser: c.buyerId === userId ? usersStore.find(u => u.id === c.sellerId) : usersStore.find(u => u.id === c.buyerId),
    lastMsg: messagesStore.filter(m => m.conversationId === c.id).slice(-1)[0]
  })).sort((a, b) => (b.lastMsg?.createdAt || b.createdAt) - (a.lastMsg?.createdAt || a.createdAt)),
  getOrCreateConversation: (buyerId, sellerId, listingId) => {
    let conv = conversationsStore.find(c => c.listingId === listingId && ((c.buyerId === buyerId && c.sellerId === sellerId) || (c.buyerId === sellerId && c.sellerId === buyerId)))
    if (!conv) {
      conv = { id: String(++nextId), buyerId, sellerId, listingId, createdAt: Date.now() }
      conversationsStore.push(conv)
    }
    return conv
  },
  getMessages: (convId) => messagesStore.filter(m => m.conversationId === convId),
  sendMessage: (convId, senderId, content) => {
    const msg = { id: String(++nextId), conversationId: convId, senderId, content, createdAt: Date.now(), read: false }
    messagesStore.push(msg)
    return msg
  },
  markRead: (convId, userId) => { messagesStore.filter(m => m.conversationId === convId && m.senderId !== userId).forEach(m => m.read = true) }
}
