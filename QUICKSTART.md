# 🚀 Quick Start Guide - Nebula AI Studio

## What You've Got

A complete, production-ready full-stack AI SaaS platform with:

### ✨ Features
- 🤖 AI text generation powered by Claude
- 📄 Document analysis and insights
- 📝 Smart text summarization  
- 🎨 Multiple content types (articles, blogs, social media, emails)
- 🔐 Complete JWT authentication with refresh tokens
- 💳 Subscription tiers (Free, Pro, Enterprise)
- 📊 Usage tracking and analytics
- 🎭 Beautiful UI with GSAP animations
- 🐳 Docker ready
- 🚀 CI/CD pipeline with GitHub Actions

### 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Anthropic Claude AI SDK
- Rate limiting & Security

**Frontend:**
- React 18 + Vite
- GSAP Animations
- TailwindCSS (custom nebula theme)
- Zustand (state management)
- React Query (server state)
- Axios (API client)

**DevOps:**
- Docker + Docker Compose
- PM2 Process Manager
- Nginx
- GitHub Actions CI/CD

## 🏃 Quick Start (5 minutes)

### Option 1: Local Development

```bash
# 1. Run the installation script
chmod +x install.sh
./install.sh

# 2. Get your Anthropic API key
# Visit: https://console.anthropic.com/
# Add to backend/.env: ANTHROPIC_API_KEY=your-key-here

# 3. Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 4. Start backend (Terminal 1)
cd backend
npm run dev

# 5. Start frontend (Terminal 2)
cd frontend
npm run dev

# 6. Open browser
# Visit: http://localhost:5173
```

### Option 2: Docker (Even Easier!)

```bash
# 1. Add your API key to .env file
echo "ANTHROPIC_API_KEY=your-key-here" > .env

# 2. Start everything
docker-compose up -d

# 3. Open browser
# Visit: http://localhost:5173
```

## 📝 First Steps

1. **Register Account** - Create your account at `/register`
2. **Get Free Credits** - Start with 100 free credits
3. **Generate Content** - Try the AI generator at `/generate`
4. **View Dashboard** - Check your stats at `/dashboard`

## 🔑 Environment Setup

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nebula-ai
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-key-min-32-chars
ANTHROPIC_API_KEY=your-anthropic-api-key
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

Once running, visit: `http://localhost:5000/api-docs`

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```js
colors: {
  nebula: { /* your colors */ },
  cosmic: { /* your colors */ }
}
```

### Change Fonts
Edit `frontend/index.html` and update Google Fonts import

### Modify AI Behavior
Edit `backend/src/services/ai.service.js`

## 📁 Project Structure

```
nebula-ai-studio/
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── config/      # Database, etc.
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Auth, errors, rate limiting
│   │   ├── models/      # MongoDB schemas
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic (AI)
│   │   └── utils/       # Helpers
│   ├── .env.example
│   ├── package.json
│   └── server.js        # Entry point
├── frontend/            # React app
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── store/       # State management
│   │   └── styles/      # Global CSS
│   ├── index.html
│   └── package.json
├── docker-compose.yml   # Multi-container setup
└── README.md
```

## 🔒 Security Features

- ✅ JWT with refresh tokens
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ Input validation
- ✅ CORS protection
- ✅ MongoDB injection protection

## 📊 Subscription Tiers

| Tier | Credits | Price |
|------|---------|-------|
| Free | 100 | $0 |
| Pro | 1,000 | $20/mo |
| Enterprise | 10,000 | $100/mo |

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change PORT in backend/.env
# Change port in frontend/vite.config.js
```

**MongoDB connection error:**
```bash
# Make sure MongoDB is running
docker ps | grep mongo
```

**API key not working:**
```bash
# Verify your Anthropic API key at console.anthropic.com
# Check backend/.env has correct key
```

## 🚀 Deployment

### Production with PM2
```bash
cd backend
npm run build
pm2 start ecosystem.config.js --env production
```

### Production with Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Monitoring

- Health check: `GET /health`
- API docs: `GET /api-docs`
- Logs: `backend/logs/`

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Make changes
4. Run tests
5. Submit PR

## 📄 License

MIT License - use freely!

## 🎉 You're All Set!

Start creating amazing AI-powered content with Nebula AI Studio!

Need help? Check out:
- Anthropic Docs: https://docs.anthropic.com
- React Docs: https://react.dev
- GSAP Docs: https://greensock.com/docs

Happy coding! 🚀
