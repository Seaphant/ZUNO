/**
 * Product Image Database (shared with the frontend)
 * Uses the manifest at /shared/product-images.json so both apps stay in sync.
 */

import productImageConfig from "../../../shared/product-images.json" with { type: "json" };

const BRAND_IMAGES = productImageConfig.brands;
const KEYWORD_FALLBACKS = productImageConfig.keywordFallbacks;
const CATEGORY_FALLBACKS = productImageConfig.categoryFallbacks;
const DEFAULT_CATEGORY_IMAGE =
  CATEGORY_FALLBACKS["Other"] ?? "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";

function matchesKeywords(source = "", keywords = []) {
  if (!keywords.length) {
    return false;
  }
  const normalized = source.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

function resolveBrandImage(brand = "", title = "") {
  const entry = BRAND_IMAGES[brand];
  if (!entry) {
    return undefined;
  }

  if (typeof entry === "string") {
    return entry;
  }

  const normalized = `${brand} ${title}`.trim().toLowerCase();
  for (const matcher of entry.matchers ?? []) {
    if (matchesKeywords(normalized, matcher.keywords)) {
      return matcher.url;
    }
  }

  return entry.default;
}

function resolveKeywordFallback(brand = "", title = "") {
  const normalized = `${brand} ${title}`.trim().toLowerCase();
  for (const fallback of KEYWORD_FALLBACKS) {
    if (matchesKeywords(normalized, fallback.keywords)) {
      return fallback.url;
    }
  }
  return undefined;
}

/**
 * Get product image URL
 * @param {string} brand
 * @param {string} title
 * @param {string} category
 * @returns {string}
 */
export function getProductImage(brand = "", title = "", category = "Other") {
  const brandImage = resolveBrandImage(brand, title);
  if (brandImage) {
    return brandImage;
  }

  const keywordImage = resolveKeywordFallback(brand, title);
  if (keywordImage) {
    return keywordImage;
  }

  return CATEGORY_FALLBACKS[category] ?? DEFAULT_CATEGORY_IMAGE;
}

