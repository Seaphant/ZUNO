/**
 * NEW Product Image Service
 * Uses product data APIs for accurate grocery item images with brand names
 * 
 * Priority:
 * 1. Open Food Facts API (free, open source)
 * 2. UPCitemdb API (free tier)
 * 3. Brand-based fallback mapping
 */

import dotenv from 'dotenv';
dotenv.config();

// API Configuration
const UPCITEMDB_API_KEY = process.env.UPCITEMDB_API_KEY || 'demo'; // Free tier works with 'demo'
const OPEN_FOOD_FACTS_BASE = 'https://world.openfoodfacts.org/api/v2';

/**
 * Search Open Food Facts API for product images
 * Free, open source database with product information
 * 
 * @param {string} brand - Product brand
 * @param {string} productName - Product name/title
 * @returns {Promise<string|null>} Image URL or null
 */
async function searchOpenFoodFacts(brand, productName) {
  try {
    // Clean product name for search
    const cleanProductName = productName
      .toLowerCase()
      .replace(/\$[\d.]+ off /gi, '')
      .replace(/\d+% off /gi, '')
      .replace(/bogo /gi, '')
      .replace(/buy 1 get 1 /gi, '')
      .replace(/pack/gi, '')
      .replace(/12-pack/gi, '')
      .replace(/family size/gi, '')
      .replace(/fresh /gi, '')
      .replace(/organic /gi, '')
      .trim();
    
    // Build specific search terms - prioritize brand-specific searches
    const searchTerms = [
      `brand:${brand} ${cleanProductName}`,  // Brand-specific search
      `brand:${brand}`,  // Just brand search
      `${brand} ${cleanProductName}`,  // Brand + product
      brand,  // Just brand
    ];
    
    const searchBrand = brand.toLowerCase().trim();
    
    for (const searchTerm of searchTerms) {
      try {
        // Use more specific search with brand filter
        const searchUrl = `${OPEN_FOOD_FACTS_BASE}/search?search_terms=${encodeURIComponent(searchTerm)}&page_size=5&fields=image_url,product_name,brands,image_front_url,barcode`;
        
        const response = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'Zuno-Coupon-App/1.0 (contact@zuno.com)'
          }
        });
        
        if (!response.ok) {
          continue;
        }
        
        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
          // Find best match by brand - be more strict
          for (const product of data.products) {
            const productBrands = (product.brands || '').toLowerCase();
            const productName = (product.product_name || '').toLowerCase();
            
            // More strict brand matching
            const brandWords = searchBrand.split(/\s+/);
            const brandMatch = brandWords.every(word => 
              productBrands.includes(word) || productName.includes(word)
            ) || productBrands.includes(searchBrand);
            
            if (brandMatch) {
              // Prefer front image, fallback to regular image
              const imageUrl = product.image_front_url || product.image_url;
              if (imageUrl && imageUrl.startsWith('http') && !imageUrl.includes('placeholder')) {
                // Verify it's a different product (check barcode or URL uniqueness)
                return imageUrl;
              }
            }
          }
          
          // If no exact brand match, check if first product is at least relevant
          const firstProduct = data.products[0];
          const firstBrands = (firstProduct.brands || '').toLowerCase();
          
          // Only use if brand is somewhat related
          if (firstBrands.includes(searchBrand) || searchBrand.includes(firstBrands.split(',')[0])) {
            const imageUrl = firstProduct.image_front_url || firstProduct.image_url;
            if (imageUrl && imageUrl.startsWith('http') && !imageUrl.includes('placeholder')) {
              return imageUrl;
            }
          }
        }
      } catch (err) {
        // Continue to next search term
        continue;
      }
    }
    
    return null;
  } catch (error) {
    // Silent fail - will use fallback
    return null;
  }
}

/**
 * Search UPCitemdb API for product images
 * Free tier available, good for UPC/barcode lookups
 * 
 * @param {string} brand - Product brand
 * @param {string} productName - Product name
 * @returns {Promise<string|null>} Image URL or null
 */
async function searchUPCitemdb(brand, productName) {
  try {
    // Try to extract or construct a search query
    const searchQuery = `${brand} ${productName}`
      .toLowerCase()
      .replace(/\$[\d.]+ off /gi, '')
      .replace(/\d+% off /gi, '')
      .replace(/bogo /gi, '')
      .trim();
    
    // UPCitemdb search endpoint (free tier)
    const searchUrl = `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(searchQuery)}`;
    
    // Note: This is a simplified approach. In production, you'd want to use actual UPC codes
    // For now, we'll use the brand + product name approach
    // Real implementation would require UPC codes from the product database
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0 && data.items[0].images && data.items[0].images.length > 0) {
      return data.items[0].images[0];
    }
    
    return null;
  } catch (error) {
    console.error('UPCitemdb API error:', error.message);
    return null;
  }
}

/**
 * Get product image from Google Shopping API
 * Requires API key but provides high-quality product images
 * 
 * @param {string} brand - Product brand
 * @param {string} productName - Product name
 * @returns {Promise<string|null>} Image URL or null
 */
async function searchGoogleShopping(brand, productName) {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  
  if (!GOOGLE_API_KEY) {
    return null;
  }
  
  try {
    const searchQuery = `${brand} ${productName} grocery product`.trim();
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=1&safe=active&imgSize=medium&imgType=product`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    }
    
    return null;
  } catch (error) {
    console.error('Google Shopping API error:', error.message);
    return null;
  }
}

// Import product image database
import { getProductImage } from './productImageDatabase.js';

/**
 * Category-based fallback images
 */
const CATEGORY_IMAGE_MAP = {
  "Snacks": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop",
  "Beverages": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop",
  "Household": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop",
  "Produce": "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=400&fit=crop",
  "Other": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop"
};

/**
 * Get brand-based fallback image using product image database
 */
function getBrandFallbackImage(brand, category, title) {
  // Use the product image database which has real product images
  return getProductImage(brand, title, category);
}

/**
 * Main function to fetch product image using multiple APIs
 * Tries APIs in order of reliability and accuracy
 * 
 * @param {string} brand - Product brand name
 * @param {string} title - Product title (includes brand name)
 * @param {string} category - Product category
 * @returns {Promise<string>} Image URL
 */
export async function fetchProductImage(brand, title, category) {
  // Clean the product name from title
  let productName = title
    .replace(/\$[\d.]+ off /gi, '')
    .replace(/\d+% off /gi, '')
    .replace(/bogo /gi, '')
    .replace(/buy 1 get 1 /gi, '')
    .trim();
  
  // Remove brand from product name if it's already there
  if (productName.toLowerCase().includes(brand.toLowerCase())) {
    productName = productName.replace(new RegExp(brand, 'gi'), '').trim();
  }
  
  // Extract key product words (e.g., "Dish Soap", "Toilet Paper", "Chicken")
  const productWords = productName
    .split(/\s+/)
    .filter(word => word.length > 2 && !['off', 'pack', 'size', 'fresh', 'organic'].includes(word.toLowerCase()))
    .slice(0, 3)
    .join(' ');
  
  console.log(`🔍 Searching for: ${brand} | Product: ${productWords || productName}`);
  
  // Try APIs in order of preference
  // 1. Open Food Facts (free, accurate, brand-specific)
  const openFoodFactsImage = await searchOpenFoodFacts(brand, productWords || productName);
  if (openFoodFactsImage && !openFoodFactsImage.includes('611/103/500/0430')) {
    // Avoid the problematic Sidi Ali water product
    console.log(`✅ Found via Open Food Facts: ${openFoodFactsImage.substring(0, 80)}...`);
    return openFoodFactsImage;
  }
  
  // 2. Google Shopping (if API key available)
  const googleImage = await searchGoogleShopping(brand, productWords || productName);
  if (googleImage) {
    console.log(`✅ Found via Google Shopping`);
    return googleImage;
  }
  
  // 3. UPCitemdb (for UPC-based lookups - limited without UPC codes)
  // Skipped for now as it requires UPC codes
  
  // 4. Brand-based fallback (reliable, curated REAL product images)
  const fallbackImage = getBrandFallbackImage(brand, category, title);
  console.log(`✅ Using product image database for ${brand}`);
  return fallbackImage;
}

/**
 * Batch fetch images for multiple products
 * Includes rate limiting to respect API quotas
 * 
 * @param {Array<{brand: string, title: string, category: string}>} products
 * @param {number} delayMs - Delay between requests (ms)
 * @returns {Promise<Array<{brand: string, title: string, imageUrl: string}>>}
 */
export async function batchFetchProductImages(products, delayMs = 200) {
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
      
      // Rate limiting: wait between requests to respect API quotas
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`❌ Error fetching image for ${product.title}:`, error.message);
      // Use fallback on error
      results.push({
        ...product,
        imageUrl: getBrandFallbackImage(product.brand, product.category)
      });
    }
  }
  
  return results;
}

