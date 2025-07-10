const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const app = express()
const server = http.createServer(app)

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
)

app.use(express.json())

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/devconnect", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "moderator", "member"], default: "member" },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model("User", userSchema)

// Channel Schema
const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: { type: String, enum: ["text", "voice"], default: "text" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isPrivate: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const Channel = mongoose.model("Channel", channelSchema)

// Message Schema
const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
  type: { type: String, enum: ["text", "image", "file"], default: "text" },
  fileUrl: String,
  fileName: String,
  reactions: [
    {
      emoji: String,
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
  ],
  editedAt: Date,
  createdAt: { type: Date, default: Date.now },
})

const Message = mongoose.model("Message", messageSchema)

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    const user = await User.findById(decoded.userId)

    if (!user) {
      return next(new Error("User not found"))
    }

    socket.userId = user._id.toString()
    socket.username = user.username
    next()
  } catch (err) {
    next(new Error("Authentication error"))
  }
})

// Socket.io connection handling
io.on("connection", async (socket) => {
  console.log(`User ${socket.username} connected`)

  // Update user online status
  await User.findByIdAndUpdate(socket.userId, {
    isOnline: true,
    lastSeen: new Date(),
  })

  // Join user to their channels
  const userChannels = await Channel.find({
    members: socket.userId,
  }).select("_id")

  userChannels.forEach((channel) => {
    socket.join(channel._id.toString())
  })

  // Broadcast online users
  const onlineUsers = await User.find({ isOnline: true }).select("username role isOnline")

  io.emit("userOnline", onlineUsers)

  // Handle joining channels
  socket.on("joinChannel", async (channelId) => {
    socket.join(channelId)

    // Load recent messages
    const messages = await Message.find({ channelId }).populate("userId", "username").sort({ createdAt: -1 }).limit(50)

    socket.emit("channelMessages", messages.reverse())
  })

  // Handle leaving channels
  socket.on("leaveChannel", (channelId) => {
    socket.leave(channelId)
  })

  // Handle sending messages
  socket.on("sendMessage", async (data) => {
    try {
      const message = new Message({
        content: data.content,
        userId: socket.userId,
        channelId: data.channelId,
      })

      await message.save()
      await message.populate("userId", "username")

      // Broadcast to channel
      io.to(data.channelId).emit("message", {
        id: message._id,
        content: message.content,
        userId: message.userId._id,
        username: message.userId.username,
        channelId: message.channelId,
        timestamp: message.createdAt,
        reactions: message.reactions,
      })
    } catch (error) {
      console.error("Error sending message:", error)
      socket.emit("error", { message: "Failed to send message" })
    }
  })

  // Handle message reactions
  socket.on("addReaction", async (data) => {
    try {
      const message = await Message.findById(data.messageId)
      if (!message) return

      const existingReaction = message.reactions.find((r) => r.emoji === data.emoji)

      if (existingReaction) {
        if (!existingReaction.users.includes(socket.userId)) {
          existingReaction.users.push(socket.userId)
        }
      } else {
        message.reactions.push({
          emoji: data.emoji,
          users: [socket.userId],
        })
      }

      await message.save()

      io.to(data.channelId).emit("reactionAdded", {
        messageId: data.messageId,
        reactions: message.reactions,
      })
    } catch (error) {
      console.error("Error adding reaction:", error)
    }
  })

  // Handle typing indicators
  socket.on("typing", (data) => {
    socket.to(data.channelId).emit("userTyping", {
      userId: socket.userId,
      username: socket.username,
      channelId: data.channelId,
    })
  })

  socket.on("stopTyping", (data) => {
    socket.to(data.channelId).emit("userStoppedTyping", {
      userId: socket.userId,
      channelId: data.channelId,
    })
  })

  // Handle disconnect
  socket.on("disconnect", async () => {
    console.log(`User ${socket.username} disconnected`)

    // Update user offline status
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: false,
      lastSeen: new Date(),
    })

    // Broadcast updated online users
    const onlineUsers = await User.find({ isOnline: true }).select("username role isOnline")

    io.emit("userOnline", onlineUsers)
  })
})

// REST API Routes

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    })

    await user.save()

    // Generate token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Channel routes
app.get("/api/channels", authenticateToken, async (req, res) => {
  try {
    const channels = await Channel.find({
      members: req.user.userId,
    }).populate("createdBy", "username")

    res.json({ channels })
  } catch (error) {
    console.error("Get channels error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/channels", authenticateToken, async (req, res) => {
  try {
    const { name, description, type = "text" } = req.body

    const channel = new Channel({
      name,
      description,
      type,
      createdBy: req.user.userId,
      members: [req.user.userId],
    })

    await channel.save()
    await channel.populate("createdBy", "username")

    res.status(201).json({ channel })
  } catch (error) {
    console.error("Create channel error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Message routes
app.get("/api/messages/:channelId", authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params
    const { page = 1, limit = 50 } = req.query

    const messages = await Message.find({ channelId })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    res.json({ messages: messages.reverse() })
  } catch (error) {
    console.error("Get messages error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// File upload route (mock implementation)
app.post("/api/upload", authenticateToken, async (req, res) => {
  try {
    // In production, implement actual file upload to AWS S3 or similar
    const mockFileUrl = `https://example.com/files/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    res.json({
      fileUrl: mockFileUrl,
      fileName: "uploaded-file.png",
    })
  } catch (error) {
    console.error("File upload error:", error)
    res.status(500).json({ message: "Upload failed" })
  }
})

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "DevConnect Backend",
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`🚀 DevConnect Backend Server running on port ${PORT}`)
  console.log(`📧 Created by: Rajnikant Dhar Dwivedi`)
  console.log(`🌐 Portfolio: https://rajnikantdhardwivedi-portfolio.netlify.app/`)
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully")

  // Update all users to offline
  await User.updateMany({}, { isOnline: false, lastSeen: new Date() })

  server.close(() => {
    console.log("Process terminated")
    process.exit(0)
  })
})
