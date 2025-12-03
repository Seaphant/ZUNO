/**
 * Image fetching service for product images
 * Uses Google Custom Search API with fallback to Unsplash
 */

import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

/**
 * Search for product image using Google Custom Search API
 * @param {string} query - Search query (e.g., "Dawn Dish Soap product")
 * @returns {Promise<string|null>} Image URL or null if not found
 */
async function searchGoogleImages(query) {
  if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    console.warn('Google API credentials not configured, using fallback');
    return null;
  }

  try {
    // Query already includes "product grocery store" from fetchProductImage
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=1&safe=active&imgSize=medium`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Google API error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from Google Custom Search:', error.message);
    return null;
  }
}

/**
 * Get product image URL - uses brand-based mapping for reliability
 * Falls back to category-based images
 * @param {string} query - Search query (unused, kept for API compatibility)
 * @param {string} brand - Product brand
 * @param {string} category - Product category
 * @returns {string} Image URL
 */
function getUnsplashImage(query, brand, category) {
  // Brand-based image mapping (same as frontend for consistency)
  const brandImageMap = {
    "Lays": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop&q=80",
    "Cheerios": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop&q=80",
    "Horizon": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&q=80",
    "Starbucks": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop&q=80",
    "Tropicana": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80",
    "Coca-Cola": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop&q=80",
    "Gala": "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=400&fit=crop&q=80",
    "Driscoll's": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&q=80",
    "Dawn": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&q=80",
    "Head & Shoulders": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop&q=80",
    "Wild Caught": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop&q=80",
    "Fresh": "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400&h=400&fit=crop&q=80",
    "Happy Egg": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&q=80",
    "Boar's Head": "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&h=400&fit=crop&q=80",
    "Fresh Baked": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80",
    "Greek Gods": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&q=80",
    "Nature Valley": "https://images.unsplash.com/photo-1606312619070-d48f4eb0e15e?w=400&h=400&fit=crop&q=80",
    "Tide": "https://images.unsplash.com/photo-1625772452859-1c18360b8a0e?w=400&h=400&fit=crop&q=80",
    "DiGiorno": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop&q=80",
    "Charmin": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&q=80",
    "Wonder": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80",
    "Land O'Lakes": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80"
  };
  
  // Category-based fallback
  const categoryImageMap = {
    "Snacks": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop",
    "Beverages": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop",
    "Household": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop",
    "Produce": "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=400&fit=crop",
    "Other": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop"
  };
  
  // Try brand first
  if (brand && brandImageMap[brand]) {
    return brandImageMap[brand];
  }
  
  // Fall back to category
  if (category && categoryImageMap[category]) {
    return categoryImageMap[category];
  }
  
  // Final fallback
  return categoryImageMap["Other"];
}

/**
 * Get product image URL with smart fallback
 * Priority:
 * 1. Google Custom Search API (if configured)
 * 2. Unsplash Source API (always available)
 * 
 * @param {string} brand - Product brand
 * @param {string} title - Product title (should include brand name)
 * @param {string} category - Product category
 * @returns {Promise<string>} Image URL
 */
export async function fetchProductImage(brand, title, category) {
  // Build search query - use title if it already contains brand, otherwise combine
  // Title now includes brand names (e.g., "Dawn Dish Soap Pack")
  let searchQuery = title.trim();
  
  // If title doesn't seem to include brand, add it
  if (!title.toLowerCase().includes(brand.toLowerCase())) {
    searchQuery = `${brand} ${title}`.trim();
  }
  
  // Add "product" and "grocery" for better image results
  searchQuery = `${searchQuery} product grocery store`.trim();
  
  // Try Google Custom Search first (if configured)
  if (GOOGLE_API_KEY && GOOGLE_SEARCH_ENGINE_ID) {
    const googleImage = await searchGoogleImages(searchQuery);
    if (googleImage) {
      return googleImage;
    }
  }
  
  // Fallback to brand/category-based images
  return getUnsplashImage(searchQuery, brand, category);
}

/**
 * Batch fetch images for multiple products
 * Includes rate limiting to avoid API quota issues
 * 
 * @param {Array<{brand: string, title: string, category: string}>} products
 * @param {number} delayMs - Delay between requests in milliseconds
 * @returns {Promise<Array<{brand: string, title: string, imageUrl: string}>>}
 */
export async function batchFetchProductImages(products, delayMs = 100) {
  const results = [];
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    try {
      const imageUrl = await fetchProductImage(
        product.brand,
        product.title,
        product.category
      );
      
      results.push({
        ...product,
        imageUrl
      });
      
      // Rate limiting: wait between requests
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`Error fetching image for ${product.title}:`, error.message);
      // Continue with next product even if one fails
      results.push({
        ...product,
        imageUrl: getUnsplashImage(`${product.brand} ${product.title}`)
      });
    }
  }
  
  return results;
}

