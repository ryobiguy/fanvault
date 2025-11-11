# 🚂 Railway Deployment Guide for DirectFans Backend

## Step 1: Create Railway Account & Project

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `fanvault` repository

## Step 2: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance
4. Copy the connection details (you'll need these)

## Step 3: Configure Environment Variables

In Railway project settings, add these variables:

```env
# Server
PORT=5000
NODE_ENV=production

# Database (Railway will auto-populate these)
DATABASE_URL=${DATABASE_URL}
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USER=${PGUSER}
DB_PASSWORD=${PGPASSWORD}

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS - Your Vercel frontend URL
FRONTEND_URL=https://your-app.vercel.app

# Stripe (get from stripe.com dashboard)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CREATOR_PRICE_ID=price_your_price_id

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 4: Deploy Backend

Railway will automatically:
1. Detect your Node.js app
2. Install dependencies
3. Run the start command
4. Deploy your backend

## Step 5: Initialize Database

After deployment, you need to run the schema:

### Option A: Using Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run database migration
railway run npm run db:migrate
```

### Option B: Using Railway Dashboard
1. Go to your PostgreSQL service in Railway
2. Click "Data" tab
3. Click "Query"
4. Copy and paste the contents of `backend/src/database/schema.sql`
5. Execute the query

## Step 6: Get Your Backend URL

1. In Railway, go to your backend service
2. Click "Settings"
3. Under "Domains", click "Generate Domain"
4. Copy the URL (e.g., `https://your-app.up.railway.app`)

## Step 7: Update Frontend

Update your frontend to use the Railway backend URL:

Create `src/config/api.ts`:
```typescript
export const API_URL = import.meta.env.PROD 
  ? 'https://your-app.up.railway.app/api'
  : 'http://localhost:5000/api'
```

## Step 8: Update Vercel Environment Variables

In Vercel project settings, add:
```env
VITE_API_URL=https://your-app.up.railway.app/api
```

## 🔧 Troubleshooting

### Database Connection Issues
- Check that DATABASE_URL is set correctly
- Verify PostgreSQL service is running
- Check Railway logs for connection errors

### CORS Errors
- Ensure FRONTEND_URL matches your Vercel domain
- Check that CORS is configured in server.js

### Deployment Fails
- Check Railway build logs
- Verify all dependencies are in package.json
- Ensure Node.js version is compatible

## 📊 Monitoring

- Railway provides automatic logging
- View logs in Railway dashboard
- Set up alerts for errors

## 💰 Costs

- PostgreSQL: ~$5/month (500MB storage)
- Backend hosting: ~$5/month (512MB RAM)
- Total: ~$10/month

## 🚀 Next Steps After Deployment

1. ✅ Test API endpoints with Postman
2. ✅ Connect frontend to backend
3. ✅ Set up Stripe webhooks
4. ✅ Configure Cloudinary for uploads
5. ✅ Add monitoring/alerts
