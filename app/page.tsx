"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Users, Shield, Zap, Github, Mail, Globe } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/chat")
    } else {
      router.push("/auth/login")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">DevConnect</h1>
              <p className="text-xs text-slate-400">by Rajnikant Dhar Dwivedi</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button onClick={() => router.push("/chat")} className="bg-blue-600 hover:bg-blue-700">
                Open Chat
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/auth/login")}
                  className="text-slate-300 hover:text-white"
                >
                  Login
                </Button>
                <Button onClick={() => router.push("/auth/signup")} className="bg-blue-600 hover:bg-blue-700">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-600/20 text-blue-400 border-blue-600/30">Real-time Messaging Platform</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Connect. Code.
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Collaborate.
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            A modern messaging platform designed for developers. Real-time communication with channels, file sharing,
            and seamless collaboration tools.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-lg px-8 py-3"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-slate-300 text-lg">Everything you need for seamless team communication</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <MessageCircle className="w-12 h-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Real-time Messaging</CardTitle>
              <CardDescription className="text-slate-300">
                Instant messaging with Socket.io for lightning-fast communication
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Users className="w-12 h-12 text-teal-400 mb-4" />
              <CardTitle className="text-white">Channel Management</CardTitle>
              <CardDescription className="text-slate-300">
                Create and manage channels with role-based permissions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Shield className="w-12 h-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Secure Authentication</CardTitle>
              <CardDescription className="text-slate-300">
                JWT-based authentication with role management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Zap className="w-12 h-12 text-yellow-400 mb-4" />
              <CardTitle className="text-white">File Sharing</CardTitle>
              <CardDescription className="text-slate-300">
                Share images, documents, and code snippets seamlessly
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <MessageCircle className="w-12 h-12 text-green-400 mb-4" />
              <CardTitle className="text-white">Message Reactions</CardTitle>
              <CardDescription className="text-slate-300">
                React to messages with emojis and markdown support
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Users className="w-12 h-12 text-red-400 mb-4" />
              <CardTitle className="text-white">Online Status</CardTitle>
              <CardDescription className="text-slate-300">
                See who's online with real-time status indicators
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Developer Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-slate-800/30 border-slate-700 max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white mb-4">About the Developer</CardTitle>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                RD
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Rajnikant Dhar Dwivedi</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Full-stack developer passionate about creating modern, scalable web applications. Specialized in React,
              Node.js, and real-time communication systems.
            </p>
            <div className="flex justify-center space-x-6">
              <Link
                href="mailto:rajnikantdhardwivedi@gmail.com"
                className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </Link>
              <Link
                href="https://rajnikantdhardwivedi-portfolio.netlify.app/"
                target="_blank"
                className="flex items-center space-x-2 text-slate-300 hover:text-teal-400 transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>Portfolio</span>
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                className="flex items-center space-x-2 text-slate-300 hover:text-purple-400 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">DevConnect</span>
            </div>
            <footer className="text-sm text-muted-foreground text-center py-6">
              Built with ❤️ by Rajnikant Dhar Dwivedi · © 2025
            </footer>
          </div>
        </div>
      </footer>
    </div>
  )
}
