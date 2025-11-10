# FanVault Deployment Guide

## 🚀 Deploy Frontend to Vercel

### Option 1: Vercel Dashboard (Recommended - Easiest)

1. **Push to GitHub:**
   ```bash
   # Initialize git if not already done
   git init
   git add .
   git commit -m "Initial commit - FanVault"
   
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/fanvault.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"
   - Done! ✅

### Option 2: Vercel CLI (Faster for testing)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   # From the root directory (content-platform)
   vercel
   
   # Follow prompts:
   # - Set up and deploy? Yes
   # - Which scope? Your account
   # - Link to existing project? No
   # - Project name? fanvault (or your choice)
   # - Directory? ./ (current directory)
   # - Override settings? No
   ```

4. **Production Deploy:**
   ```bash
   vercel --prod
   ```

---

## 🔧 Environment Variables (Add in Vercel)

After deployment, add these in Vercel Dashboard → Settings → Environment Variables:

```env
# API URL (will be Railway URL later)
VITE_API_URL=http://localhost:5000

# For production, change to:
# VITE_API_URL=https://your-backend.railway.app
```

**How to add:**
1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add `VITE_API_URL`
4. Redeploy

---

## 📝 Current Status

### ✅ Ready to Deploy:
- Frontend React app
- All pages built
- Responsive design
- Demo authentication

### ⏳ Not Connected Yet:
- Backend API (deploy to Railway next)
- Database (PostgreSQL on Railway)
- Real authentication (currently demo mode)

---

## 🌐 After Deployment

Your site will be live at:
```
https://fanvault-xxxxx.vercel.app
```

You can:
- ✅ Browse all pages
- ✅ Use demo accounts (creator/fan)
- ✅ Test all UI features
- ⏳ Backend features won't work until Railway is set up

---

## 🔄 Automatic Deployments

Once connected to GitHub:
- Every push to `main` = Production deploy
- Every PR = Preview deploy
- Instant rollbacks available

---

## 🎯 Next Steps

1. **Deploy Frontend** ← You are here
2. **Deploy Backend to Railway**
3. **Set up PostgreSQL on Railway**
4. **Connect Frontend to Backend**
5. **Add custom domain (optional)**

---

## 🐛 Troubleshooting

### Build fails?
```bash
# Test build locally first
npm run build

# If it works locally, check Vercel logs
```

### Routes not working?
- `vercel.json` handles this (already created)
- All routes redirect to index.html for React Router

### Environment variables not working?
- Must start with `VITE_` for Vite
- Redeploy after adding variables

---

## 📞 Need Help?

Check Vercel docs: https://vercel.com/docs
Or Vercel support: https://vercel.com/support
