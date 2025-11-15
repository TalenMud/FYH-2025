# 🔐 Auth0 Setup Guide

## Step-by-Step Auth0 Configuration

### Step 1: Create Auth0 Account (Free)

1. Go to https://auth0.com
2. Click **"Sign Up"** (it's free)
3. Sign up with your email or use Google/GitHub

### Step 2: Create an Application

1. Once logged in, go to **Applications** → **Applications** (in the left sidebar)
2. Click **"+ Create Application"**
3. Fill in:
   - **Name**: `Screen Time Investment Tracker` (or any name you like)
   - **Application Type**: Select **"Single Page Web Application"**
4. Click **"Create"**

### Step 3: Configure Application Settings

After creating the application, you'll see the **Settings** tab. You need to configure:

#### Allowed Callback URLs
Add this URL (for local development):
```
http://localhost:3000
```

#### Allowed Logout URLs
Add this URL:
```
http://localhost:3000
```

#### Allowed Web Origins
Add this URL:
```
http://localhost:3000
```

**Important**: Click **"Save Changes"** after adding these URLs!

### Step 4: Get Your Credentials

In the **Settings** tab, you'll find:

1. **Domain** (looks like: `your-tenant.auth0.com`)
   - Example: `dev-abc123.us.auth0.com`
   - Copy this value

2. **Client ID** (a long string)
   - Example: `abc123xyz456def789`
   - Copy this value

3. **Client Secret** (click "Show" to reveal)
   - You might not need this for Single Page Apps, but copy it anyway
   - Example: `secret_abc123xyz...`

### Step 5: Fill in Your .env File

Open your `.env` file and replace the placeholder values:

```env
# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.auth0.com          # ← Replace with your Domain
AUTH0_CLIENT_ID=your-client-id-here        # ← Replace with your Client ID
AUTH0_CLIENT_SECRET=your-client-secret     # ← Replace with your Client Secret
AUTH0_AUDIENCE=your-auth0-api-identifier    # ← Usually same as Domain or leave as Domain
```

**Example** (don't use these, use your own):
```env
AUTH0_DOMAIN=dev-abc123.us.auth0.com
AUTH0_CLIENT_ID=abc123xyz456def789
AUTH0_CLIENT_SECRET=secret_abc123xyz456def789
AUTH0_AUDIENCE=https://dev-abc123.us.auth0.com/api/v2/
```

### Step 6: Update Frontend .env (if running locally)

If you're running the frontend locally (not in Docker), also create/update `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AUTH0_DOMAIN=your-tenant.auth0.com      # ← Same as above
REACT_APP_AUTH0_CLIENT_ID=your-client-id-here      # ← Same as above
```

### Step 7: Restart Docker Containers

After updating `.env`, restart your containers:

```powershell
docker-compose down
docker-compose up -d
```

---

## Quick Reference: What Goes Where

| Auth0 Setting | .env Variable | Where to Find It |
|--------------|---------------|------------------|
| Domain | `AUTH0_DOMAIN` | Settings tab → Domain |
| Client ID | `AUTH0_CLIENT_ID` | Settings tab → Client ID |
| Client Secret | `AUTH0_CLIENT_SECRET` | Settings tab → Client Secret (click Show) |
| Domain (for API) | `AUTH0_AUDIENCE` | Usually: `https://YOUR-DOMAIN/api/v2/` |

---

## Testing Without Auth0 (Temporary)

If you want to test the app without setting up Auth0 right now:

1. **Backend will work** - All API endpoints function without Auth0
2. **Frontend login won't work** - But you can:
   - Test API endpoints directly using Postman or curl
   - View the landing page at http://localhost:3000
   - The app will show an error when trying to login (expected)

To test the API without Auth0:
```powershell
# Test health endpoint (works without auth)
Invoke-WebRequest -Uri http://localhost:5000/health

# Other endpoints require authentication tokens
```

---

## Production Deployment

When deploying to production, update these URLs in Auth0:

- **Allowed Callback URLs**: `https://yourdomain.com`
- **Allowed Logout URLs**: `https://yourdomain.com`
- **Allowed Web Origins**: `https://yourdomain.com`

And update your production `.env` file with the same Auth0 credentials.

---

## Troubleshooting

### "Invalid redirect_uri" error
- Make sure `http://localhost:3000` is in **Allowed Callback URLs**
- Make sure there are no trailing slashes
- Click "Save Changes" in Auth0 dashboard

### "Invalid client" error
- Double-check your `AUTH0_CLIENT_ID` in `.env`
- Make sure there are no extra spaces

### Login not working
- Check browser console for errors
- Verify `REACT_APP_AUTH0_DOMAIN` and `REACT_APP_AUTH0_CLIENT_ID` in frontend
- Make sure Docker containers are using the updated `.env` file

---

## Need Help?

- Auth0 Documentation: https://auth0.com/docs
- Auth0 Community: https://community.auth0.com

