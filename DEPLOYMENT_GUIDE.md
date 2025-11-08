# Zuno Deployment Guide - Run Without Your MacBook

This guide will help you deploy Zuno to the cloud so it runs 24/7 without your MacBook.

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)
**Best for**: Frontend + Backend API (Serverless)
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Easy MongoDB Atlas integration
- ✅ No credit card required

### Option 2: Railway
**Best for**: Backend API (Node.js + MongoDB)
- ✅ Free tier available
- ✅ Easy MongoDB setup
- ✅ Simple deployment

### Option 3: Render
**Best for**: Backend API + MongoDB
- ✅ Free tier available
- ✅ Managed MongoDB
- ✅ Simple deployment

## Step-by-Step: Deploy to Vercel (Recommended)

### Prerequisites
1. GitHub account
2. MongoDB Atlas account (free): https://www.mongodb.com/cloud/atlas

### Step 1: Setup MongoDB Atlas (Free Cloud Database)

1. **Sign up for MongoDB Atlas**:
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Create account

2. **Create a Cluster**:
   - Choose "Free" tier (M0)
   - Select cloud provider (AWS recommended)
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `zuno-admin`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Click "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/zuno`
   - Replace `<password>` with your database user password
   - Replace `zuno` with your database name

### Step 2: Push Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Zuno app"
   ```

2. **Create GitHub Repository**:
   - Go to: https://github.com/new
   - Repository name: `zuno`
   - Make it public or private
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/zuno.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy Backend to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Backend**:
   ```bash
   cd server
   vercel
   ```
   - Follow prompts:
     - Set up and deploy? **Yes**
     - Which scope? **Your account**
     - Link to existing project? **No**
     - Project name: **zuno-api**
     - Directory: **./server**
     - Override settings? **No**

4. **Add Environment Variables**:
   ```bash
   cd server
   vercel env add MONGODB_URI
   # Paste your MongoDB Atlas connection string
   
   vercel env add NODE_ENV
   # Enter: production
   
   vercel env add PORT
   # Enter: 3001 (or leave blank for Vercel default)
   ```

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

6. **Get Backend URL**:
   - After deployment, Vercel will give you a URL like: `https://zuno-api.vercel.app`
   - Save this URL!

### Step 4: Deploy Frontend to Vercel

1. **Update Frontend API URL**:
   ```bash
   # In root directory, create .env.production
   echo "VITE_API_URL=https://zuno-api.vercel.app/api" > .env.production
   ```

2. **Deploy Frontend**:
   ```bash
   # From root directory
   vercel
   ```
   - Follow prompts:
     - Set up and deploy? **Yes**
     - Link to existing project? **No**
     - Project name: **zuno-frontend**
     - Directory: **./**
     - Override settings? **No**

3. **Add Environment Variable**:
   ```bash
   vercel env add VITE_API_URL production
   # Enter: https://zuno-api.vercel.app/api
   ```

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

5. **Get Frontend URL**:
   - After deployment, Vercel will give you a URL like: `https://zuno-frontend.vercel.app`
   - This is your live app URL!

### Step 5: Seed Production Database

1. **Update server/.env with Atlas connection**:
   ```bash
   cd server
   # Update .env file with MongoDB Atlas connection string
   ```

2. **Run seed script**:
   ```bash
   cd server
   npm run seed
   ```

   Or connect to your production database and seed via Vercel:
   ```bash
   vercel env pull .env.production
   npm run seed
   ```

## Alternative: Deploy to Railway (Easier for Backend)

### Backend on Railway

1. **Sign up**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Add Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
   - `PORT`: (Railway will set this automatically)
5. **Deploy**: Railway will auto-deploy
6. **Get URL**: Railway gives you a URL like `https://zuno-api.railway.app`

### Frontend on Vercel

1. Follow Step 4 above
2. Use Railway backend URL: `VITE_API_URL=https://zuno-api.railway.app/api`

## Alternative: Deploy to Render

### Backend on Render

1. **Sign up**: https://render.com
2. **New** → "Web Service"
3. **Connect GitHub repository**
4. **Settings**:
   - Name: `zuno-api`
   - Environment: `Node`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
5. **Add Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
6. **Deploy**: Render will auto-deploy
7. **Get URL**: Render gives you a URL like `https://zuno-api.onrender.com`

## Setup Scripts for Production

### Update package.json

Add to `server/package.json`:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js"
  }
}
```

## Automated Deployment (GitHub Actions)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Cost Estimate

**Free Tier Options**:
- **Vercel**: Free (100GB bandwidth/month)
- **Railway**: Free ($5 credit/month)
- **Render**: Free (sleeps after 15min inactivity)
- **MongoDB Atlas**: Free (512MB storage)

**Total Cost**: $0/month for development/testing

## Testing Your Deployment

1. **Test Backend**:
   ```bash
   curl https://your-backend-url.vercel.app/health
   ```

2. **Test API**:
   ```bash
   curl https://your-backend-url.vercel.app/api/coupons
   ```

3. **Test Frontend**:
   - Visit: `https://your-frontend-url.vercel.app`
   - Check browser console for errors
   - Test search, save, and dashboard features

## Troubleshooting

### Backend Not Connecting to MongoDB
- Check MongoDB Atlas IP whitelist (allow all IPs for testing)
- Verify connection string has correct password
- Check MongoDB Atlas cluster is running

### CORS Errors
- Backend has CORS enabled for all origins
- If issues persist, update `server/src/server.js`:
  ```javascript
  app.use(cors({
    origin: ['https://your-frontend-url.vercel.app']
  }));
  ```

### Environment Variables Not Working
- Vercel: Check environment variables in project settings
- Railway: Check environment variables in service settings
- Render: Check environment variables in service settings

## Next Steps

1. ✅ Deploy backend to cloud
2. ✅ Deploy frontend to cloud
3. ✅ Seed production database
4. ✅ Test everything works
5. ✅ Set up daily coupon refresh (cron job)
6. ✅ Monitor and maintain

## Quick Commands

```bash
# Deploy backend to Vercel
cd server && vercel --prod

# Deploy frontend to Vercel
vercel --prod

# Seed production database
cd server
vercel env pull .env.production
npm run seed

# View logs
vercel logs
```

