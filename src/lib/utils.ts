/**
 * Utility functions for Zuno application
 */

/**
 * LocalStorage utility functions for saved coupons
 */
export const savedCouponsStorage = {
  get: (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },
  
  set: (ids: string[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('saved', JSON.stringify(ids));
    } catch (error) {
      console.error('Failed to save coupons:', error);
    }
  },
  
  add: (id: string): void => {
    const saved = savedCouponsStorage.get();
    if (!saved.includes(id)) {
      savedCouponsStorage.set([...saved, id]);
    }
  },
  
  remove: (id: string): void => {
    const saved = savedCouponsStorage.get();
    savedCouponsStorage.set(saved.filter(x => x !== id));
  },
  
  has: (id: string): boolean => {
    return savedCouponsStorage.get().includes(id);
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('saved');
  },
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

