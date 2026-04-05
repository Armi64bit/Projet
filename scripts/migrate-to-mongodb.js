import { connectDB } from '../src/data/mongodb.js'

const listingsData = [
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
    title: 'Gaming Monitor 27" 165Hz',
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

const usersData = [
  { id: '1', username: 'You', email: 'demo@gamesouk.tn', password: '123456', avatar: 'YO', bio: 'GameSouk demo user', joinedAt: '2024-12-01', listings: [] },
  { id: '2', username: 'AhmedGamer', email: 'ahmed@gamesouk.tn', password: '123456', avatar: 'AG', bio: 'Passionate gamer from Tunis', joinedAt: '2024-10-15', listings: ['1', '5'] },
  { id: '3', username: 'TechDealer', email: 'tech@gamesouk.tn', password: '123456', avatar: 'TD', bio: 'Gaming hardware specialist', joinedAt: '2024-09-20', listings: ['2', '8'] },
]

async function migrateData() {
  try {
    console.log('Starting migration to MongoDB...')
    const database = await connectDB()
    
    console.log('Clearing existing collections...')
    await database.collection('listings').deleteMany({})
    await database.collection('users').deleteMany({})
    await database.collection('conversations').deleteMany({})
    await database.collection('messages').deleteMany({})
    
    console.log('Migrating users...')
    await database.collection('users').insertMany(usersData)
    console.log(`Migrated ${usersData.length} users`)
    
    console.log('Migrating listings...')
    await database.collection('listings').insertMany(listingsData)
    console.log(`Migrated ${listingsData.length} listings`)
    
    console.log('Migration completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Update your .env file with your MongoDB connection string')
    console.log('2. Replace imports from "./data/db.js" to "./data/db-mongo.js" in your components')
    console.log('3. Test the application')
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

await migrateData()
