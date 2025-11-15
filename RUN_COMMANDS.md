# 🚀 How to Run the Application

## Quick Start (If Already Built)

If you've already built the containers before:

```powershell
# Start everything
docker-compose up -d

# Check status
docker-compose ps

# View logs (optional)
docker-compose logs -f
```

Then open: **http://localhost:3000**

---

## Full Start (First Time or After Changes)

If you need to rebuild or it's the first time:

```powershell
# 1. Build and start
docker-compose up -d --build

# 2. Wait 10-15 seconds for services to start

# 3. Initialize database (only needed once or after reset)
docker-compose exec backend python init_db.py

# 4. Check everything is running
docker-compose ps
```

Then open: **http://localhost:3000**

---

## Common Commands

### Start the app
```powershell
docker-compose up -d
```

### Stop the app
```powershell
docker-compose down
```

### Restart the app
```powershell
docker-compose restart
```

### View logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Check status
```powershell
docker-compose ps
```

### Rebuild after code changes
```powershell
docker-compose up -d --build
```

### Reset everything (fresh start)
```powershell
docker-compose down -v
docker-compose up -d
docker-compose exec backend python init_db.py
```

---

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## Troubleshooting

### Containers won't start
```powershell
docker-compose down
docker-compose up -d
```

### Database issues
```powershell
docker-compose exec backend python init_db.py
```

### Port already in use
```powershell
# Find what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Or change ports in docker-compose.yml
```

