# Backend Setup Instructions

## Prerequisites

1. **MongoDB**: Install MongoDB locally or use MongoDB Atlas (free cloud option)
   - Local: https://www.mongodb.com/try/download/community
   - Atlas: https://www.mongodb.com/cloud/atlas

2. **Node.js**: Ensure Node.js 18+ is installed

## Setup Steps

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` and set your MongoDB connection:

```env
MONGODB_URI=mongodb://localhost:27017/zuno
PORT=3001
NODE_ENV=development
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zuno
```

### 3. Seed the Database

This will create 5 categories and 40 coupons (10 per store):

```bash
cd server
npm run seed
```

### 4. Start the Backend Server

```bash
cd server
npm run dev
```

Server will run on `http://localhost:3001`

### 5. Configure Frontend

Create a `.env` file in the root directory (if it doesn't exist):

```env
VITE_API_URL=http://localhost:3001/api
```

### 6. Start Frontend

```bash
npm run dev
```

## API Endpoints

### Coupons
- `GET /api/coupons` - Get all active coupons
- `GET /api/coupons/:id` - Get specific coupon
- `POST /api/coupons` - Create coupon (admin)
- `PUT /api/coupons/:id` - Update coupon (admin)
- `DELETE /api/coupons/:id` - Deactivate coupon (admin)

### User Coupons
- `GET /api/user-coupons/:userId` - Get user's saved coupons
- `POST /api/user-coupons` - Save a coupon for user
- `PUT /api/user-coupons/:id` - Update user coupon status
- `DELETE /api/user-coupons/:id` - Remove coupon from user

## Database Structure

### Collections

1. **coupons** - Main coupon data
2. **couponcategories** - Category definitions
3. **couponrestrictions** - Coupon restrictions/rules
4. **usercoupons** - User-coupon relationships

### Sample Data

- 5 Categories: Snacks, Beverages, Household, Produce, Other
- 40 Coupons: 10 per store (Safeway, Nob Hill, Food Maxx, Lucky)
- All coupons have brand names prominently displayed
- All coupons include QR codes

## Testing the API

```bash
# Get all coupons
curl http://localhost:3001/api/coupons

# Get Safeway coupons
curl http://localhost:3001/api/coupons?store=Safeway

# Search coupons
curl http://localhost:3001/api/coupons?q=chips&store=Safeway

# Get user's saved coupons
curl http://localhost:3001/api/user-coupons/default-user
```

## Troubleshooting

1. **MongoDB not connecting**: Check if MongoDB is running and connection string is correct
2. **Port already in use**: Change PORT in `.env` file
3. **CORS errors**: Backend has CORS enabled for all origins (adjust for production)
4. **API not responding**: Check if backend server is running on port 3001

