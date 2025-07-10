# DevConnect - Real-time Messaging Platform

![DevConnect Logo](https://via.placeholder.com/200x80/3B82F6/FFFFFF?text=DevConnect)

**A modern, Discord-inspired real-time messaging platform built for developers.**

---

## 👨‍💻 Developer Information

**Created by:** Rajnikant Dhar Dwivedi  
**Email:** rajnikantdhardwivedi@gmail.com  
**Portfolio:** [https://rajnikantdhardwivedi-portfolio.netlify.app/](https://rajnikantdhardwivedi-portfolio.netlify.app/)  
**Copyright:** © 2025 Rajnikant Dhar Dwivedi. All rights reserved.

---

## 🚀 Features

### Core Functionality
- **Real-time Messaging** - Instant communication powered by Socket.io
- **User Authentication** - Secure JWT-based login/signup system
- **Channel Management** - Create, edit, and manage text channels
- **Role-based Permissions** - Admin, Moderator, and Member roles
- **Online Status Indicators** - See who's currently online
- **Message Reactions** - React to messages with emojis
- **Typing Indicators** - Real-time typing status
- **Message History** - Persistent chat history with MongoDB

### User Interface
- **Dark Theme Design** - Professional dark interface with royal blue and teal accents
- **Responsive Layout** - Mobile, tablet, and desktop optimized
- **Custom Branding** - Professionally branded as "DevConnect by Rajnikant"
- **Light/Dark Mode Toggle** - User preference support
- **Notification Badges** - Unread message indicators
- **Markdown Support** - Rich text formatting in messages

### Technical Features
- **File Upload Support** - Share images, documents, and code snippets
- **Scalable Architecture** - Built for production deployment
- **Docker Support** - Complete containerization setup
- **Database Integration** - MongoDB for data persistence
- **Real-time Updates** - Socket.io for instant communication
- **Security** - JWT authentication and input validation

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Redis** - Session storage and Socket.io scaling
- **MongoDB** - Primary database

---

## 📁 Project Structure

\`\`\`
devconnect/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── channels/             # Channel management
│   │   └── messages/             # Message handling
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── chat/                     # Main chat interface
│   └── page.tsx                  # Landing page
├── backend/                      # Socket.io server
│   ├── server.js                 # Main server file
│   ├── package.json              # Backend dependencies
│   └── Dockerfile                # Backend container
├── components/                   # Reusable UI components
│   └── ui/                       # shadcn/ui components
├── docker-compose.yml            # Multi-container setup
├── Dockerfile                    # Frontend container
├── mongo-init.js                 # Database initialization
└── README.md                     # Project documentation
\`\`\`

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose installed
- Git installed

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository-url>
   cd devconnect
   \`\`\`

2. **Start with Docker Compose:**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: localhost:27017

### Option 2: Local Development

1. **Install frontend dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Install backend dependencies:**
   \`\`\`bash
   cd backend
   npm install
   cd ..
   \`\`\`

3. **Start MongoDB:**
   \`\`\`bash
   # Using Docker
   docker run -d -p 27017:27017 --name devconnect-mongo mongo:6.0
   \`\`\`

4. **Start the backend server:**
   \`\`\`bash
   cd backend
   npm run dev
   \`\`\`

5. **Start the frontend:**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

---

## 🔧 Configuration

### Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
# JWT Secret (use a strong, random string in production)
JWT_SECRET=your-super-secret-jwt-key-here

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/devconnect

# CORS Origin (frontend URL)
CORS_ORIGIN=http://localhost:3000

# Node Environment
NODE_ENV=development
\`\`\`

### Default Credentials

The system creates a default admin account:
- **Email:** admin@devconnect.com
- **Password:** password
- **Role:** Admin

---

## 📱 Usage Guide

### Getting Started
1. **Sign Up:** Create a new account or use the default admin credentials
2. **Login:** Access your account with email and password
3. **Join Channels:** Start with the default channels (general, development, random)
4. **Start Chatting:** Send messages, react with emojis, and share files

### Channel Management
- **Create Channels:** Click the "+" button next to "Text Channels"
- **Join Channels:** Click on any channel in the sidebar
- **Manage Permissions:** Admins can set channel permissions

### User Roles
- **Admin:** Full system access, user management, channel creation
- **Moderator:** Channel moderation, message management
- **Member:** Basic messaging and channel participation

---

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** bcrypt for secure password storage
- **Input Validation:** Server-side validation for all inputs
- **CORS Protection:** Configured cross-origin resource sharing
- **Rate Limiting:** Protection against spam and abuse
- **Secure Headers:** Helmet.js for security headers

---

## 🚀 Deployment

### Production Deployment with Docker

1. **Update environment variables:**
   \`\`\`bash
   # Update docker-compose.yml with production values
   # Set strong JWT_SECRET
   # Configure MongoDB credentials
   \`\`\`

2. **Deploy with Docker Compose:**
   \`\`\`bash
   docker-compose -f docker-compose.yml up -d
   \`\`\`

3. **Set up reverse proxy (Nginx):**
   \`\`\`nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /socket.io/ {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   \`\`\`

---

## 🤝 Contributing

This is a personal portfolio project by Rajnikant Dhar Dwivedi. While contributions are welcome, please note that this project showcases individual development skills.

### Development Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

**Copyright © 2025 Rajnikant Dhar Dwivedi. All rights reserved.**

---

## 📞 Contact & Support

**Developer:** Rajnikant Dhar Dwivedi  
**Email:** rajnikantdhardwivedi@gmail.com  
**Portfolio:** [https://rajnikantdhardwivedi-portfolio.netlify.app/](https://rajnikantdhardwivedi-portfolio.netlify.app/)  
**LinkedIn:** [Connect on LinkedIn](https://linkedin.com/in/rajnikant-dhar-dwivedi)

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by Discord's user experience
- Designed for developer communities
- Created as a portfolio showcase project

---

**DevConnect - Connecting Developers, One Message at a Time.**

*Built with ❤️ by Rajnikant Dhar Dwivedi*
