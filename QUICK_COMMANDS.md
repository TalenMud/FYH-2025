# 🚀 Quick Commands Reference

## Check if it's running
```powershell
docker-compose ps
```
Shows status of all containers (running/stopped)

---

## Start the app
```powershell
docker-compose up -d
```
Starts all containers in the background

---

## Stop the app
```powershell
docker-compose down
```
Stops and removes all containers

---

## Restart the app
```powershell
docker-compose restart
```
Restarts all containers (keeps them running)

---

## Rebuild after code changes
```powershell
docker-compose up -d --build
```
Rebuilds images and starts containers

---

## View logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

---

## Access Points
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000/health

