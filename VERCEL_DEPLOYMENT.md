# Vercel Deployment Guide

## 🚀 Quick Start (Frontend Only)

### 1. Deploy Frontend to Vercel

1. **Import Project:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" → "Import Git Repository"
   - Select your repository

2. **Configure Build Settings:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `./` (root)
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `client/build`
   - **Install Command:** `npm install`

3. **Set Environment Variables:**
   Go to Project Settings → Environment Variables and add:
   ```
   REACT_APP_FIREBASE_API_KEY=AIzaSyBgaT7_Tj8ZZLZERjP8vMVJJn0FGzKcoVo
   REACT_APP_FIREBASE_AUTH_DOMAIN=clothing-db-61ccf.firebaseapp.com
   REACT_APP_FIREBASE_DATABASE_URL=https://clothing-db-61ccf.firebaseio.com
   REACT_APP_FIREBASE_PROJECT_ID=clothing-db-61ccf
   REACT_APP_FIREBASE_STORAGE_BUCKET=clothing-db-61ccf.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=615782782215
   REACT_APP_FIREBASE_APP_ID=1:615782782215:web:d367bcdd2cbb9d4e
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_sLeRAsVNe6ssJc5lCC3PThGa00q0KWcjfZ
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

4. **Deploy Backend Separately:**
   - Deploy your Express server to Railway, Heroku, or Render
   - Update `REACT_APP_API_URL` with your backend URL

### 2. Deploy Backend (Choose One)

#### Option A: Railway (Recommended)
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set environment variables:
   ```
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NODE_ENV=production
   ```
4. Deploy and get your Railway URL

#### Option B: Heroku
1. Create a new Heroku app
2. Connect to GitHub
3. Set environment variables in Heroku dashboard
4. Deploy

#### Option C: Render
1. Create a new Web Service on Render
2. Connect to GitHub
3. Set environment variables
4. Deploy

## 🔧 Full-Stack Deployment (Advanced)

If you want to deploy both frontend and backend on Vercel:

1. **Rename config file:**
   ```bash
   mv vercel-fullstack.json vercel.json
   ```

2. **Install Stripe in root:**
   ```bash
   npm install stripe
   ```

3. **Update Stripe button API URL:**
   Change `/payment` to `/api/payment` in the Stripe button component

4. **Deploy to Vercel:**
   - Import project
   - Vercel will automatically detect the configuration
   - Set environment variables including `STRIPE_SECRET_KEY`

## 🐛 Troubleshooting

### Build Issues
- Make sure Node.js version is 18+ (set in Vercel settings)
- Check that all environment variables are set
- Verify the build command is correct

### API Issues
- Ensure `REACT_APP_API_URL` points to your backend
- Check CORS settings on your backend
- Verify Stripe keys are correct

### Firebase Issues
- Ensure all Firebase environment variables are set
- Check Firebase project configuration
- Verify Firebase rules allow your domain

## 📝 Notes

- The current Stripe keys are in test mode
- For production, switch to live Stripe keys
- Consider using separate Firebase projects for production
- Monitor your Vercel usage and upgrade if needed
