// MongoDB initialization script
const db = db.getSiblingDB("devconnect")

// Create collections
db.createCollection("users")
db.createCollection("channels")
db.createCollection("messages")

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.messages.createIndex({ channelId: 1, createdAt: -1 })
db.channels.createIndex({ name: 1 })

// Create default admin user
db.users.insertOne({
  username: "admin",
  email: "admin@devconnect.com",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
  role: "admin",
  isOnline: false,
  createdAt: new Date(),
})

// Create default channels
const adminUser = db.users.findOne({ username: "admin" })

db.channels.insertMany([
  {
    name: "general",
    description: "General discussion for everyone",
    type: "text",
    createdBy: adminUser._id,
    members: [adminUser._id],
    isPrivate: false,
    createdAt: new Date(),
  },
  {
    name: "development",
    description: "Development discussions and code sharing",
    type: "text",
    createdBy: adminUser._id,
    members: [adminUser._id],
    isPrivate: false,
    createdAt: new Date(),
  },
  {
    name: "random",
    description: "Random conversations and off-topic discussions",
    type: "text",
    createdBy: adminUser._id,
    members: [adminUser._id],
    isPrivate: false,
    createdAt: new Date(),
  },
])

print("DevConnect database initialized successfully!")
print("Created by: Rajnikant Dhar Dwivedi")
print("Portfolio: https://rajnikantdhardwivedi-mu.vercel.app/")
