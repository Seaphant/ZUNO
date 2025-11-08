# Quick Deploy Guide - Run Zuno 24/7 in the Cloud

## 🚀 Fastest Way: Vercel (5 minutes)

### Step 1: Setup MongoDB Atlas (Free Cloud Database)

1. **Create Account**: https://www.mongodb.com/cloud/atlas
2. **Create Free Cluster**: Choose "Free" tier
3. **Create Database User**: 
   - Username: `zuno-admin`
   - Password: (save this!)
4. **Whitelist IP**: Click "Allow Access from Anywhere"
5. **Get Connection String**:
   - Go to "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://zuno-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/zuno?retryWrites=true&w=majority`

### Step 2: Push Code to GitHub

```bash
# If not already a git repo
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/zuno.git
git push -u origin main
```

### Step 3: Deploy Backend to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend**:
   ```bash
   cd server
   vercel
   ```
   - Follow prompts (say Yes to everything)
   - When asked for environment variables, add:
     - `MONGODB_URI`: (your MongoDB Atlas connection string)
     - `NODE_ENV`: `production`

3. **Get Backend URL**:
   - After deployment, you'll get a URL like: `https://zuno-api-xxxxx.vercel.app`
   - Save this URL!

### Step 4: Deploy Frontend to Vercel

1. **Deploy Frontend**:
   ```bash
   # From root directory
   vercel
   ```
   - When asked for environment variables, add:
     - `VITE_API_URL`: `https://your-backend-url.vercel.app/api`

2. **Get Frontend URL**:
   - You'll get a URL like: `https://zuno-frontend-xxxxx.vercel.app`
   - **This is your live app!** 🎉

### Step 5: Seed Production Database

```bash
cd server
# Update .env with MongoDB Atlas connection
echo "MONGODB_URI=your-mongodb-atlas-connection-string" > .env
npm run seed
```

## ✅ Done!

Your app is now live and running 24/7:
- **Frontend**: `https://zuno-frontend-xxxxx.vercel.app`
- **Backend**: `https://zuno-api-xxxxx.vercel.app/api`

## 🔄 Auto-Deploy from GitHub

1. **Connect Vercel to GitHub**:
   - Go to: https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-deploy on every push!

2. **Update Environment Variables in Vercel Dashboard**:
   - Go to your project settings
   - Add `MONGODB_URI` and `VITE_API_URL`
   - Redeploy

## 💰 Cost: FREE!

- Vercel: Free tier (100GB bandwidth/month)
- MongoDB Atlas: Free tier (512MB storage)
- **Total: $0/month**

## 🛑 To Stop Services

- Vercel: Delete project in dashboard (or just stop using it - free tier has limits)
- MongoDB Atlas: Delete cluster (or leave it - free tier is always free)

## 📱 Access Your App

Once deployed, you can:
- ✅ Close your MacBook
- ✅ Access from any device
- ✅ Share URL with others
- ✅ It runs 24/7 automatically!

## 🔧 Troubleshooting

**Backend not working?**
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check Vercel logs: `vercel logs`

**Frontend not loading?**
- Check `VITE_API_URL` environment variable
- Verify backend URL is correct
- Check browser console for errors

## Next: Daily Coupon Refresh

Set up a cron job to refresh coupons daily at midnight. See `COUPON_REFRESH.md` for details.

