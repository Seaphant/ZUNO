# Next Steps - Zuno Backend Setup

## Current Status

✅ Backend API structure created
✅ Database models defined
✅ 40 coupons ready to seed (10 per store)
✅ Frontend integrated with API
✅ Port 5173 cleared (ready to restart frontend)

## Quick Start Guide

### Option 1: Use MongoDB Locally

1. **Install MongoDB** (if not installed):
   ```bash
   brew install mongodb-community
   brew services start mongodb-community
   ```

2. **Seed the Database**:
   ```bash
   cd server
   npm run seed
   ```
   This creates 5 categories and 40 coupons.

3. **Start Backend Server**:
   ```bash
   ./start-backend.sh
   ```
   Or manually:
   ```bash
   cd server
   npm run dev
   ```
   Backend will run on: `http://localhost:3001`

4. **Start Frontend**:
   ```bash
   npm run dev
   ```
   Frontend will run on: `http://localhost:5173`

### Option 2: Use MongoDB Atlas (Cloud - Recommended)

1. **Create Free MongoDB Atlas Account**:
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free tier
   - Create a cluster
   - Get your connection string

2. **Update .env file**:
   ```bash
   cd server
   # Edit .env file
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zuno
   PORT=3001
   NODE_ENV=development
   ```

3. **Continue with steps 2-4 from Option 1**

## Test the Setup

1. **Test Backend API**:
   ```bash
   curl http://localhost:3001/api/coupons
   ```
   Should return JSON with coupons.

2. **Test Frontend**:
   - Open: http://localhost:5173
   - Check browser console for API connection
   - Search page should load coupons from API

## Verify Everything Works

1. **Backend Health Check**:
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Get Safeway Coupons**:
   ```bash
   curl http://localhost:3001/api/coupons?store=Safeway
   ```
   Should return 10 Safeway coupons.

3. **Search Coupons**:
   ```bash
   curl http://localhost:3001/api/coupons?q=chips
   ```
   Should return coupons matching "chips".

## What You Have Now

✅ **40 Coupons** (10 per store: Safeway, Nob Hill, Food Maxx, Lucky)
✅ **5 Categories** (Snacks, Beverages, Household, Produce, Other)
✅ **Brand Names** prominently displayed on all coupons
✅ **QR Codes** generated for each coupon
✅ **API Endpoints** for all CRUD operations
✅ **Frontend Integration** with API fallback

## Troubleshooting

### MongoDB Connection Issues
- **Local MongoDB**: Check if `mongod` is running: `pgrep mongod`
- **Atlas**: Verify connection string is correct in `.env`
- **Network**: Check firewall settings for MongoDB port (27017)

### Port Already in Use
- **Backend (3001)**: Change PORT in `server/.env`
- **Frontend (5173)**: Already cleared, should work now

### API Not Responding
- Check if backend is running: `curl http://localhost:3001/health`
- Check browser console for CORS errors
- Verify `.env` file exists in `server/` directory

### Dependencies Missing
```bash
cd server
npm install
```

## Next: Production Deployment

Once local setup works:
1. Deploy backend to Vercel/Heroku/Railway
2. Deploy frontend to Vercel/Netlify
3. Update frontend `.env` with production API URL
4. Set up daily coupon refresh cron job

See `BACKEND_SETUP.md` for detailed deployment instructions.

