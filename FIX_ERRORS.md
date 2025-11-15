# Fixing the Errors

## Issue 1: Frontend Docker Build Error ✅ FIXED

**Error**: `npm ci` requires `package-lock.json` which doesn't exist

**Solution**: Changed Dockerfile to use `npm install` instead of `npm ci`

The Dockerfile has been updated. You can now rebuild:

```powershell
docker-compose build frontend
docker-compose up -d
```

---

## Issue 2: PowerShell Execution Policy ❌ NEEDS YOUR ACTION

**Error**: `npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled`

**Solution**: Enable PowerShell script execution

### Option A: Run the fix script (Easiest)

```powershell
.\fix_powershell.ps1
```

Then **restart your terminal** and try npm commands again.

### Option B: Manual fix

Run this command in PowerShell (as Administrator if needed):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then restart your terminal.

### Option C: Use Command Prompt instead

If you don't want to change PowerShell settings, use Command Prompt (cmd.exe) instead:

```cmd
cd C:\Users\tanis\git\fyh2025\FYH-2025
cd frontend
npm install
```

---

## Quick Fix: Rebuild Docker Containers

After fixing the Dockerfile, rebuild:

```powershell
# Stop existing containers
docker-compose down

# Rebuild (this will use the fixed Dockerfile)
docker-compose build

# Start everything
docker-compose up -d

# Initialize database
docker-compose exec backend python init_db.py
```

---

## Alternative: Generate package-lock.json (Optional)

If you want to use `npm ci` in the future, generate the lock file:

1. Fix PowerShell execution policy (see above)
2. Navigate to frontend: `cd frontend`
3. Run: `npm install` (this creates package-lock.json)
4. Commit the package-lock.json file

Then you can change the Dockerfile back to `npm ci` if you want.

---

## Test After Fixes

1. **Fix PowerShell** (choose one option above)
2. **Rebuild Docker containers**:
   ```powershell
   docker-compose build
   docker-compose up -d
   ```
3. **Check status**:
   ```powershell
   docker-compose ps
   ```
4. **Initialize database**:
   ```powershell
   docker-compose exec backend python init_db.py
   ```
5. **Test the app**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000/health

