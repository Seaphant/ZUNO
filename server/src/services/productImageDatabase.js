/**
 * Product Image Database
 * Real product images for accurate grocery item display
 * Using high-quality product images from reliable sources
 */

export const PRODUCT_IMAGES = {
  // Snacks
  "Lays": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop&q=80",
  "Cheerios": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop&q=80", // Real cereal box
  "Nature Valley": "https://images.unsplash.com/photo-1606312619070-d48f4eb0e15e?w=400&h=400&fit=crop&q=80",
  
  // Beverages
  "Horizon": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&q=80",
  "Starbucks": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop&q=80",
  "Tropicana": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80",
  "Coca-Cola": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop&q=80",
  
  // Produce
  "Gala": "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=400&fit=crop&q=80",
  "Driscoll's": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&q=80",
  
  // Household
  "Dawn": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&q=80",
  "Head & Shoulders": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop&q=80",
  "Tide": "https://images.unsplash.com/photo-1625772452859-1c18360b8a0e?w=400&h=400&fit=crop&q=80",
  "Charmin": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&q=80",
  
  // Meat & Seafood - FRESH (not cooked) - Raw salmon fillet
  "Wild Caught": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&q=80", // Fresh raw salmon fillet
  
  // Fresh Products - need specific images based on product type
  "Fresh": {
    "default": "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400&h=400&fit=crop&q=80", // Fresh meat
    "chicken": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80", // Fresh rotisserie chicken
    "rotisserie": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&q=80", // Fresh rotisserie chicken
    "beef": "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400&h=400&fit=crop&q=80", // Fresh ground beef
    "ground beef": "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400&h=400&fit=crop&q=80", // Fresh ground beef
    "bananas": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&q=80", // Fresh bananas
    "spinach": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&q=80", // Fresh spinach
  },
  
  // Dairy & Deli
  "Happy Egg": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&q=80",
  "Boar's Head": "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&h=400&fit=crop&q=80",
  "Greek Gods": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&q=80",
  "Land O'Lakes": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80",
  
  // Bakery
  "Fresh Baked": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80",
  "Wonder": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80",
  
  // Frozen
  "DiGiorno": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop&q=80",
  
  // Generic/House Brands
  "House Brand": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80",
  "Select": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80",
  "Generic": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80",
  "Deli": "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&h=400&fit=crop&q=80"
};

/**
 * Get product-specific image for "Fresh" brand products
 */
export function getFreshProductImage(title) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('rotisserie') || titleLower.includes('chicken')) {
    return PRODUCT_IMAGES["Fresh"]["chicken"];
  }
  if (titleLower.includes('beef') || titleLower.includes('ground')) {
    return PRODUCT_IMAGES["Fresh"]["beef"];
  }
  if (titleLower.includes('banana')) {
    return PRODUCT_IMAGES["Fresh"]["bananas"];
  }
  if (titleLower.includes('spinach')) {
    return PRODUCT_IMAGES["Fresh"]["spinach"];
  }
  
  return PRODUCT_IMAGES["Fresh"]["default"];
}

/**
 * Get product image URL
 */
export function getProductImage(brand, title, category) {
  // Special handling for "Fresh" brand - needs product-specific images
  if (brand === "Fresh") {
    return getFreshProductImage(title);
  }
  
  // Direct brand lookup
  if (PRODUCT_IMAGES[brand]) {
    // Check if it's an object (like Fresh) or direct URL
    if (typeof PRODUCT_IMAGES[brand] === 'string') {
      return PRODUCT_IMAGES[brand];
    }
  }
  
  // Category fallback
  const categoryImages = {
    "Snacks": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop",
    "Beverages": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop",
    "Household": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop",
    "Produce": "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=400&fit=crop",
    "Other": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop"
  };
  
  return categoryImages[category] || categoryImages["Other"];
}

