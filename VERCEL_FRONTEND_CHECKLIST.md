# Vercel Frontend Deployment Checklist

## ✅ Pre-Deployment Setup

- [x] Created `vercel.json` configuration
- [x] Added `vercel-build` script to package.json
- [x] Updated Stripe button for CORS compatibility
- [x] Configured environment variables in vercel.json

## 🚀 Vercel Deployment Steps

### 1. Import Project to Vercel
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Click "New Project"
- [ ] Import your GitHub repository
- [ ] Select the repository

### 2. Configure Build Settings
- [ ] **Framework Preset:** Create React App
- [ ] **Root Directory:** `./` (root directory)
- [ ] **Build Command:** `npm run vercel-build`
- [ ] **Output Directory:** `client/build`
- [ ] **Install Command:** `npm install`

### 3. Set Environment Variables
Go to Project Settings → Environment Variables and add:

**Required Variables:**
- [ ] `REACT_APP_FIREBASE_API_KEY` = `AIzaSyBgaT7_Tj8ZZLZERjP8vMVJJn0FGzKcoVo`
- [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN` = `clothing-db-61ccf.firebaseapp.com`
- [ ] `REACT_APP_FIREBASE_DATABASE_URL` = `https://clothing-db-61ccf.firebaseio.com`
- [ ] `REACT_APP_FIREBASE_PROJECT_ID` = `clothing-db-61ccf`
- [ ] `REACT_APP_FIREBASE_STORAGE_BUCKET` = `clothing-db-61ccf.appspot.com`
- [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` = `615782782215`
- [ ] `REACT_APP_FIREBASE_APP_ID` = `1:615782782215:web:d367bcdd2cbb9d4e`
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` = `pk_test_sLeRAsVNe6ssJc5lCC3PThGa00q0KWcjfZ`

**Backend Connection:**
- [ ] `REACT_APP_API_URL` = `https://your-railway-app.railway.app` (replace with your actual Railway URL)

### 4. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Test the deployed application

## 🔗 Backend Connection

### Railway Backend Requirements
Your Railway backend needs to:
- [ ] Have CORS enabled (already configured in your server.js)
- [ ] Be accessible via HTTPS
- [ ] Have the correct environment variables set:
  - `STRIPE_SECRET_KEY`
  - `NODE_ENV=production`

### Testing the Connection
- [ ] Test user authentication (Firebase)
- [ ] Test product loading from Firebase
- [ ] Test payment processing (Stripe)
- [ ] Test cart functionality

## 🐛 Troubleshooting

### Common Issues:
1. **CORS Errors:** Make sure your Railway backend has CORS enabled
2. **API Connection:** Verify `REACT_APP_API_URL` is correct
3. **Build Failures:** Check Node.js version (should be 18+)
4. **Environment Variables:** Ensure all variables are set in Vercel

### Debug Steps:
1. Check Vercel build logs
2. Check browser console for errors
3. Test API endpoints directly
4. Verify environment variables are loaded

## 📝 Notes

- Your frontend will be served from Vercel
- Your backend will remain on Railway
- All API calls will go from Vercel → Railway
- Firebase authentication will work normally
- Stripe payments will be processed by your Railway backend
