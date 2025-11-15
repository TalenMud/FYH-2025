# How to Test Run the Application

## Option 1: Docker (Easiest - Recommended) 🐳

### Prerequisites
- Docker Desktop installed and running
- Check: `docker --version` and `docker-compose --version`

### Step-by-Step

1. **Create environment file**
   ```powershell
   copy env.example .env
   ```

2. **Edit `.env` file** (you can use placeholder values for now)
   - For quick testing, you can use dummy Auth0 values:
     ```
     AUTH0_DOMAIN=dev-test.auth0.com
     AUTH0_CLIENT_ID=test-client-id
     AUTH0_CLIENT_SECRET=test-secret
     ```
   - Or skip Auth0 setup for now (the app will work but login won't function)

3. **Start all services**
   ```powershell
   docker-compose up -d
   ```
   This starts:
   - PostgreSQL database
   - Backend API (Flask)
   - Frontend (React)

4. **Wait for services to be ready** (about 30-60 seconds)
   ```powershell
   docker-compose ps
   ```
   All services should show "Up" status

5. **Initialize database with dummy data**
   ```powershell
   docker-compose exec backend python init_db.py
   ```
   You should see: `✅ Database seeded with dummy data!`

6. **Access the application**
   - **Frontend**: Open http://localhost:3000 in your browser
   - **Backend Health Check**: http://localhost:5000/health

7. **Test the API directly**
   ```powershell
   # Test health endpoint
   curl http://localhost:5000/health
   
   # Or use PowerShell
   Invoke-WebRequest -Uri http://localhost:5000/health
   ```

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stop Services
```powershell
docker-compose down
```

### Reset Everything (fresh start)
```powershell
docker-compose down -v
docker-compose up -d
docker-compose exec backend python init_db.py
```

---

## Option 2: Local Development (Without Docker) 💻

### Prerequisites
- Python 3.11+ installed
- Node.js 18+ and npm installed
- PostgreSQL 15+ installed and running

### Backend Setup

1. **Navigate to backend**
   ```powershell
   cd backend
   ```

2. **Create virtual environment**
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Set up database**
   - Make sure PostgreSQL is running
   - Create database: `createdb screen_time_db` (or use pgAdmin)
   - Or update `.env` with your PostgreSQL connection string

5. **Create `.env` file in backend folder**
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/screen_time_db
   JWT_SECRET=test-secret-key
   FLASK_ENV=development
   ```

6. **Initialize database**
   ```powershell
   python init_db.py
   ```

7. **Run backend server**
   ```powershell
   python app.py
   ```
   Backend should be running on http://localhost:5000

### Frontend Setup

1. **Open new terminal and navigate to frontend**
   ```powershell
   cd frontend
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Create `.env` file in frontend folder**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_AUTH0_DOMAIN=dev-test.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=test-client-id
   ```

4. **Start frontend**
   ```powershell
   npm start
   ```
   Frontend should open at http://localhost:3000

---

## Quick Test Without Auth0

If you want to test the app without setting up Auth0:

1. **Backend will work** - All API endpoints are functional
2. **Frontend login won't work** - But you can:
   - Test API endpoints directly using Postman or curl
   - Modify the frontend to skip Auth0 temporarily
   - Use the dummy accounts that are already seeded

### Test API Endpoints Directly

```powershell
# Health check
Invoke-WebRequest -Uri http://localhost:5000/health

# Get leaderboard (requires auth token, but you can test structure)
Invoke-WebRequest -Uri http://localhost:5000/leaderboard
```

---

## Testing the Features

### 1. **Database Seeding**
After running `init_db.py`, you should have:
- 3 users (Sarah, Marcus, Emma)
- 7 days of app time history for each
- 30 days of investment history for each

### 2. **API Endpoints**
Test these endpoints:
- `GET /health` - Should return `{"status": "healthy"}`
- `POST /auth/login` - Login endpoint
- `GET /leaderboard` - Get leaderboard (requires auth)

### 3. **Frontend Pages**
- Landing page: http://localhost:3000
- Onboarding: http://localhost:3000/onboarding (after login)
- Profile: http://localhost:3000/profile (after login)
- Investments: http://localhost:3000/investments (after login)

---

## Common Issues & Solutions

### Port Already in Use
```powershell
# Find what's using the port
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Docker Issues
```powershell
# Check Docker is running
docker ps

# Restart Docker Desktop if needed
# Then try again
docker-compose up -d
```

### Database Connection Error
- Make sure PostgreSQL is running
- Check DATABASE_URL in `.env` is correct
- For Docker: database should auto-start with docker-compose

### Frontend Build Errors
```powershell
# Clear node_modules and reinstall
cd frontend
rmdir /s node_modules
npm install
```

---

## Next Steps After Test Run

1. **Set up Auth0** for full authentication
2. **Customize the app** selection and investment strategies
3. **Add real screen time data** integration
4. **Deploy to production** using the deployment configs

