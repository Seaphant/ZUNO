/**
 * Product image utilities for fetching images from store databases.
 * Relies on a shared JSON manifest (`shared/product-images.json`) so the
 * frontend mock data and backend API stay perfectly in sync.
 */

import productImageConfigData from "../../shared/product-images.json";
import type { Coupon } from "./types";

type BrandMatcher = {
  keywords?: string[];
  url: string;
};

type BrandEntry =
  | string
  | {
      default: string;
      matchers?: BrandMatcher[];
    };

type ProductImageConfig = {
  brands: Record<string, BrandEntry>;
  keywordFallbacks: Array<{ keywords: string[]; url: string }>;
  categoryFallbacks: Record<string, string>;
};

const PRODUCT_IMAGE_CONFIG = productImageConfigData as ProductImageConfig;
const BRAND_IMAGES = PRODUCT_IMAGE_CONFIG.brands;
const KEYWORD_FALLBACKS = PRODUCT_IMAGE_CONFIG.keywordFallbacks;
const CATEGORY_FALLBACKS = PRODUCT_IMAGE_CONFIG.categoryFallbacks;
const DEFAULT_CATEGORY_IMAGE =
  CATEGORY_FALLBACKS["Other"] ?? "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";

function matchesKeywords(source: string, keywords: string[] = []): boolean {
  if (!keywords.length) {
    return false;
  }
  const normalized = source.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

function resolveBrandImage(coupon: Coupon): string | undefined {
  const entry = BRAND_IMAGES[coupon.brand];
  if (!entry) {
    return undefined;
  }

  if (typeof entry === "string") {
    return entry;
  }

  const normalized = `${coupon.brand} ${coupon.title}`.toLowerCase();
  for (const matcher of entry.matchers ?? []) {
    if (matchesKeywords(normalized, matcher.keywords)) {
      return matcher.url;
    }
  }

  return entry.default;
}

function resolveKeywordFallback(coupon: Coupon): string | undefined {
  const normalized = `${coupon.brand} ${coupon.title}`.toLowerCase();
  for (const fallback of KEYWORD_FALLBACKS) {
    if (matchesKeywords(normalized, fallback.keywords)) {
      return fallback.url;
    }
  }
  return undefined;
}

/**
 * Get product image URL for a coupon
 * Priority:
 * 1. Direct imageUrl from coupon (if already fetched from store API)
 * 2. Brand-based lookup from shared manifest (exact brand match and keyword-aware overrides)
 * 3. Title/brand keyword fallbacks for generic brands
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

  const brandImage = resolveBrandImage(coupon);
  if (brandImage) {
    return brandImage;
  }

  const keywordFallback = resolveKeywordFallback(coupon);
  if (keywordFallback) {
    return keywordFallback;
  }

  return CATEGORY_FALLBACKS[coupon.category] ?? DEFAULT_CATEGORY_IMAGE;
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

