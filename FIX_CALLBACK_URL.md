# 🔧 Fix Callback URL Mismatch Error

## The Problem
You're getting: "Callback URL mismatch. The provided redirect_uri is not in the list of allowed callback URLs."

## Quick Fix

### Step 1: Check What URL is Being Sent
The app sends: `http://localhost:3000` (no trailing slash)

### Step 2: Verify Auth0 Settings
In Auth0 Dashboard → Your App → Settings:

**Allowed Callback URLs** must be EXACTLY:
```
http://localhost:3000
```

**Common Mistakes:**
- ❌ `http://localhost:3000/` (trailing slash - WRONG)
- ❌ `https://localhost:3000` (https - WRONG for localhost)
- ❌ `localhost:3000` (missing http:// - WRONG)
- ✅ `http://localhost:3000` (correct!)

### Step 3: Check All Three URL Fields

Make sure ALL THREE match exactly:

1. **Allowed Callback URLs**: `http://localhost:3000`
2. **Allowed Logout URLs**: `http://localhost:3000`
3. **Allowed Web Origins**: `http://localhost:3000`

### Step 4: Save and Test

1. Click **"Save Changes"** in Auth0
2. Wait 10-15 seconds for changes to propagate
3. Clear your browser cache or use incognito mode
4. Try logging in again

---

## Detailed Troubleshooting

### Check 1: Exact Match Required
Auth0 is very strict - the URL must match EXACTLY:
- No trailing slashes
- Must include `http://`
- Must be lowercase
- No extra spaces

### Check 2: Multiple URLs
If you have multiple URLs, separate with commas:
```
http://localhost:3000,http://localhost:3001
```

### Check 3: Browser Console
Open browser console (F12) and check for errors. The redirect_uri being sent should be visible in the network tab.

### Check 4: Auth0 Logs
1. Go to Auth0 Dashboard → Monitoring → Logs
2. Look for recent failed login attempts
3. Check what redirect_uri was received
4. Compare it to what you have configured

---

## Common Solutions

### Solution 1: Remove Trailing Slash
If you accidentally added `http://localhost:3000/`:
1. Remove the trailing slash
2. Save changes
3. Try again

### Solution 2: Clear Browser Cache
Sometimes browsers cache old redirect URIs:
1. Clear browser cache
2. Or use incognito/private mode
3. Try again

### Solution 3: Rebuild Frontend
If you updated Auth0 settings, rebuild the frontend:
```powershell
docker-compose down
docker-compose up -d --build
```

### Solution 4: Check for Typos
Double-check for:
- Extra spaces
- Wrong port number (should be 3000)
- Wrong protocol (http not https)
- Capital letters (should be all lowercase)

---

## Verification Checklist

Before trying to login, verify:

- [ ] Auth0 → Applications → Your App → Settings
- [ ] Allowed Callback URLs = `http://localhost:3000` (exact match)
- [ ] Allowed Logout URLs = `http://localhost:3000` (exact match)
- [ ] Allowed Web Origins = `http://localhost:3000` (exact match)
- [ ] Clicked "Save Changes" in Auth0
- [ ] Waited 10-15 seconds after saving
- [ ] Frontend is running on http://localhost:3000
- [ ] No trailing slashes in any URL
- [ ] Using `http://` not `https://`

---

## Still Not Working?

1. **Check Auth0 Logs**: Dashboard → Monitoring → Logs
   - Look for the exact redirect_uri that was received
   - Compare it to your settings

2. **Try Explicit Redirect**: The code uses `window.location.origin` which should be `http://localhost:3000`
   - Make sure you're accessing the app at exactly `http://localhost:3000`
   - Not `http://127.0.0.1:3000` or any other variation

3. **Test with curl** (to see exact redirect_uri):
   ```powershell
   # This will show you what's being sent
   # Check browser network tab instead (F12 → Network)
   ```

4. **Contact Support**: If still not working, the issue might be in Auth0 configuration or the app needs to be rebuilt.

---

## Quick Fix Command

After updating Auth0 settings, rebuild:
```powershell
docker-compose down
docker-compose up -d --build
```

Then clear browser cache and try again!

