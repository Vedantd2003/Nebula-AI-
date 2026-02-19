#!/bin/bash

echo "🌌 Nebula AI Studio - Installation Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo -e "${BLUE}⚠ MongoDB not found. Please install MongoDB or use Docker.${NC}"
fi

# Install backend dependencies
echo ""
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo -e "${BLUE}📝 Creating backend .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Please edit backend/.env with your configuration${NC}"
fi

# Install frontend dependencies
echo ""
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd ../frontend
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo -e "${BLUE}📝 Creating frontend .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Please edit frontend/.env with your configuration${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env and add your ANTHROPIC_API_KEY"
echo "2. Start MongoDB: mongod (or use Docker)"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo ""
echo "🚀 Visit http://localhost:5173 to see your app!"
echo ""
echo "📚 For Docker deployment: docker-compose up -d"
echo ""
