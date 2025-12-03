# 🖼️ Image Setup Guide

## Overview
The image system uses Google Custom Search API with automatic fallback to Unsplash. This ensures all products have images even without API keys.

## Quick Setup (For Demo)

### Option 1: Use Unsplash Only (No API Keys Required) ✅
**This is the default and works immediately!**
- No setup needed
- Images will be fetched from Unsplash automatically
- Works for all products

### Option 2: Use Google Custom Search (Better Quality Images)
1. Get Google API Key:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create a new API key
   - Enable "Custom Search API"

2. Create Custom Search Engine:
   - Go to https://programmablesearchengine.google.com/
   - Create a new search engine
   - Set it to search the entire web
   - Copy the Search Engine ID

3. Add to `.env` file in `server/` directory:
```env
GOOGLE_API_KEY=your_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

## Updating Images

### Update All Coupons
```bash
cd server
npm run update-images
```

This will:
- Find all coupons without images
- Fetch images using Google API (if configured) or Unsplash
- Update the database with image URLs
- Show progress and summary

### Update Single Coupon via API
```bash
POST /api/coupons/:id/images
```

### Batch Update via API
```bash
POST /api/coupons/images/batch-update
```

## How It Works

1. **Priority System**:
   - First tries Google Custom Search API (if configured)
   - Falls back to Unsplash Source API (always available)
   - Uses smart search queries: `{brand} {title} product grocery store`

2. **Rate Limiting**:
   - 100ms delay between requests
   - Prevents API quota exhaustion
   - Safe for batch updates

3. **Error Handling**:
   - Continues processing even if one image fails
   - Logs errors for debugging
   - Always provides a fallback image

## Testing

### Test Image Service
```bash
cd server
node -e "
import('./src/services/imageService.js').then(async ({fetchProductImage}) => {
  const url = await fetchProductImage('Lays', 'Chips Family Size', 'Snacks');
  console.log('Image URL:', url);
});
"
```

### Verify Images in Database
```bash
# Check coupons with images
mongo zuno --eval "db.coupons.find({imageUrl: {$exists: true}}).count()"

# Check coupons without images
mongo zuno --eval "db.coupons.find({imageUrl: {$exists: false}}).count()"
```

## Troubleshooting

### Images Not Loading
1. Check backend logs for errors
2. Verify API keys are correct (if using Google)
3. Check network connectivity
4. Run update script: `npm run update-images`

### Google API Quota Exceeded
- System automatically falls back to Unsplash
- No action needed, images will still work

### Slow Image Loading
- Normal for first-time fetch
- Images are cached in database
- Subsequent loads are instant

## For Demo

**Recommended**: Use Unsplash only (no setup needed)
- Fast setup
- Works immediately
- No API limits
- Good quality images

If you have time, add Google API keys for better product-specific images.

