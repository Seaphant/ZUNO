# Coupon Refresh System

## Overview

Zuno now includes a comprehensive coupon refresh system that:
- Fetches product images from store databases
- Refreshes coupons daily at 12AM
- Keeps old coupons until they expire
- Automatically removes expired coupons

## Image System

### How It Works

1. **Image Fetching Priority**:
   - First: Uses `imageUrl` if already fetched from store API
   - Second: Looks up by brand in `PRODUCT_IMAGE_MAP`
   - Third: Falls back to category-based images

2. **Store Integration Ready**:
   - The `fetchProductImageFromStore()` function is structured to easily integrate with store APIs
   - Currently uses a brand-to-image mapping
   - Can be extended to call actual store product databases

### Adding Store API Integration

To integrate with store APIs, update `src/lib/images.ts`:

```typescript
export async function fetchProductImageFromStore(
  coupon: Coupon,
  store: string
): Promise<string> {
  // Example: Safeway API
  if (store === "Safeway") {
    const response = await fetch(
      `https://api.safeway.com/products?brand=${coupon.brand}&title=${coupon.title}`
    );
    const data = await response.json();
    return data.imageUrl;
  }
  
  // Fallback to mapped images
  return getProductImageUrl(coupon);
}
```

## Daily Refresh System

### Configuration

The refresh system is configured in `src/lib/couponRefresh.ts`:

```typescript
export const DEFAULT_REFRESH_CONFIG: CouponRefreshConfig = {
  refreshTime: "00:00", // Midnight
  stores: ["Safeway", "Nob Hill", "Ranch 99", "Food Maxx", "Lucky"],
};
```

### How It Works

1. **Schedule**: Runs daily at 12AM (configurable)
2. **Process**:
   - Keeps existing coupons that haven't expired
   - Fetches new coupons from store APIs
   - Fetches product images for new coupons
   - Combines old and new coupons
   - Removes expired coupons

3. **Coupon Lifecycle**:
   - New coupons are added daily
   - Old coupons remain until expiration date
   - Expired coupons are automatically filtered out

### Implementation Options

#### Option 1: Client-Side (Current)
Currently set up for client-side scheduling. In production, you'd want to use:

#### Option 2: Server-Side Cron Job
```typescript
// server/cron.ts
import { refreshCoupons, DEFAULT_REFRESH_CONFIG } from './lib/couponRefresh';

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  const existingCoupons = await db.getCoupons();
  const refreshed = await refreshCoupons(existingCoupons, DEFAULT_REFRESH_CONFIG);
  await db.saveCoupons(refreshed);
});
```

#### Option 3: Serverless Function (Vercel/Netlify)
```typescript
// api/refresh-coupons.ts
import { refreshCoupons, DEFAULT_REFRESH_CONFIG } from '@/lib/couponRefresh';

export default async function handler(req, res) {
  if (req.method === 'POST' && req.headers['x-cron-secret'] === process.env.CRON_SECRET) {
    const existingCoupons = await getCouponsFromDB();
    const refreshed = await refreshCoupons(existingCoupons, DEFAULT_REFRESH_CONFIG);
    await saveCouponsToDB(refreshed);
    res.json({ success: true, count: refreshed.length });
  }
}
```

Then set up a cron job in Vercel/Netlify to call this endpoint daily at midnight.

## Store API Integration

### Recommended APIs

1. **Safeway**: 
   - Check for public API or web scraping (with permissions)
   - Product catalog APIs

2. **Product Databases**:
   - Open Food Facts API
   - UPCitemdb API
   - Store-specific product APIs

3. **Web Scraping** (with proper permissions):
   - Scrape store websites for current deals
   - Use Puppeteer/Playwright for dynamic content

### Implementation Steps

1. **Create Store API Clients**:
   ```typescript
   // src/lib/storeApis/safeway.ts
   export async function fetchSafewayCoupons(): Promise<Coupon[]> {
     // Implement Safeway API calls
   }
   ```

2. **Update Refresh Function**:
   ```typescript
   // In couponRefresh.ts
   import { fetchSafewayCoupons } from './storeApis/safeway';
   
   export async function fetchNewCouponsFromStores(stores: string[]) {
     const allCoupons: Coupon[] = [];
     
     for (const store of stores) {
       if (store === "Safeway") {
         const coupons = await fetchSafewayCoupons();
         allCoupons.push(...coupons);
       }
       // Add other stores...
     }
     
     return allCoupons;
   }
   ```

## Testing

To test the refresh system locally:

```typescript
import { refreshCoupons, DEFAULT_REFRESH_CONFIG } from './lib/couponRefresh';

const existingCoupons = []; // Your current coupons
const refreshed = await refreshCoupons(existingCoupons, DEFAULT_REFRESH_CONFIG);
console.log('Refreshed coupons:', refreshed);
```

## Next Steps

1. **Set up backend API** for coupon storage
2. **Integrate store APIs** for real coupon data
3. **Set up cron job** or serverless function for daily refresh
4. **Add database** to persist coupons between refreshes
5. **Implement image caching** for better performance

