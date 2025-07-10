"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  Send,
  Plus,
  Hash,
  Users,
  Settings,
  LogOut,
  Smile,
  Paperclip,
  Moon,
  Sun,
  Bell,
} from "lucide-react"
import { io, type Socket } from "socket.io-client"

interface User {
  id: string
  username: string
  email: string
  role: string
  isOnline: boolean
}

interface Channel {
  id: string
  name: string
  description: string
  type: "text" | "voice"
  unreadCount: number
}

interface Message {
  id: string
  content: string
  userId: string
  username: string
  channelId: string
  timestamp: Date
  reactions: { emoji: string; users: string[] }[]
}

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [channels, setChannels] = useState<Channel[]>([
    { id: "1", name: "general", description: "General discussion", type: "text", unreadCount: 0 },
    { id: "2", name: "development", description: "Development talk", type: "text", unreadCount: 2 },
    { id: "3", name: "random", description: "Random stuff", type: "text", unreadCount: 0 },
  ])
  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [darkMode, setDarkMode] = useState(true)
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))

    // Initialize socket connection
    const newSocket = io("http://localhost:3001", {
      auth: { token },
    })

    setSocket(newSocket)

    // Socket event listeners
    newSocket.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    newSocket.on("userOnline", (users: User[]) => {
      setOnlineUsers(users)
    })

    // Join default channel
    newSocket.emit("joinChannel", channels[0].id)

    return () => {
      newSocket.close()
    }
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket || !user) return

    const message = {
      content: newMessage,
      channelId: activeChannel.id,
      userId: user.id,
      username: user.username,
    }

    socket.emit("sendMessage", message)
    setNewMessage("")
  }

  const handleChannelChange = (channel: Channel) => {
    if (socket) {
      socket.emit("leaveChannel", activeChannel.id)
      socket.emit("joinChannel", channel.id)
    }
    setActiveChannel(channel)
    setMessages([]) // Clear messages for demo
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    if (socket) {
      socket.close()
    }
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-slate-900" : "bg-gray-100"}`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
          {/* Server Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold">DevConnect</h1>
                <p className="text-xs text-slate-400">by Rajnikant</p>
              </div>
            </div>
          </div>

          {/* Channels */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wide">Text Channels</h3>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {channels.map((channel) => (
                <Button
                  key={channel.id}
                  variant="ghost"
                  className={`w-full justify-start text-left h-8 px-2 ${
                    activeChannel.id === channel.id
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                  onClick={() => handleChannelChange(channel)}
                >
                  <Hash className="w-4 h-4 mr-2" />
                  <span className="truncate">{channel.name}</span>
                  {channel.unreadCount > 0 && (
                    <Badge className="ml-auto bg-red-600 text-white text-xs h-5 w-5 p-0 flex items-center justify-center">
                      {channel.unreadCount}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* User Panel */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.username}</p>
                <p className="text-slate-400 text-xs">Online</p>
              </div>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <Hash className="w-6 h-6 text-slate-400" />
              <div>
                <h2 className="text-white font-semibold">{activeChannel.name}</h2>
                <p className="text-slate-400 text-sm">{activeChannel.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                <Bell className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                <Users className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Welcome to #{activeChannel.name}!</p>
                  <p className="text-sm">This is the beginning of your conversation.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex space-x-3 hover:bg-slate-800/30 p-2 rounded">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                        {message.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium">{message.username}</span>
                        <span className="text-slate-400 text-xs">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-300">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 bg-slate-800 border-t border-slate-700">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${activeChannel.name}`}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Online Users Sidebar */}
        <div className="w-60 bg-slate-800 border-l border-slate-700 p-4">
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-4">
            Online — {onlineUsers.length}
          </h3>
          <div className="space-y-2">
            {onlineUsers.map((onlineUser) => (
              <div key={onlineUser.id} className="flex items-center space-x-3 p-2 rounded hover:bg-slate-700">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm">
                      {onlineUser.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{onlineUser.username}</p>
                  <p className="text-slate-400 text-xs capitalize">{onlineUser.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
