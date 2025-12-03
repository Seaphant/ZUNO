# MongoDB Atlas Connection String Setup

## Your Connection String (from MongoDB Atlas)

From your MongoDB Atlas screen, I can see:
```
mongodb+srv://wdnguyen10_db_user:<db_password>@cluster0.uetkdqx.mongodb.net/?appName=Cluster0
```

## Steps to Get Your Complete Connection String

### 1. Get Your Password

You need the password for the user `wdnguyen10_db_user`. 

**If you forgot the password:**
1. Go to MongoDB Atlas Dashboard
2. Click "Database Access" (left sidebar)
3. Find user `wdnguyen10_db_user`
4. Click "Edit" or "Reset Password"
5. Generate a new password (SAVE IT!)

### 2. Format Your Connection String

Replace `<db_password>` with your actual password and add the database name:

**Format:**
```
mongodb+srv://wdnguyen10_db_user:YOUR_PASSWORD@cluster0.uetkdqx.mongodb.net/zuno?retryWrites=true&w=majority
```

**Example** (if your password is `MyPassword123`):
```
mongodb+srv://wdnguyen10_db_user:MyPassword123@cluster0.uetkdqx.mongodb.net/zuno?retryWrites=true&w=majority
```

### 3. Add to Vercel

**Option A: Via Vercel Dashboard (Easiest)**
1. Go to: https://vercel.com/seaphants-projects/server/settings/environment-variables
2. Click "Add New"
3. Key: `MONGODB_URI`
4. Value: Paste your complete connection string (with password and /zuno)
5. Environments: Select all (Production, Preview, Development)
6. Click "Save"

**Option B: Via CLI**
```bash
cd server
vercel env add MONGODB_URI production
# When prompted, paste your complete connection string
```

### 4. Verify Network Access

Make sure MongoDB Atlas allows connections:
1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" (left sidebar)
3. Make sure there's an entry allowing access
4. If not, click "Add IP Address" → "Allow Access from Anywhere"

### 5. Test Connection

After adding to Vercel, redeploy:
```bash
cd server
vercel --prod
```

Then test:
```bash
curl https://server-clymhiztd-seaphants-projects.vercel.app/health
```

## Quick Copy-Paste Template

Once you have your password, use this format:

```
mongodb+srv://wdnguyen10_db_user:YOUR_PASSWORD_HERE@cluster0.uetkdqx.mongodb.net/zuno?retryWrites=true&w=majority
```

Just replace `YOUR_PASSWORD_HERE` with your actual password!

