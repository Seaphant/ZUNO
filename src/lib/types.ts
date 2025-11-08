export type Coupon = {
  id: string;
  title: string;
  brand: string;
  store: string;
  storeLocation?: string; // Store address in South San Jose
  value: number;
  type: "BOGO" | "Percent" | "Amount";
  percentOff?: number;
  expiresAt: string;
  category: "Snacks" | "Beverages" | "Household" | "Produce" | "Other";
  qrCode?: string; // QR code data for the coupon
  imageUrl?: string; // Product image URL from store database
  createdAt?: string; // When coupon was created (for refresh tracking)
};

export type StoreLocation = {
  name: string;
  address: string;
  city: string;
  zipCode: string;
  latitude: number;
  longitude: number;
};
