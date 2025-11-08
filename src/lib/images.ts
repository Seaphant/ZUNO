/**
 * Product image utilities for fetching images from store databases
 * This can be easily extended to integrate with store APIs
 */

import type { Coupon } from "./types";

/**
 * Product image mapping - maps brand/product combinations to image URLs
 * Uses brand + title keywords for better matching
 * In production, this would fetch from store APIs or product databases
 */
const PRODUCT_IMAGE_MAP: Record<string, string> = {
  // Chips & Snacks - Lays
  "Lays": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop&q=80",
  
  // Cereal - Cheerios (fixing the ramen bowl issue)
  "Cheerios": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop&q=80",
  
  // Beverages - Milk
  "Horizon": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&q=80",
  
  // Beverages - Coffee
  "Starbucks": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop&q=80",
  
  // Beverages - Orange Juice
  "Tropicana": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80",
  
  // Beverages - Soda
  "Coca-Cola": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop&q=80",
  
  // Produce - Apples (Gala)
  "Gala": "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=400&fit=crop&q=80",
  
  // Produce - Berries (Driscoll's)
  "Driscoll's": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&q=80",
  
  // Household - Dish Soap
  "Dawn": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&q=80",
  
  // Household - Shampoo
  "Head & Shoulders": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop&q=80",
  
  // Meat & Seafood - Salmon
  "Wild Caught": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop&q=80",
  
  // Meat - Ground Beef
  "Fresh": "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400&h=400&fit=crop&q=80",
  
  // Seafood
  "Daily Catch": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&q=80",
  
  // Eggs
  "Happy Egg": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&q=80",
  
  // Deli Meats
  "Boar's Head": "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&h=400&fit=crop&q=80",
  
  // Rice
  "Royal": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&q=80",
  
  // Generic products
  "House": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80",
  "House Brand": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80",
  "Select": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80",
  "Generic": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&q=80",
  
  // Bakery
  "Fresh Baked": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80",
  
  // Deli/Prepared Foods
  "Deli": "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&h=400&fit=crop&q=80",
};

/**
 * Category-based fallback images
 */
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "Snacks": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop",
  "Beverages": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop",
  "Household": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop",
  "Produce": "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=400&fit=crop",
  "Other": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop",
};

/**
 * Get product image URL for a coupon
 * Priority:
 * 1. Direct imageUrl from coupon (if already fetched from store API)
 * 2. Brand-based lookup in PRODUCT_IMAGE_MAP (exact brand match)
 * 3. Title-based keyword matching for better product identification
 * 4. Category-based fallback
 * 
 * @param coupon - The coupon to get image for
 * @returns Image URL string
 */
export function getProductImageUrl(coupon: Coupon): string {
  // If coupon already has an image URL (from store API), use it
  if (coupon.imageUrl) {
    return coupon.imageUrl;
  }
  
  // Always check title first for better product identification
  // This is especially important for generic brand names like "Fresh" which can apply to multiple product types
  const titleLower = coupon.title.toLowerCase();
  
  // Title-based matching (check most specific first)
  // Seafood/Fish (check before generic "fresh")
  if (titleLower.includes("salmon") || titleLower.includes("seafood") || titleLower.includes("fish")) {
    return "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop&q=80";
  }
  
  // Beef/Meat (check before generic "fresh")
  if (titleLower.includes("beef") || titleLower.includes("ground") || titleLower.includes("chicken") || titleLower.includes("rotisserie")) {
    return "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400&h=400&fit=crop&q=80";
  }
  
  // Vegetables/Produce (for "Fresh" brand with vegetables)
  if (titleLower.includes("vegetable") || titleLower.includes("veggie") || titleLower.includes("chinese vegetable")) {
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80";
  }
  
  // Cereal products
  if (titleLower.includes("cereal")) {
    return "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop&q=80";
  }
  
  // Chips
  if (titleLower.includes("chip")) {
    return "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop&q=80";
  }
  
  // Milk
  if (titleLower.includes("milk")) {
    return "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&q=80";
  }
  
  // Coffee
  if (titleLower.includes("coffee")) {
    return "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop&q=80";
  }
  
  // Juice
  if (titleLower.includes("juice")) {
    return "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80";
  }
  
  // Apples
  if (titleLower.includes("apple")) {
    return "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=400&fit=crop&q=80";
  }
  
  // Berries
  if (titleLower.includes("berr")) {
    return "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&q=80";
  }
  
  // Eggs
  if (titleLower.includes("egg")) {
    return "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&q=80";
  }
  
  // Rice
  if (titleLower.includes("rice")) {
    return "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&q=80";
  }
  
  // Cleaning/Soap
  if (titleLower.includes("soap") || titleLower.includes("cleaning") || titleLower.includes("dish")) {
    return "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&q=80";
  }
  
  // Shampoo
  if (titleLower.includes("shampoo")) {
    return "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop&q=80";
  }
  
  // Bakery
  if (titleLower.includes("bakery") || titleLower.includes("baked")) {
    return "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80";
  }
  
  // Deli
  if (titleLower.includes("deli") || titleLower.includes("prepared")) {
    return "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&h=400&fit=crop&q=80";
  }
  
  // Soda
  if (titleLower.includes("soda") || titleLower.includes("cola")) {
    return "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop&q=80";
  }
  
  // Tofu
  if (titleLower.includes("tofu")) {
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80";
  }
  
  // Canned goods
  if (titleLower.includes("canned")) {
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80";
  }
  
  // Frozen foods
  if (titleLower.includes("frozen")) {
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80";
  }
  
  // Try to find image by exact brand match (for specific brands)
  const brandImage = PRODUCT_IMAGE_MAP[coupon.brand];
  if (brandImage) {
    return brandImage;
  }
  
  // Fall back to category image
  return CATEGORY_FALLBACK_IMAGES[coupon.category] || CATEGORY_FALLBACK_IMAGES["Other"];
}

/**
 * Fetch product image from store API
 * This function can be extended to integrate with actual store APIs
 * 
 * @param coupon - The coupon to fetch image for
 * @param store - Store name
 * @returns Promise resolving to image URL
 */
export async function fetchProductImageFromStore(
  coupon: Coupon,
  _store: string
): Promise<string> {
  // TODO: Integrate with store APIs
  // Example implementations:
  // - Safeway API: https://www.safeway.com/shop/product-details/{productId}
  // - Store product databases
  // - UPC lookup APIs
  // - Open Food Facts API
  
  // For now, return the mapped image
  // In production, this would make an API call:
  // const response = await fetch(`/api/stores/${store}/products?brand=${coupon.brand}&title=${coupon.title}`);
  // const data = await response.json();
  // return data.imageUrl;
  
  return getProductImageUrl(coupon);
}

/**
 * Batch fetch images for multiple coupons
 * Useful when refreshing coupons daily
 */
export async function fetchProductImagesForCoupons(
  coupons: Coupon[],
  store?: string
): Promise<Coupon[]> {
  const images = await Promise.all(
    coupons.map(async (coupon) => {
      if (!coupon.imageUrl) {
        const imageUrl = await fetchProductImageFromStore(
          coupon,
          store || coupon.store
        );
        return { ...coupon, imageUrl };
      }
      return coupon;
    })
  );
  
  return images;
}

