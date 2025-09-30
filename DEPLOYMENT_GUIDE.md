# QuickBasket Deployment Guide

## Issues Fixed

### 1. Git Merge Conflicts
- ✅ Fixed merge conflicts in `server/server.js` and `client/src/context/AppContext.jsx`
- ✅ Cleaned up duplicate code and formatting issues

### 2. CORS Configuration
- ✅ Fixed CORS origin URLs (removed trailing slash)
- ✅ Added proper credentials support

### 3. Cookie Configuration for Production
- ✅ Fixed cookie settings for Vercel deployment
- ✅ Added proper `sameSite: "none"` and `secure: true` for production
- ✅ Added domain configuration for cross-origin requests

### 4. Code Formatting
- ✅ Fixed formatting issues in controllers and routes
- ✅ Cleaned up spacing and syntax errors

### 5. Serverless Configuration
- ✅ Added `serverless-http` wrapper for Vercel
- ✅ Updated Vercel.json configuration

## Deployment Steps

### Backend (Server) Deployment on Vercel

1. **Set Environment Variables in Vercel Dashboard:**
   ```
   NODE_ENV=production
   JWT_SECRET=your_jwt_secret_here
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

2. **Deploy the server folder to Vercel:**
   - Connect your GitHub repository to Vercel
   - Set the root directory to `server`
   - Deploy

### Frontend (Client) Deployment on Vercel

1. **Set Environment Variables in Vercel Dashboard:**
   ```
   VITE_BACKEND_URL=https://your-backend-url.vercel.app
   VITE_CURRENCY=₹
   ```

2. **Deploy the client folder to Vercel:**
   - Create a new Vercel project
   - Set the root directory to `client`
   - Deploy

## Important Notes

### Cookie Domain Issue
The current cookie domain is set to `.vercel.app` which might not work for all Vercel deployments. If you still face authentication issues:

1. **Option 1: Remove domain restriction**
   ```javascript
   // In userController.js, remove the domain line:
   res.cookie("token", token, {
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
     maxAge: 7 * 24 * 60 * 60 * 1000,
     // Remove this line: domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
   });
   ```

2. **Option 2: Use specific domain**
   Replace `.vercel.app` with your actual backend domain (e.g., `your-backend-name.vercel.app`)

### CORS Configuration
Make sure your frontend URL is added to the CORS origins in `server/server.js`:
```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",  // local dev
    "https://your-frontend-url.vercel.app", // Your actual frontend URL
  ],
  credentials: true
}));
```

## Testing After Deployment

1. **Test Authentication:**
   - Try logging in
   - Check if cookies are being set properly
   - Verify that cart operations work without 401 errors

2. **Test Address Addition:**
   - Try adding a new address
   - Check if the address is saved successfully

3. **Test Cart Functionality:**
   - Add items to cart
   - Verify no 401 errors in console
   - Check if cart updates are persisted

## Common Issues and Solutions

### 401 Unauthorized Error
- Check if JWT_SECRET is set correctly
- Verify cookie configuration
- Ensure CORS is properly configured

### Address Not Saving
- Check if user is authenticated
- Verify database connection
- Check server logs for errors

### Cart Items Not Persisting
- Verify authentication middleware
- Check if cart update API is working
- Ensure proper error handling

## Environment Variables Checklist

### Backend (.env)
- [ ] NODE_ENV=production
- [ ] JWT_SECRET
- [ ] MONGODB_URI
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET

### Frontend (.env)
- [ ] VITE_BACKEND_URL
- [ ] VITE_CURRENCY
