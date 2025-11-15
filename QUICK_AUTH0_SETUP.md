# 🚀 Quick Auth0 Setup (5 Minutes)

## What You Need to Fill In

In your `.env` file, you need to replace these 4 values with your Auth0 credentials:

```
AUTH0_DOMAIN=your-auth0-domain.auth0.com          ← Replace this
AUTH0_CLIENT_ID=your-auth0-client-id              ← Replace this  
AUTH0_CLIENT_SECRET=your-auth0-client-secret      ← Replace this
AUTH0_AUDIENCE=your-auth0-api-identifier           ← Replace this (usually same as domain)
```

And in the frontend section:
```
REACT_APP_AUTH0_DOMAIN=your-auth0-domain.auth0.com    ← Same as AUTH0_DOMAIN
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id        ← Same as AUTH0_CLIENT_ID
```

---

## Step-by-Step

### 1. Sign Up for Auth0 (Free)
- Go to: https://auth0.com/signup
- Use email or Google/GitHub
- **Takes 2 minutes**

### 2. Create Application
- After login, click **"Applications"** in left sidebar
- Click **"+ Create Application"**
- Name: `Screen Time Tracker` (any name)
- Type: **"Single Page Web Application"** ← Important!
- Click **"Create"**

### 3. Get Your Credentials
In the **Settings** tab, you'll see:

**Domain** (looks like: `dev-abc123.us.auth0.com`)
- Copy this → goes in `AUTH0_DOMAIN`

**Client ID** (long string like: `abc123xyz456`)
- Copy this → goes in `AUTH0_CLIENT_ID` and `REACT_APP_AUTH0_CLIENT_ID`

**Client Secret** (click "Show" button)
- Copy this → goes in `AUTH0_CLIENT_SECRET`

### 4. Configure URLs
Scroll down in Settings and add:

**Allowed Callback URLs:**
```
http://localhost:3000
```

**Allowed Logout URLs:**
```
http://localhost:3000
```

**Allowed Web Origins:**
```
http://localhost:3000
```

Click **"Save Changes"**!

### 5. Fill in .env File

Open your `.env` file and replace:

```env
# Auth0 Configuration
AUTH0_DOMAIN=dev-abc123.us.auth0.com                    # ← Your Domain from Step 3
AUTH0_CLIENT_ID=abc123xyz456def789                      # ← Your Client ID from Step 3
AUTH0_CLIENT_SECRET=secret_abc123xyz456def789          # ← Your Client Secret from Step 3
AUTH0_AUDIENCE=https://dev-abc123.us.auth0.com/api/v2/ # ← Usually: https://YOUR-DOMAIN/api/v2/

# Frontend Configuration
REACT_APP_AUTH0_DOMAIN=dev-abc123.us.auth0.com         # ← Same as AUTH0_DOMAIN
REACT_APP_AUTH0_CLIENT_ID=abc123xyz456def789           # ← Same as AUTH0_CLIENT_ID
```

### 6. Restart Docker

```powershell
docker-compose down
docker-compose up -d
```

---

## Example .env (After Filling In)

```env
# Database Configuration (already correct)
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=screen_time_db
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/screen_time_db

# Auth0 Configuration (YOU FILL THESE IN)
AUTH0_DOMAIN=dev-abc123.us.auth0.com
AUTH0_CLIENT_ID=abc123xyz456def789ghi012jkl345
AUTH0_CLIENT_SECRET=secret_abc123xyz456def789ghi012jkl345mno678pqr901
AUTH0_AUDIENCE=https://dev-abc123.us.auth0.com/api/v2/

# JWT Secret (you can leave this or change it)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Flask Configuration (already correct)
FLASK_ENV=development
FLASK_APP=app.py
PORT=5000

# API Configuration (already correct)
API_BASE_URL=http://localhost:5000

# Frontend Configuration (YOU FILL THESE IN - same as Auth0 values above)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AUTH0_DOMAIN=dev-abc123.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=abc123xyz456def789ghi012jkl345
```

---

## Quick Test (Without Auth0)

If you want to test the app **without** Auth0 setup:

1. **Backend works** - API endpoints function
2. **Frontend shows** - Landing page works
3. **Login won't work** - But you can test other features

The app will run, but the "Sign up with Google" button won't work until Auth0 is configured.

---

## Need Visual Help?

Check `AUTH0_SETUP.md` for detailed screenshots and troubleshooting!

