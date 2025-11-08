/**
 * Daily coupon refresh system
 * This handles refreshing coupons at 12AM daily, fetching images from stores,
 * and managing coupon lifecycle (keeping until expiration, then removing)
 */

import type { Coupon } from "./types";
import { fetchProductImagesForCoupons } from "./images";
import { filterActiveCoupons } from "./mock";

/**
 * Configuration for coupon refresh
 */
export interface CouponRefreshConfig {
  refreshTime: string; // Time in "HH:MM" format (e.g., "00:00" for midnight)
  stores: string[]; // List of stores to fetch coupons from
}

/**
 * Fetch new coupons from store APIs
 * TODO: Replace with actual store API integrations
 * 
 * @param stores - List of store names to fetch from
 * @returns Promise resolving to new coupons
 */
export async function fetchNewCouponsFromStores(stores: string[]): Promise<Coupon[]> {
  // TODO: Integrate with store APIs
  // Example implementations:
  // - Safeway API: https://www.safeway.com/abs/pub/xapi/offers/...
  // - Store product databases
  // - Web scraping (with proper permissions)
  // - Partner APIs
  
  // For now, return empty array (will be populated by store APIs)
  // In production, this would:
  // 1. Call each store's API
  // 2. Parse coupon data
  // 3. Fetch product images from store databases
  // 4. Return formatted coupons
  
  console.log(`Fetching new coupons from stores: ${stores.join(", ")}`);
  
  // Placeholder: In production, implement actual API calls
  return [];
}

/**
 * Refresh coupons: fetch new ones and update images
 * 
 * @param existingCoupons - Current coupons in the system
 * @param config - Refresh configuration
 * @returns Promise resolving to updated coupons
 */
export async function refreshCoupons(
  existingCoupons: Coupon[],
  config: CouponRefreshConfig
): Promise<Coupon[]> {
  console.log("Starting coupon refresh...");
  
  // 1. Keep existing coupons that haven't expired (they stay until expiration)
  const activeCoupons = filterActiveCoupons(existingCoupons);
  
  // 2. Fetch new coupons from stores
  const newCoupons = await fetchNewCouponsFromStores(config.stores);
  
  // 3. Fetch product images for new coupons from store databases
  const newCouponsWithImages = await fetchProductImagesForCoupons(newCoupons);
  
  // 4. Combine: keep active old coupons + add new coupons
  // Remove duplicates based on ID (in case a coupon was refreshed)
  const couponMap = new Map<string, Coupon>();
  
  // Add existing active coupons first
  activeCoupons.forEach(coupon => {
    couponMap.set(coupon.id, coupon);
  });
  
  // Add/update with new coupons (newer ones replace older ones with same ID)
  newCouponsWithImages.forEach(coupon => {
    couponMap.set(coupon.id, coupon);
  });
  
  const refreshedCoupons = Array.from(couponMap.values());
  
  console.log(`Coupon refresh complete: ${refreshedCoupons.length} active coupons`);
  console.log(`  - Kept ${activeCoupons.length} existing active coupons`);
  console.log(`  - Added ${newCoupons.length} new coupons`);
  
  return refreshedCoupons;
}

/**
 * Schedule daily coupon refresh at specified time
 * This can be used with cron jobs, scheduled tasks, or serverless functions
 * 
 * @param config - Refresh configuration
 * @param onRefresh - Callback function to handle refreshed coupons
 */
export function scheduleDailyRefresh(
  config: CouponRefreshConfig,
  onRefresh: (coupons: Coupon[]) => void | Promise<void>
): () => void {
  // Calculate time until next refresh
  const [hours, minutes] = config.refreshTime.split(":").map(Number);
  
  function calculateNextRefresh(): number {
    const now = new Date();
    const nextRefresh = new Date();
    nextRefresh.setHours(hours, minutes, 0, 0);
    
    // If refresh time has passed today, schedule for tomorrow
    if (nextRefresh <= now) {
      nextRefresh.setDate(nextRefresh.getDate() + 1);
    }
    
    return nextRefresh.getTime() - now.getTime();
  }
  
  let timeoutId: ReturnType<typeof setTimeout>;
  
  function scheduleNext() {
    const msUntilRefresh = calculateNextRefresh();
    
    timeoutId = setTimeout(async () => {
      // This would typically fetch existing coupons from a database
      // For now, we'll call onRefresh with empty array as placeholder
      const existingCoupons: Coupon[] = []; // TODO: Load from database
      const refreshedCoupons = await refreshCoupons(existingCoupons, config);
      await onRefresh(refreshedCoupons);
      
      // Schedule next refresh
      scheduleNext();
    }, msUntilRefresh);
    
    console.log(`Next coupon refresh scheduled in ${Math.round(msUntilRefresh / 1000 / 60)} minutes`);
  }
  
  // Start scheduling
  scheduleNext();
  
  // Return cleanup function
  return () => {
    clearTimeout(timeoutId);
  };
}

/**
 * Check if it's time to refresh coupons (useful for serverless/cron jobs)
 */
export function shouldRefreshCoupons(config: CouponRefreshConfig): boolean {
  const now = new Date();
  const [hours, minutes] = config.refreshTime.split(":").map(Number);
  
  // Check if current time matches refresh time (within 1 minute window)
  return (
    now.getHours() === hours &&
    now.getMinutes() >= minutes &&
    now.getMinutes() < minutes + 1
  );
}

/**
 * Default refresh configuration
 */
export const DEFAULT_REFRESH_CONFIG: CouponRefreshConfig = {
  refreshTime: "00:00", // Midnight
  stores: ["Safeway", "Nob Hill", "Ranch 99", "Food Maxx", "Lucky"],
};

