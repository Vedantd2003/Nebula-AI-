# 🌌 Nebula AI Studio

A full-stack AI-powered SaaS platform for content generation, document analysis, and creative tools.

## ✨ Features

- 🤖 **AI Text Generation** - Generate content with Claude AI
- 📄 **Document Analysis** - Extract insights from PDFs and documents
- 🎨 **Image Generation** - Create AI-powered images
- 📝 **Smart Summarization** - Summarize long documents instantly
- 🔐 **Complete Authentication** - JWT-based auth with refresh tokens
- 💳 **Subscription Management** - Tier-based access control
- 📊 **Usage Analytics** - Track API usage and credits
- 🎭 **Beautiful UI** - GSAP animations with modern design

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **GSAP** - Professional animations
- **TailwindCSS** - Utility-first styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Anthropic SDK** - Claude AI integration
- **Multer** - File uploads
- **Rate Limiting** - API protection
- **Helmet** - Security headers
- **CORS** - Cross-origin handling

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy
- **PM2** - Process management
- **GitHub Actions** - CI/CD
- **ESLint & Prettier** - Code quality

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB 6+
- Docker & Docker Compose (optional)
- Anthropic API Key

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nebula-ai-studio.git
cd nebula-ai-studio
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

**Backend** - Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/nebula-ai

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Anthropic AI
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Frontend** - Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Nebula AI Studio
```

### 4. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use local MongoDB installation
mongod --dbpath /path/to/data
```

### 5. Run the Application

**Development Mode:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Production Mode:**

```bash
# Build frontend
cd frontend
npm run build

# Start backend with PM2
cd ../backend
npm run build
pm2 start ecosystem.config.js
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Docs**: http://localhost:5000/api-docs

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
nebula-ai-studio/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── validators/     # Input validation
│   │   └── app.js          # Express app
│   ├── tests/              # Test files
│   ├── uploads/            # File uploads
│   ├── .env                # Environment variables
│   ├── server.js           # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   ├── utils/          # Utilities
│   │   ├── assets/         # Images, fonts
│   │   ├── styles/         # Global styles
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static files
│   ├── .env                # Environment variables
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── .github/
│   └── workflows/          # CI/CD pipelines
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### AI Generation
- `POST /api/ai/generate-text` - Generate AI text
- `POST /api/ai/analyze-document` - Analyze document
- `POST /api/ai/summarize` - Summarize text
- `POST /api/ai/generate-image` - Generate image
- `GET /api/ai/history` - Get generation history

### Usage & Analytics
- `GET /api/usage/credits` - Get remaining credits
- `GET /api/usage/stats` - Get usage statistics
- `GET /api/usage/history` - Get usage history

### Subscriptions
- `GET /api/subscriptions/plans` - Get available plans
- `POST /api/subscriptions/subscribe` - Subscribe to plan
- `PUT /api/subscriptions/upgrade` - Upgrade plan
- `DELETE /api/subscriptions/cancel` - Cancel subscription

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📦 Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build

# The optimized files are in:
# - frontend/dist
# - backend/dist
```

## 🚢 Deployment

### Using PM2

```bash
cd backend
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Using Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables for Production

- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper CORS origins
- Set up SSL certificates
- Use production database
- Configure monitoring tools

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on all endpoints
- Helmet security headers
- Input validation and sanitization
- CORS protection
- File upload restrictions
- SQL injection prevention
- XSS protection

## 📊 Monitoring

- Request logging with Morgan
- Error tracking
- Performance monitoring
- Usage analytics
- Health check endpoint: `GET /api/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Anthropic for Claude AI API
- GSAP for amazing animations
- The open-source community

## 📞 Support

- Email: support@nebula-ai.com
- Discord: https://discord.gg/nebula-ai
- Documentation: https://docs.nebula-ai.com

---

Built with ❤️ using Claude AI
