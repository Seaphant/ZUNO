import type { Coupon } from "./types";
import { getProductImageUrl } from "./images";

export const STORES = ["Safeway", "Nob Hill", "Ranch 99", "Food Maxx", "Lucky", "All"];
export const CATEGORIES = ["Snacks","Beverages","Household","Produce","Other"];

// Store locations in South San Jose
export const STORE_LOCATIONS: Record<string, { address: string; city: string; zipCode: string; lat: number; lng: number }> = {
  "Safeway": { address: "1555 Branham Ln", city: "San Jose", zipCode: "95118", lat: 37.2565, lng: -121.8875 },
  "Nob Hill": { address: "1600 Kooser Rd", city: "San Jose", zipCode: "95118", lat: 37.2583, lng: -121.8892 },
  "Ranch 99": { address: "1688 Hostetter Rd", city: "San Jose", zipCode: "95131", lat: 37.3889, lng: -121.8722 },
  "Food Maxx": { address: "1818 W Capitol Expy", city: "San Jose", zipCode: "95121", lat: 37.3089, lng: -121.8167 },
  "Lucky": { address: "1505 S Bascom Ave", city: "San Jose", zipCode: "95128", lat: 37.2967, lng: -121.9367 },
};

// South San Jose center coordinates for radius calculation
export const SOUTH_SAN_JOSE_CENTER = { lat: 37.2565, lng: -121.8875 };
export const MAX_RADIUS_MILES = 10; // 10 mile radius for South San Jose

/**
 * Helper to generate QR code data for a coupon
 */
function generateQRCode(coupon: Coupon): string {
  const storeInfo = STORE_LOCATIONS[coupon.store];
  const location = storeInfo ? `${storeInfo.address}, ${storeInfo.city}, CA ${storeInfo.zipCode}` : coupon.store;
  return JSON.stringify({
    id: coupon.id,
    title: coupon.title,
    store: coupon.store,
    location: location,
    value: coupon.value,
    type: coupon.type,
    percentOff: coupon.percentOff,
    expiresAt: coupon.expiresAt,
    redeemedAt: new Date().toISOString()
  });
}

/**
 * Check if a coupon has expired
 */
export function isCouponExpired(coupon: Coupon): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiryDate = new Date(coupon.expiresAt);
  expiryDate.setHours(23, 59, 59, 999);
  return today > expiryDate;
}

/**
 * Filter out expired coupons
 */
export function filterActiveCoupons(coupons: Coupon[]): Coupon[] {
  return coupons.filter(coupon => !isCouponExpired(coupon));
}

/**
 * Helper to create coupon with all necessary fields
 */
function createCoupon(data: Omit<Coupon, "qrCode" | "imageUrl" | "createdAt">): Coupon {
  const coupon: Coupon = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  coupon.qrCode = generateQRCode(coupon);
  coupon.imageUrl = getProductImageUrl(coupon);
  return coupon;
}

// Raw coupon data (before processing)
const COUPONS_RAW: Array<Omit<Coupon, "qrCode" | "imageUrl" | "createdAt">> = [
  // Safeway coupons
  { id:"c1", title:"$2 off Chips Family Size", brand:"Lays", store:"Safeway",
    value:2, type:"Amount", expiresAt:"2025-12-31", category:"Snacks", storeLocation:"1555 Branham Ln, San Jose, CA 95118" },
  { id:"c5", title:"Buy 1 Get 1 Apples", brand:"Gala", store:"Safeway",
    value:0, type:"BOGO", expiresAt:"2025-11-25", category:"Produce", storeLocation:"1555 Branham Ln, San Jose, CA 95118" },
  { id:"c7", title:"20% off Organic Milk", brand:"Horizon", store:"Safeway",
    value:0, type:"Percent", percentOff:20, expiresAt:"2025-12-05", category:"Beverages", storeLocation:"1555 Branham Ln, San Jose, CA 95118" },
  { id:"c10", title:"25% off Fresh Berries", brand:"Driscoll's", store:"Safeway",
    value:0, type:"Percent", percentOff:25, expiresAt:"2025-11-28", category:"Produce", storeLocation:"1555 Branham Ln, San Jose, CA 95118" },
  { id:"c13", title:"$6 off Coffee", brand:"Starbucks", store:"Safeway",
    value:6, type:"Amount", expiresAt:"2025-12-25", category:"Beverages", storeLocation:"1555 Branham Ln, San Jose, CA 95118" },
  { id:"c15", title:"$2.50 off Cereal", brand:"Cheerios", store:"Safeway",
    value:2.5, type:"Amount", expiresAt:"2025-12-12", category:"Snacks", storeLocation:"1555 Branham Ln, San Jose, CA 95118" },
  { id:"c18", title:"15% off Orange Juice", brand:"Tropicana", store:"Safeway",
    value:0, type:"Percent", percentOff:15, expiresAt:"2025-12-03", category:"Beverages", storeLocation:"1555 Branham Ln, San Jose, CA 95118" },
  { id:"c21", title:"$7 off Dish Soap Pack", brand:"Dawn", store:"Safeway",
    value:7, type:"Amount", expiresAt:"2025-12-22", category:"Household", storeLocation:"1555 Branham Ln, San Jose, CA 95118" },
  { id:"c24", title:"BOGO Shampoo", brand:"Head & Shoulders", store:"Safeway",
    value:0, type:"BOGO", expiresAt:"2025-12-16", category:"Household", storeLocation:"1555 Branham Ln, San Jose, CA 95118" },
  
  // Nob Hill coupons
  { id:"c25", title:"$3 off Fresh Salmon", brand:"Wild Caught", store:"Nob Hill",
    value:3, type:"Amount", expiresAt:"2025-12-10", category:"Other", storeLocation:"1600 Kooser Rd, San Jose, CA 95118" },
  { id:"c26", title:"BOGO Organic Eggs", brand:"Happy Egg", store:"Nob Hill",
    value:0, type:"BOGO", expiresAt:"2025-12-05", category:"Other", storeLocation:"1600 Kooser Rd, San Jose, CA 95118" },
  { id:"c27", title:"20% off Wine Selection", brand:"House Brand", store:"Nob Hill",
    value:0, type:"Percent", percentOff:20, expiresAt:"2025-12-20", category:"Beverages", storeLocation:"1600 Kooser Rd, San Jose, CA 95118" },
  { id:"c28", title:"$4 off Deli Meats", brand:"Boar's Head", store:"Nob Hill",
    value:4, type:"Amount", expiresAt:"2025-12-08", category:"Other", storeLocation:"1600 Kooser Rd, San Jose, CA 95118" },
  
  // Ranch 99 coupons
  { id:"c29", title:"$2 off Jasmine Rice 5lb", brand:"Royal", store:"Ranch 99",
    value:2, type:"Amount", expiresAt:"2025-12-15", category:"Other", storeLocation:"1688 Hostetter Rd, San Jose, CA 95131" },
  { id:"c30", title:"BOGO Tofu", brand:"House", store:"Ranch 99",
    value:0, type:"BOGO", expiresAt:"2025-12-01", category:"Other", storeLocation:"1688 Hostetter Rd, San Jose, CA 95131" },
  { id:"c31", title:"15% off Fresh Seafood", brand:"Daily Catch", store:"Ranch 99",
    value:0, type:"Percent", percentOff:15, expiresAt:"2025-11-30", category:"Other", storeLocation:"1688 Hostetter Rd, San Jose, CA 95131" },
  { id:"c32", title:"$5 off Chinese Vegetables", brand:"Fresh", store:"Ranch 99",
    value:5, type:"Amount", expiresAt:"2025-12-12", category:"Produce", storeLocation:"1688 Hostetter Rd, San Jose, CA 95131" },
  
  // Food Maxx coupons
  { id:"c33", title:"$3 off Ground Beef 1lb", brand:"Fresh", store:"Food Maxx",
    value:3, type:"Amount", expiresAt:"2025-12-10", category:"Other", storeLocation:"1818 W Capitol Expy, San Jose, CA 95121" },
  { id:"c34", title:"BOGO Canned Goods", brand:"House Brand", store:"Food Maxx",
    value:0, type:"BOGO", expiresAt:"2025-12-18", category:"Other", storeLocation:"1818 W Capitol Expy, San Jose, CA 95121" },
  { id:"c35", title:"25% off Frozen Foods", brand:"Select", store:"Food Maxx",
    value:0, type:"Percent", percentOff:25, expiresAt:"2025-12-05", category:"Snacks", storeLocation:"1818 W Capitol Expy, San Jose, CA 95121" },
  { id:"c36", title:"$4 off Cleaning Supplies", brand:"Generic", store:"Food Maxx",
    value:4, type:"Amount", expiresAt:"2025-12-14", category:"Household", storeLocation:"1818 W Capitol Expy, San Jose, CA 95121" },
  
  // Lucky coupons
  { id:"c37", title:"$2.50 off Rotisserie Chicken", brand:"Fresh", store:"Lucky",
    value:2.5, type:"Amount", expiresAt:"2025-12-07", category:"Other", storeLocation:"1505 S Bascom Ave, San Jose, CA 95128" },
  { id:"c38", title:"BOGO Bakery Items", brand:"Fresh Baked", store:"Lucky",
    value:0, type:"BOGO", expiresAt:"2025-12-03", category:"Other", storeLocation:"1505 S Bascom Ave, San Jose, CA 95128" },
  { id:"c39", title:"20% off Prepared Foods", brand:"Deli", store:"Lucky",
    value:0, type:"Percent", percentOff:20, expiresAt:"2025-12-11", category:"Other", storeLocation:"1505 S Bascom Ave, San Jose, CA 95128" },
  { id:"c40", title:"$3 off Soda 12-pack", brand:"Coca-Cola", store:"Lucky",
    value:3, type:"Amount", expiresAt:"2025-12-20", category:"Beverages", storeLocation:"1505 S Bascom Ave, San Jose, CA 95128" },
];

// Process coupons: add QR codes, images, and creation dates, then filter expired ones
export const COUPONS: Coupon[] = COUPONS_RAW
  .map(coupon => createCoupon(coupon))
  .filter(coupon => !isCouponExpired(coupon));

export interface SearchCouponsParams {
  q?: string;
  store?: string;
  category?: string;
  sort?: "value" | "latest" | "popular";
}

export async function searchCoupons(params: SearchCouponsParams): Promise<Coupon[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Always filter out expired coupons when searching
  let data = filterActiveCoupons([...COUPONS]);

  // Filter by search query
  if (params.q) {
    const query = params.q.toLowerCase().trim();
    data = data.filter(c => 
      c.title.toLowerCase().includes(query) || 
      c.brand.toLowerCase().includes(query)
    );
  }
  
  // Filter by store
  if (params.store && params.store !== "All") {
    data = data.filter(c => c.store === params.store);
  }
  
  // Filter by category
  if (params.category && params.category !== "All") {
    data = data.filter(c => c.category === params.category);
  }
  
  // Sort results
  if (params.sort === "value") {
    data.sort((a, b) => (b.value || 0) - (a.value || 0));
  } else if (params.sort === "latest") {
    data.sort((a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime());
  } else if (params.sort === "popular") {
    // Sort by title alphabetically as placeholder for popularity
    data.sort((a, b) => a.title.localeCompare(b.title));
  }
  
  return data;
}
