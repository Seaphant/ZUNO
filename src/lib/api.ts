/**
 * API client for Zuno backend
 */

const DEFAULT_API_BASE = '/api';
const envApiBase = import.meta.env.VITE_API_URL?.trim();

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

const API_BASE_URL = normalizeBaseUrl(
  envApiBase && envApiBase.length > 0 ? envApiBase : DEFAULT_API_BASE
);

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CouponResponse {
  _id: string;
  title: string;
  brand: string;
  description?: string;
  store: string;
  storeLocation?: {
    address: string;
    city: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
  value: number;
  type: 'Amount' | 'Percent' | 'BOGO';
  percentOff?: number;
  category: {
    _id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
  };
  expiresAt: string;
  createdAt: string;
  isActive: boolean;
  imageUrl?: string;
  qrCode?: string;
  usageCount?: number;
  maxUsage?: number;
}

export interface SearchCouponsParams {
  store?: string;
  category?: string;
  brand?: string;
  q?: string;
  sort?: 'value' | 'latest' | 'popular' | 'expires';
  limit?: number;
  page?: number;
}

/**
 * Fetch coupons from API
 */
export async function fetchCoupons(params: SearchCouponsParams = {}): Promise<ApiResponse<CouponResponse[]>> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.store) queryParams.append('store', params.store);
    if (params.category) queryParams.append('category', params.category);
    if (params.brand) queryParams.append('brand', params.brand);
    if (params.q) queryParams.append('q', params.q);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());

    const url = `${API_BASE_URL}/coupons${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch coupons'
    };
  }
}

/**
 * Fetch a single coupon by ID
 */
export async function fetchCouponById(id: string): Promise<ApiResponse<CouponResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch coupon'
    };
  }
}

/**
 * Save a coupon for a user
 */
export async function saveUserCoupon(userId: string, couponId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/user-coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        couponId,
        status: 'saved'
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving user coupon:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save coupon'
    };
  }
}

/**
 * Get user's saved coupons
 */
export async function fetchUserCoupons(userId: string, status?: string): Promise<ApiResponse<any[]>> {
  try {
    const url = `${API_BASE_URL}/user-coupons/${userId}${status ? `?status=${status}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user coupons:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user coupons'
    };
  }
}

/**
 * Remove a coupon from user's saved list
 */
export async function removeUserCoupon(userCouponId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/user-coupons/${userCouponId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing user coupon:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove coupon'
    };
  }
}

/**
 * Convert API coupon response to frontend Coupon type
 */
export function apiCouponToCoupon(apiCoupon: CouponResponse): any {
  return {
    id: apiCoupon._id,
    title: apiCoupon.title,
    brand: apiCoupon.brand,
    store: apiCoupon.store,
    storeLocation: apiCoupon.storeLocation 
      ? `${apiCoupon.storeLocation.address}, ${apiCoupon.storeLocation.city}, CA ${apiCoupon.storeLocation.zipCode}`
      : undefined,
    value: apiCoupon.value,
    type: apiCoupon.type,
    percentOff: apiCoupon.percentOff,
    expiresAt: new Date(apiCoupon.expiresAt).toISOString().split('T')[0],
    category: apiCoupon.category.name,
    qrCode: apiCoupon.qrCode,
    imageUrl: apiCoupon.imageUrl,
    createdAt: apiCoupon.createdAt
  };
}

