# ☁️ Run Zuno 24/7 in the Cloud - No MacBook Needed!

## 🎯 Goal
Deploy Zuno so it runs 24/7 without your MacBook. You can close your laptop and the app keeps running!

## ⚡ Quick Start (5 Minutes)

### Option 1: Vercel (Recommended - Easiest)

**Cost**: FREE
**Time**: 5 minutes

#### Step 1: Setup MongoDB Atlas (Free Cloud Database)

1. **Sign up**: https://www.mongodb.com/cloud/atlas (Free)
2. **Create Cluster**: 
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select region (choose closest to you)
   - Click "Create"
3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `zuno-admin`
   - Password: Click "Autogenerate Secure Password" (SAVE THIS!)
   - Role: "Atlas admin" or "Read and write to any database"
   - Click "Add User"
4. **Allow Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"
5. **Get Connection String**:
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://zuno-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your saved password
   - Add database name: `mongodb+srv://zuno-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/zuno?retryWrites=true&w=majority`

#### Step 2: Push Code to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Ready for cloud deployment"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/zuno.git
git branch -M main
git push -u origin main
```

#### Step 3: Deploy Backend to Vercel

```bash
# Install Vercel CLI (one time)
npm install -g vercel

# Deploy backend
cd server
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name: **zuno-api** (or any name)
- Directory: **./server** (press Enter)
- Override settings? **No**

When deployment finishes, Vercel will ask about environment variables. Add:
- `MONGODB_URI`: Paste your MongoDB Atlas connection string
- `NODE_ENV`: `production`

Then deploy to production:
```bash
vercel --prod
```

**Save your backend URL!** (e.g., `https://zuno-api.vercel.app`)

#### Step 4: Deploy Frontend to Vercel

```bash
# From root directory
cd ..
vercel
```

Follow prompts:
- Set up and deploy? **Yes**
- Link to existing project? **No**
- Project name: **zuno-frontend**
- Directory: **./** (press Enter)
- Override settings? **No**

Add environment variable:
- `VITE_API_URL`: `https://your-backend-url.vercel.app/api`

Then deploy to production:
```bash
vercel --prod
```

**Save your frontend URL!** (e.g., `https://zuno-frontend.vercel.app`)

#### Step 5: Seed Production Database

```bash
cd server
# Update .env with MongoDB Atlas connection
echo "MONGODB_URI=your-mongodb-atlas-connection-string" > .env
npm run seed
```

## ✅ Done! Your App is Live!

- **Frontend URL**: `https://zuno-frontend.vercel.app`
- **Backend URL**: `https://zuno-api.vercel.app/api`
- **Status**: Running 24/7 in the cloud! 🎉

You can now:
- ✅ Close your MacBook
- ✅ Access from any device
- ✅ Share with others
- ✅ It runs automatically forever!

## 🔄 Auto-Deploy (Optional)

Connect Vercel to GitHub for automatic deployments:

1. Go to: https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Add environment variables
5. Deploy!

Now every time you push to GitHub, Vercel automatically deploys!

## 💰 Cost: FREE!

- **Vercel**: Free tier (100GB bandwidth/month)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0/month forever!

## 🛠️ Alternative: Railway (Also Free)

### Deploy Backend to Railway

1. **Sign up**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Set Root Directory**: `server`
5. **Add Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
6. **Deploy**: Railway auto-deploys!
7. **Get URL**: `https://zuno-api.railway.app`

### Deploy Frontend to Vercel

Follow Step 4 above, but use Railway backend URL:
- `VITE_API_URL`: `https://zuno-api.railway.app/api`

## 📊 What Gets Deployed

### Backend (API Server)
- Express.js API
- MongoDB connection
- All API endpoints
- Runs on Vercel/Railway servers

### Frontend (React App)
- React application
- Static files (HTML, CSS, JS)
- Served from CDN
- Runs on Vercel CDN

### Database (MongoDB Atlas)
- All your coupons
- User data
- Categories
- Runs on MongoDB cloud servers

## 🔍 Verify Deployment

1. **Test Backend**:
   ```bash
   curl https://your-backend-url.vercel.app/health
   ```
   Should return: `{"status":"ok",...}`

2. **Test API**:
   ```bash
   curl https://your-backend-url.vercel.app/api/coupons
   ```
   Should return JSON with coupons

3. **Test Frontend**:
   - Visit: `https://your-frontend-url.vercel.app`
   - Check browser console (no errors)
   - Test search, save features

## 🛑 To Stop/Delete

- **Vercel**: Go to dashboard → Delete project (or just stop using it)
- **Railway**: Go to dashboard → Delete service
- **MongoDB Atlas**: Delete cluster (or leave it - free forever)

## 📱 Access Your App

Once deployed:
- ✅ Works on any device (phone, tablet, computer)
- ✅ Works from anywhere in the world
- ✅ No MacBook needed
- ✅ Runs 24/7 automatically
- ✅ Free forever (within limits)

## 🚨 Troubleshooting

**Backend not connecting?**
- Check MongoDB Atlas IP whitelist (allow all IPs)
- Verify connection string has correct password
- Check Vercel environment variables

**Frontend not loading?**
- Check `VITE_API_URL` environment variable
- Verify backend URL is correct
- Check browser console for errors

**CORS errors?**
- Backend has CORS enabled
- If issues, update `server/src/server.js`:
  ```javascript
  app.use(cors({
    origin: ['https://your-frontend-url.vercel.app']
  }));
  ```

## 📚 Next Steps

1. ✅ Deploy to cloud
2. ✅ Test everything works
3. ✅ Set up daily coupon refresh (cron job)
4. ✅ Share with users!
5. ✅ Monitor usage

## 🎉 You're Done!

Your app is now running in the cloud 24/7! No MacBook needed!

