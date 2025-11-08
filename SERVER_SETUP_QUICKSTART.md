# Zuno Backend Quick Start Guide

## What Was Built

✅ **NoSQL Database Schema** (MongoDB)
- `coupons` - Main coupon data with brand names, store info, QR codes
- `couponcategories` - Category definitions (Snacks, Beverages, etc.)
- `couponrestrictions` - Complex coupon rules (future use)
- `usercoupons` - User-coupon relationships (saved/claimed/used)

✅ **Backend API** (Node.js/Express)
- Full CRUD operations for coupons
- User coupon management
- Search and filtering
- Pagination support

✅ **40 Coupons** (10 per store)
- Safeway: 10 coupons
- Nob Hill: 10 coupons  
- Food Maxx: 10 coupons
- Lucky: 10 coupons
- All with prominent brand names displayed

✅ **Frontend Integration**
- API client with fallback to mock data
- Search page connected to API
- Dashboard connected to API
- Home page connected to API

## Quick Setup (5 minutes)

### 1. Install MongoDB
```bash
# macOS
brew install mongodb-community

# Or use MongoDB Atlas (cloud) - free tier available
# https://www.mongodb.com/cloud/atlas
```

### 2. Setup Backend
```bash
cd server
npm install
```

### 3. Configure Environment
```bash
cd server
# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/zuno" > .env
echo "PORT=3001" >> .env
echo "NODE_ENV=development" >> .env
```

### 4. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Or if installed manually
mongod --dbpath /usr/local/var/mongodb
```

### 5. Seed Database
```bash
cd server
npm run seed
```

### 6. Start Backend
```bash
cd server
npm run dev
```

Backend runs on: `http://localhost:3001`

### 7. Start Frontend
```bash
# In root directory
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Test the API

```bash
# Get all coupons
curl http://localhost:3001/api/coupons

# Get Safeway coupons
curl http://localhost:3001/api/coupons?store=Safeway

# Search for chips
curl http://localhost:3001/api/coupons?q=chips

# Get coupons by category
curl http://localhost:3001/api/coupons?category=Snacks
```

## Database Structure

### Coupons Collection
- 40 coupons total
- Each coupon has: title, brand, store, value, type, category, QR code
- Brand names are prominently stored and displayed
- All coupons are active and valid until expiration

### Categories
- Snacks
- Beverages
- Household
- Produce
- Other

## Next Steps

1. **Test the application**: Visit http://localhost:5173
2. **Verify API**: Check http://localhost:3001/api/coupons
3. **Customize**: Add more coupons or modify existing ones
4. **Deploy**: Set up for production (see BACKEND_SETUP.md)

## Troubleshooting

- **MongoDB not running**: Start MongoDB service
- **Port 3001 in use**: Change PORT in server/.env
- **CORS errors**: Backend has CORS enabled (adjust for production)
- **API not responding**: Check if backend is running on port 3001
