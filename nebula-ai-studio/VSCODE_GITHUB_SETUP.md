# 🚀 VS Code & GitHub Setup Guide

## 📦 Opening in VS Code

### Method 1: Open Workspace File (Recommended)
1. Extract the ZIP file
2. Open VS Code
3. Go to **File → Open Workspace from File...**
4. Select `nebula-ai-studio.code-workspace`
5. Click "Open Workspace"

✅ This will open the project with:
- Multi-root workspace (Backend & Frontend separated)
- Auto-formatting on save
- ESLint integration
- Tailwind CSS IntelliSense
- Recommended extensions prompt
- Debug configurations ready

### Method 2: Open Folder
1. Extract the ZIP file
2. Open VS Code
3. Go to **File → Open Folder...**
4. Select the `nebula-ai-studio` folder
5. VS Code will automatically detect `.vscode` settings

## 🔌 Recommended Extensions

When you open the project, VS Code will prompt you to install recommended extensions. Click "Install All" or install them manually:

### Essential Extensions:
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **ES7+ React/Redux/React-Native snippets** - React snippets
- **MongoDB for VS Code** - Database management
- **Docker** - Container management
- **npm Intellisense** - Import autocomplete
- **Import Cost** - See package sizes
- **Error Lens** - Inline error display
- **GitLens** - Enhanced Git features

## 🎯 Quick Start in VS Code

### Option 1: Use Integrated Terminal
```bash
# Open integrated terminal (Ctrl+` or Cmd+`)

# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend (Ctrl+Shift+` for new terminal)
cd frontend
npm install
npm run dev
```

### Option 2: Use VS Code Tasks
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select "Install All Dependencies"
4. Then run "Start Backend" and "Start Frontend"

### Option 3: Use Debug Configuration
1. Go to Run and Debug panel (Ctrl+Shift+D)
2. Select "Full Stack" from dropdown
3. Press F5 to start both backend and frontend

## 📁 Project Structure in VS Code

```
NEBULA AI STUDIO (Workspace Root)
├── 🌌 Nebula AI Studio (Main folder)
├── Backend (Separate folder view)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── .env.example → Rename to .env
│   └── package.json
└── Frontend (Separate folder view)
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── services/
    └── package.json
```

## 🐙 GitHub Setup

### Option 1: Create New Repository

1. **Initialize Git locally:**
```bash
cd nebula-ai-studio
git init
git add .
git commit -m "Initial commit: Nebula AI Studio full-stack app"
```

2. **Create repository on GitHub:**
- Go to https://github.com/new
- Name: `nebula-ai-studio`
- Don't initialize with README (we have one)
- Create repository

3. **Push to GitHub:**
```bash
git remote add origin https://github.com/YOUR-USERNAME/nebula-ai-studio.git
git branch -M main
git push -u origin main
```

### Option 2: Use VS Code GitHub Integration

1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "Publish to GitHub"
3. Select "Publish to GitHub public repository"
4. Choose repository name
5. Select files to include
6. Done! ✅

## 🔐 Environment Variables Setup

### Backend (.env)
1. Copy `.env.example` to `.env`:
```bash
cd backend
cp .env.example .env
```

2. Edit `backend/.env` and add:
```env
ANTHROPIC_API_KEY=your-actual-api-key-here
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

Get your Anthropic API key from: https://console.anthropic.com/

### Frontend (.env)
1. Copy `.env.example` to `.env`:
```bash
cd frontend
cp .env.example .env
```

2. The defaults should work, but you can customize:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎨 VS Code Features Available

### 1. IntelliSense & Autocomplete
- JavaScript/React autocomplete
- Tailwind class autocomplete
- Import suggestions
- Component props hints

### 2. Debugging
- Breakpoints in both frontend and backend
- Step through code
- Inspect variables
- Debug console

### 3. Git Integration
- View changes
- Stage/unstage files
- Commit with messages
- Push/pull
- Branch management
- Merge conflict resolution

### 4. Terminal
- Multiple terminals (split view)
- Run backend and frontend simultaneously
- Access to all npm scripts
- Docker commands

### 5. Extensions Benefits
- Auto-fix ESLint errors on save
- Format code with Prettier
- See inline errors and warnings
- MongoDB query tools
- Docker container management

## 🚀 Running the Project

### Development Mode (VS Code)

**Using Integrated Terminal:**
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

**Using VS Code Tasks:**
1. `Ctrl+Shift+P` → "Tasks: Run Task"
2. Run "Start Backend"
3. Run "Start Frontend"

**Using Debug Panel:**
1. Select "Full Stack" configuration
2. Press F5

### Docker Mode (VS Code)

**Using Terminal:**
```bash
docker-compose up -d
```

**Using VS Code Docker Extension:**
1. Right-click on `docker-compose.yml`
2. Select "Compose Up"

## 📊 Monitoring in VS Code

### View Logs
- Output panel shows server logs
- Debug console shows detailed info
- Terminal shows real-time updates

### Problems Panel
- See all ESLint errors
- TypeScript errors (if enabled)
- Build errors

## 🔥 Hot Tips

### 1. Multi-Cursor Editing
- Hold `Alt` and click to add cursors
- `Ctrl+D` to select next occurrence

### 2. Quick File Navigation
- `Ctrl+P` to quickly open files
- `Ctrl+Shift+P` for command palette

### 3. Snippets
Type and press Tab:
- `rafce` - React Arrow Function Component
- `imr` - Import React
- `log` - console.log

### 4. Format Document
- `Shift+Alt+F` to format current file
- Or enable format on save (already configured!)

### 5. Split Editor
- `Ctrl+\` to split editor
- Work on backend and frontend side-by-side

## 📱 Mobile Development View

VS Code Mobile Support:
- github.dev (edit on web)
- VS Code for iPad
- SSH into remote machine

## 🎯 Next Steps

1. ✅ Open in VS Code
2. ✅ Install recommended extensions
3. ✅ Set up environment variables
4. ✅ Install dependencies (`npm install`)
5. ✅ Start development servers
6. ✅ Open http://localhost:5173
7. ✅ Start coding!

## 📚 Additional Resources

- **VS Code Docs**: https://code.visualstudio.com/docs
- **GitHub Docs**: https://docs.github.com
- **React DevTools**: Install browser extension
- **MongoDB Compass**: GUI for MongoDB

## 🆘 Common Issues

**Extensions not working?**
- Reload VS Code window
- Check extension is enabled
- Install workspace recommended extensions

**ESLint errors?**
- Run `npm install` in backend and frontend
- Check `.eslintrc` files exist

**Can't connect to MongoDB?**
- Make sure MongoDB is running
- Check connection string in `.env`
- Try: `docker run -d -p 27017:27017 mongo`

**Port already in use?**
- Change PORT in backend `.env`
- Change port in frontend `vite.config.js`

---

**Ready to code! 🚀**

Your professional full-stack AI SaaS platform is ready to open in VS Code or push to GitHub!
