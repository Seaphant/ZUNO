# ⚡ Quick Test Guide - Pre-Demo Checklist

## Step 1: Backend Setup (5 min)

### 1.1 Start Backend Server
```bash
cd server
npm install  # if not already done
npm start
```

**Expected**: Server running on http://localhost:3001
**Check**: Visit http://localhost:3001/health - should return `{"status":"ok"}`

### 1.2 Seed Database (if needed)
```bash
cd server
npm run seed
```

**Expected**: 40 coupons created (10 per store)

### 1.3 Update Images
```bash
cd server
npm run update-images
```

**Expected**: All coupons get image URLs
**Time**: ~1-2 minutes (with rate limiting)

## Step 2: Frontend Setup (2 min)

### 2.1 Start Frontend
```bash
# From project root
npm install  # if not already done
npm run dev
```

**Expected**: Frontend running on http://localhost:5173

### 2.2 Verify API Connection
- Open browser console
- Check for API errors
- Verify coupons are loading

## Step 3: Quick Verification Tests

### 3.1 Test API Endpoints
```bash
# Test health
curl http://localhost:3001/health

# Test coupons
curl http://localhost:3001/api/coupons

# Test with filters
curl "http://localhost:3001/api/coupons?store=Safeway&limit=5"
```

### 3.2 Test Frontend
- [ ] Home page loads
- [ ] Trending coupons display
- [ ] Images show for all coupons
- [ ] Search page works
- [ ] Filters work
- [ ] QR codes generate
- [ ] No console errors

### 3.3 Test Image System
- [ ] All coupon cards have images
- [ ] Images load (not broken)
- [ ] Fallback emoji shows if image fails

## Step 4: Common Issues & Fixes

### Backend won't start
```bash
# Check MongoDB is running
# Check port 3001 is available
# Check .env file exists
```

### No images showing
```bash
# Run image update script
cd server && npm run update-images

# Or use API endpoint
curl -X POST http://localhost:3001/api/coupons/images/batch-update
```

### Frontend can't connect to backend
```bash
# Check backend is running
# Check CORS is enabled
# Check VITE_API_URL in frontend .env
```

### Database connection error
```bash
# Check MONGODB_URI in server/.env
# Verify MongoDB is running
# Check connection string format
```

## Step 5: Demo-Ready Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Database seeded with coupons
- [ ] All coupons have images
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] QR codes generate
- [ ] No console errors
- [ ] Mobile responsive (test on phone if possible)

## Emergency Commands

### Reset Everything
```bash
# Stop all servers
# Clear database
cd server
npm run seed  # Reseeds database

# Update images
npm run update-images

# Restart servers
```

### Quick Image Update (API)
```bash
curl -X POST http://localhost:3001/api/coupons/images/batch-update
```

### Check Coupon Count
```bash
curl http://localhost:3001/api/coupons | jq '.pagination.total'
```

---

**Time Estimate**: 10-15 minutes for full setup
**Critical Path**: Backend → Database → Images → Frontend

