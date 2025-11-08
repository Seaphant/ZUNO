# Zuno API Backend

Backend API for Zuno coupon application with MongoDB database.

## Setup

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Setup MongoDB**
   - Install MongoDB locally or use MongoDB Atlas (cloud)
   - Create a `.env` file from `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Update `MONGODB_URI` in `.env`:
     ```
     MONGODB_URI=mongodb://localhost:27017/zuno
     ```

3. **Seed Database**
   ```bash
   npm run seed
   ```
   This will create:
   - 5 categories (Snacks, Beverages, Household, Produce, Other)
   - 40 coupons (10 per store: Safeway, Nob Hill, Food Maxx, Lucky)

4. **Start Server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3001`

## API Endpoints

### Coupons

- `GET /api/coupons` - Get all active coupons
  - Query params: `store`, `category`, `brand`, `q` (search), `sort`, `limit`, `page`
  - Example: `/api/coupons?store=Safeway&category=Snacks&sort=value&limit=10`

- `GET /api/coupons/:id` - Get specific coupon by ID

- `POST /api/coupons` - Create new coupon

- `PUT /api/coupons/:id` - Update coupon

- `DELETE /api/coupons/:id` - Deactivate coupon

### User Coupons

- `GET /api/user-coupons/:userId` - Get user's saved/claimed coupons

- `POST /api/user-coupons` - Save/claim a coupon for user

- `PUT /api/user-coupons/:id` - Update user coupon status (e.g., mark as used)

- `DELETE /api/user-coupons/:id` - Remove coupon from user's list

## Database Schema

### Coupons
- Basic info: title, brand, description
- Store: store name, location (address, coordinates)
- Value: value, type (Amount/Percent/BOGO), percentOff
- Category: reference to CouponCategory
- Dates: createdAt, expiresAt
- Status: isActive
- Images: imageUrl
- QR Code: qrCode
- Restrictions: array of CouponRestriction references
- Usage: usageCount, maxUsage

### CouponCategory
- name, description, icon, color, isActive

### CouponRestriction
- type (minPurchaseAmount, productSpecific, etc.)
- value (varies by type)
- description, isActive

### UserCoupon
- userId, couponId
- status (claimed, saved, used, expired)
- dates: claimedAt, usedAt, expiredAt
- transactionId, storeLocation, notes

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/zuno
PORT=3001
NODE_ENV=development
```

