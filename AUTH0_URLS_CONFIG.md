# 🔐 Auth0 URLs Configuration Guide

## Required URLs for Local Development

### Allowed Callback URLs
```
http://localhost:3000
```

### Allowed Logout URLs
```
http://localhost:3000
```

### Allowed Web Origins
```
http://localhost:3000
```

### Allowed Origins (CORS)
```
http://localhost:3000
```

---

## Step-by-Step: Where to Add These in Auth0

1. **Log into Auth0 Dashboard**: https://manage.auth0.com

2. **Go to Applications** → Click on your application (or create one)

3. **Click on the "Settings" tab**

4. **Scroll down to find these sections:**

   ### Application URIs Section
   
   **Allowed Callback URLs:**
   - Add: `http://localhost:3000`
   - Click the "+" button or just paste it in
   - This is where Auth0 redirects after login
   
   **Allowed Logout URLs:**
   - Add: `http://localhost:3000`
   - This is where Auth0 redirects after logout
   
   **Allowed Web Origins:**
   - Add: `http://localhost:3000`
   - This allows CORS requests from your frontend

5. **Scroll down to Advanced Settings** (if needed)
   - Click "Advanced Settings"
   - Go to "CORS" tab
   - Make sure `http://localhost:3000` is listed

6. **IMPORTANT: Click "Save Changes"** at the bottom!

---

## Complete Auth0 Settings Checklist

### ✅ Basic Settings (Settings Tab)

- [ ] **Application Type**: Single Page Web Application
- [ ] **Token Endpoint Authentication Method**: None (for SPA)
- [ ] **Allowed Callback URLs**: `http://localhost:3000`
- [ ] **Allowed Logout URLs**: `http://localhost:3000`
- [ ] **Allowed Web Origins**: `http://localhost:3000`

### ✅ Advanced Settings (Optional but Recommended)

- [ ] **CORS**: `http://localhost:3000` (usually auto-added from Web Origins)
- [ ] **OAuth**: Enable "OIDC Conformant" (should be on by default)

### ✅ Connections (Enable Google Login)

1. Go to **Authentication** → **Social** in left sidebar
2. Click on **Google**
3. Toggle it **ON** (enabled)
4. Configure Google OAuth (you'll need Google Cloud credentials)
   - Or use Auth0's default Google connection (easier for testing)

---

## For Production (When You Deploy)

When you deploy to production, add your production URLs:

```
Allowed Callback URLs:
http://localhost:3000,https://yourdomain.com

Allowed Logout URLs:
http://localhost:3000,https://yourdomain.com

Allowed Web Origins:
http://localhost:3000,https://yourdomain.com
```

**Note**: You can have multiple URLs separated by commas!

---

## Quick Copy-Paste for Local Development

Copy this into your Auth0 Application Settings:

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

---

## Common Mistakes to Avoid

❌ **Don't add trailing slashes**: `http://localhost:3000/` (wrong)
✅ **Do use no trailing slash**: `http://localhost:3000` (correct)

❌ **Don't forget to click "Save Changes"**
✅ **Always click "Save Changes" after editing**

❌ **Don't use https for localhost** (unless you set up SSL)
✅ **Use http for localhost**: `http://localhost:3000`

---

## Testing Your Configuration

After saving, test by:
1. Opening http://localhost:3000
2. Clicking "Sign up with Google"
3. You should be redirected to Auth0 login page
4. After login, you should be redirected back to your app

If you get errors, check:
- Browser console (F12) for error messages
- Auth0 logs (Dashboard → Monitoring → Logs)
- Make sure all URLs match exactly (no typos, no trailing slashes)

---

## Summary

**Minimum Required URLs:**
- ✅ Allowed Callback URLs: `http://localhost:3000`
- ✅ Allowed Logout URLs: `http://localhost:3000`
- ✅ Allowed Web Origins: `http://localhost:3000`

**That's it!** These three URLs are the minimum you need for local development.

