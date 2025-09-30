# Troubleshooting 401 Errors in QuickBasket

## Current Issue
You're getting 401 errors on these endpoints:
- `/api/cart/update`
- `/api/address/get`
- `/api/address/add`

## Root Cause Analysis

The 401 errors indicate that the authentication middleware is not finding a valid JWT token in the cookies. This is likely due to:

1. **Cookie Domain Mismatch**: Your backend is on Render (`qb-pfkj.onrender.com`) but cookies might be configured for a different domain
2. **CORS Issues**: Cookies might not be sent due to CORS configuration
3. **Environment Variables**: JWT_SECRET might not be set correctly

## Immediate Fixes Applied

### 1. Removed Domain Restriction from Cookies
```javascript
// Before (causing issues):
domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined

// After (fixed):
// Removed domain restriction entirely
```

### 2. Added Debug Logging
Added comprehensive logging to:
- Authentication middleware (`authUser.js`)
- User authentication endpoint (`isAuth`)
- Debug endpoint to check cookies

### 3. Updated CORS Configuration
Added your Render frontend URL to allowed origins.

## Testing Steps

### Step 1: Check Backend Health
Visit: `https://qb-pfkj.onrender.com/`
Should show: "✅ API is Working and DB connected"

### Step 2: Test Cookie Debug Endpoint
Visit: `https://qb-pfkj.onrender.com/debug/cookies`
This will show you what cookies are being sent to the backend.

### Step 3: Check Server Logs
Look at your Render server logs to see:
- What cookies are being received
- JWT verification errors
- Authentication flow details

## Environment Variables to Check

Make sure these are set in your Render dashboard:

### Backend Environment Variables
```
NODE_ENV=production
JWT_SECRET=your_strong_jwt_secret_here
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend Environment Variables
```
VITE_BACKEND_URL=https://qb-pfkj.onrender.com
VITE_CURRENCY=₹
```

## Common Solutions

### Solution 1: Clear Browser Cookies
1. Open Developer Tools (F12)
2. Go to Application/Storage tab
3. Clear all cookies for your domain
4. Try logging in again

### Solution 2: Check JWT_SECRET
Make sure the JWT_SECRET is the same in both login and verification:
1. Check your Render environment variables
2. Ensure it's a strong, random string
3. Redeploy if you changed it

### Solution 3: Test Authentication Flow
1. Try logging in again
2. Check if cookies are set in browser
3. Check server logs for authentication details

### Solution 4: Manual Cookie Test
1. Login to get a token
2. Copy the token from browser cookies
3. Test the debug endpoint: `https://qb-pfkj.onrender.com/debug/cookies`
4. Check if the token appears in the response

## Debug Commands

### Check if backend is receiving cookies:
```bash
curl -H "Cookie: token=your_token_here" https://qb-pfkj.onrender.com/debug/cookies
```

### Test authentication endpoint:
```bash
curl -H "Cookie: token=your_token_here" -X POST https://qb-pfkj.onrender.com/api/user/is-auth
```

## Next Steps

1. **Deploy the updated code** to Render
2. **Check the debug endpoint** to see what cookies are being received
3. **Test the authentication flow** by logging in again
4. **Check server logs** for detailed error information
5. **Verify environment variables** are set correctly

## If Issues Persist

If you're still getting 401 errors after these fixes:

1. **Check Render logs** for specific error messages
2. **Verify JWT_SECRET** is set correctly
3. **Test with a fresh browser session** (incognito mode)
4. **Check if cookies are being set** in the browser after login

The debug logging will help identify exactly where the authentication is failing.
