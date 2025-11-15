# 🚀 How to Test Run - Step by Step

## Current Status ✅
- ✅ Python 3.11 installed
- ✅ `.env` file created
- ❌ Docker not installed (optional)
- ❌ Node.js not installed (needed for frontend)

## Quick Test Options

### Option A: Test Backend Only (Fastest - Works Now!)

You can test the backend API right now since Python is installed:

1. **Navigate to backend folder**
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

4. **Note**: You'll need PostgreSQL installed, OR you can use SQLite for quick testing.

   **Quick SQLite option** (modify `backend/app.py` line 25):
   ```python
   # Change from:
   app.config['SQLALCHEMY_DATABASE_URI'] = database_url
   # To:
   app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
   ```

5. **Initialize database**
   ```powershell
   python init_db.py
   ```

6. **Run the server**
   ```powershell
   python app.py
   ```

7. **Test the API**
   - Open browser: http://localhost:5000/health
   - Should see: `{"status": "healthy"}`

---

### Option B: Full Setup (Backend + Frontend)

#### Step 1: Install Node.js
1. Download from: https://nodejs.org/
2. Install Node.js 18 LTS or newer
3. Restart your terminal/PowerShell
4. Verify: `node --version` and `npm --version`

#### Step 2: Install PostgreSQL (or use SQLite)
- **Option 1**: Download PostgreSQL from https://www.postgresql.org/download/windows/
- **Option 2**: Use SQLite (easier for testing) - modify backend as shown above

#### Step 3: Run Backend
Follow Option A steps above.

#### Step 4: Run Frontend
1. **Open new terminal/PowerShell**
2. **Navigate to frontend**
   ```powershell
   cd frontend
   ```

3. **Install dependencies**
   ```powershell
   npm install
   ```

4. **Start frontend**
   ```powershell
   npm start
   ```
   Browser should open automatically to http://localhost:3000

---

### Option C: Use Docker (Easiest - But Need to Install Docker First)

1. **Install Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop/
   - Install and restart your computer
   - Make sure Docker Desktop is running

2. **Then run these commands:**
   ```powershell
   # Make sure you're in the project root
   docker-compose up -d
   
   # Wait 30 seconds, then initialize database
   docker-compose exec backend python init_db.py
   ```

3. **Access the app**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000/health

---

## Recommended: Start with Backend Only

Since you have Python installed, let's test the backend first:

```powershell
# 1. Go to backend folder
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate it
.\venv\Scripts\activate

# 4. Install packages
pip install -r requirements.txt

# 5. For quick testing, let's use SQLite instead of PostgreSQL
# (I'll help you modify the code if needed)

# 6. Run the server
python app.py
```

Then test: http://localhost:5000/health

---

## Need Help?

- Check `TEST_RUN.md` for detailed instructions
- Check `README.md` for full documentation
- Common issues are listed in both files

