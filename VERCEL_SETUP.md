# Vercel Setup - Quick Steps

## ✅ Backend is Deployed!

Your backend is now live at:
**https://server-clymhiztd-seaphants-projects.vercel.app**

## Next Steps

### 1. Add MongoDB Connection (Required)

You need to add your MongoDB Atlas connection string:

**Option A: Via Vercel Dashboard (Easiest)**
1. Go to: https://vercel.com/seaphants-projects/server/settings/environment-variables
2. Click "Add New"
3. Key: `MONGODB_URI`
4. Value: Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/zuno?retryWrites=true&w=majority`
5. Environment: Select "Production", "Preview", and "Development"
6. Click "Save"

**Option B: Via CLI**
```bash
cd server
vercel env add MONGODB_URI production
# Paste your MongoDB Atlas connection string
```

### 2. Redeploy Backend (After Adding MongoDB)

```bash
cd server
vercel --prod
```

### 3. Seed Production Database

```bash
cd server
# Update .env with your MongoDB Atlas connection
echo "MONGODB_URI=your-mongodb-atlas-connection-string" > .env
npm run seed
```

### 4. Deploy Frontend

```bash
# From root directory
cd /Users/williamnguyen10/zuno-ui
vercel --yes
```

When prompted for environment variables, add:
- `VITE_API_URL`: `https://server-clymhiztd-seaphants-projects.vercel.app/api`

### 5. Get Your Live URLs

After deployment:
- **Backend**: https://server-clymhiztd-seaphants-projects.vercel.app/api
- **Frontend**: (will be shown after frontend deployment)

## Test Your Deployment

```bash
# Test backend health
curl https://server-clymhiztd-seaphants-projects.vercel.app/health

# Test API
curl https://server-clymhiztd-seaphants-projects.vercel.app/api/coupons
```

## Need MongoDB Atlas?

If you don't have MongoDB Atlas yet:

1. **Sign up**: https://www.mongodb.com/cloud/atlas (Free)
2. **Create Cluster**: Choose "FREE" tier
3. **Create User**: Database Access → Add User
4. **Whitelist IP**: Network Access → Allow from Anywhere
5. **Get Connection String**: Database → Connect → Connect your application
6. **Copy connection string** and use it above

## Done!

Once frontend is deployed, you'll have a live URL that works 24/7!

