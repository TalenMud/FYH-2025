# Quick Start Guide

## 🚀 Fastest Way to Get Started

### Prerequisites
- Docker and Docker Compose installed
- Auth0 account (free tier works)

### Steps

1. **Clone and navigate**
   ```bash
   cd FYH-2025
   ```

2. **Copy environment file**
   ```bash
   # On Linux/Mac
   cp env.example .env
   
   # On Windows
   copy env.example .env
   ```

3. **Edit `.env` file**
   - Add your Auth0 credentials
   - Update database settings if needed

4. **Start everything**
   ```bash
   docker-compose up -d
   ```

5. **Initialize database**
   ```bash
   docker-compose exec backend python init_db.py
   ```

6. **Access the app**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000/health

## 🔐 Setting Up Auth0

1. Go to https://auth0.com and create a free account
2. Create a new Application:
   - Type: Single Page Web Application
   - Allowed Callback URLs: `http://localhost:3000`
   - Allowed Logout URLs: `http://localhost:3000`
3. Copy your Domain and Client ID to `.env`

## 📊 Testing with Dummy Data

The app comes with 3 pre-seeded accounts:
- **Sarah Chen** (sarah.chen@example.com) - Medium risk
- **Marcus Johnson** (marcus.j@example.com) - High risk, #1 on leaderboard
- **Emma Williams** (emma.w@example.com) - Low risk

You can sign in with any Google account to create your own account.

## 🛠 Troubleshooting

### Database not connecting
```bash
docker-compose logs db
docker-compose restart db
```

### Backend errors
```bash
docker-compose logs backend
docker-compose restart backend
```

### Frontend not loading
```bash
docker-compose logs frontend
docker-compose restart frontend
```

### Reset everything
```bash
docker-compose down -v
docker-compose up -d
docker-compose exec backend python init_db.py
```

## 📝 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the app selection and investment strategies
- Deploy to your preferred platform (Vercel, Railway, Render, etc.)

