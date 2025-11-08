import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDatabase } from '../config/database.js';
import Coupon from '../models/Coupon.js';
import CouponCategory from '../models/CouponCategory.js';
import CouponRestriction from '../models/CouponRestriction.js';

dotenv.config();

// Store locations
const STORE_LOCATIONS = {
  "Safeway": {
    address: "1555 Branham Ln",
    city: "San Jose",
    zipCode: "95118",
    latitude: 37.2565,
    longitude: -121.8875
  },
  "Nob Hill": {
    address: "1600 Kooser Rd",
    city: "San Jose",
    zipCode: "95118",
    latitude: 37.2583,
    longitude: -121.8892
  },
  "Food Maxx": {
    address: "1818 W Capitol Expy",
    city: "San Jose",
    zipCode: "95121",
    latitude: 37.3089,
    longitude: -121.8167
  },
  "Lucky": {
    address: "1505 S Bascom Ave",
    city: "San Jose",
    zipCode: "95128",
    latitude: 37.2967,
    longitude: -121.9367
  }
};

// Generate QR code
function generateQRCode(coupon) {
  const storeInfo = STORE_LOCATIONS[coupon.store];
  const location = storeInfo 
    ? `${storeInfo.address}, ${storeInfo.city}, CA ${storeInfo.zipCode}` 
    : coupon.store;
  
  return JSON.stringify({
    id: coupon._id,
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

// Seed categories
async function seedCategories() {
  const categories = [
    { name: 'Snacks', description: 'Snacks and chips', icon: '🍿', color: '#F59E0B' },
    { name: 'Beverages', description: 'Drinks and beverages', icon: '🥤', color: '#3B82F6' },
    { name: 'Household', description: 'Household items', icon: '🏠', color: '#8B5CF6' },
    { name: 'Produce', description: 'Fresh produce', icon: '🥬', color: '#10B981' },
    { name: 'Other', description: 'Other items', icon: '🛒', color: '#6B7280' }
  ];

  for (const cat of categories) {
    await CouponCategory.findOneAndUpdate(
      { name: cat.name },
      cat,
      { upsert: true, new: true }
    );
  }

  console.log('✅ Categories seeded');
}

// Seed coupons - 10 per store (excluding Ranch 99)
async function seedCoupons() {
  // Get categories
  const snacksCategory = await CouponCategory.findOne({ name: 'Snacks' });
  const beveragesCategory = await CouponCategory.findOne({ name: 'Beverages' });
  const householdCategory = await CouponCategory.findOne({ name: 'Household' });
  const produceCategory = await CouponCategory.findOne({ name: 'Produce' });
  const otherCategory = await CouponCategory.findOne({ name: 'Other' });

  // Safeway - 10 coupons
  const safewayCoupons = [
    { title: "$2 off Chips Family Size", brand: "Lays", store: "Safeway", value: 2, type: "Amount", category: snacksCategory._id, expiresAt: new Date("2025-12-31"), storeLocation: STORE_LOCATIONS.Safeway },
    { title: "$2.50 off Cereal", brand: "Cheerios", store: "Safeway", value: 2.5, type: "Amount", category: snacksCategory._id, expiresAt: new Date("2025-12-12"), storeLocation: STORE_LOCATIONS.Safeway },
    { title: "Buy 1 Get 1 Apples", brand: "Gala", store: "Safeway", value: 0, type: "BOGO", category: produceCategory._id, expiresAt: new Date("2025-11-25"), storeLocation: STORE_LOCATIONS.Safeway },
    { title: "20% off Organic Milk", brand: "Horizon", store: "Safeway", value: 0, type: "Percent", percentOff: 20, category: beveragesCategory._id, expiresAt: new Date("2025-12-05"), storeLocation: STORE_LOCATIONS.Safeway },
    { title: "25% off Fresh Berries", brand: "Driscoll's", store: "Safeway", value: 0, type: "Percent", percentOff: 25, category: produceCategory._id, expiresAt: new Date("2025-11-28"), storeLocation: STORE_LOCATIONS.Safeway },
    { title: "$6 off Coffee", brand: "Starbucks", store: "Safeway", value: 6, type: "Amount", category: beveragesCategory._id, expiresAt: new Date("2025-12-25"), storeLocation: STORE_LOCATIONS.Safeway },
    { title: "15% off Orange Juice", brand: "Tropicana", store: "Safeway", value: 0, type: "Percent", percentOff: 15, category: beveragesCategory._id, expiresAt: new Date("2025-12-03"), storeLocation: STORE_LOCATIONS.Safeway },
    { title: "$7 off Dish Soap Pack", brand: "Dawn", store: "Safeway", value: 7, type: "Amount", category: householdCategory._id, expiresAt: new Date("2025-12-22"), storeLocation: STORE_LOCATIONS.Safeway },
    { title: "BOGO Shampoo", brand: "Head & Shoulders", store: "Safeway", value: 0, type: "BOGO", category: householdCategory._id, expiresAt: new Date("2025-12-16"), storeLocation: STORE_LOCATIONS.Safeway },
    { title: "$3 off Granola Bars", brand: "Nature Valley", store: "Safeway", value: 3, type: "Amount", category: snacksCategory._id, expiresAt: new Date("2025-12-20"), storeLocation: STORE_LOCATIONS.Safeway }
  ];

  // Nob Hill - 10 coupons
  const nobHillCoupons = [
    { title: "$3 off Fresh Salmon", brand: "Wild Caught", store: "Nob Hill", value: 3, type: "Amount", category: otherCategory._id, expiresAt: new Date("2025-12-10"), storeLocation: STORE_LOCATIONS["Nob Hill"] },
    { title: "BOGO Organic Eggs", brand: "Happy Egg", store: "Nob Hill", value: 0, type: "BOGO", category: otherCategory._id, expiresAt: new Date("2025-12-05"), storeLocation: STORE_LOCATIONS["Nob Hill"] },
    { title: "20% off Wine Selection", brand: "House Brand", store: "Nob Hill", value: 0, type: "Percent", percentOff: 20, category: beveragesCategory._id, expiresAt: new Date("2025-12-20"), storeLocation: STORE_LOCATIONS["Nob Hill"] },
    { title: "$4 off Deli Meats", brand: "Boar's Head", store: "Nob Hill", value: 4, type: "Amount", category: otherCategory._id, expiresAt: new Date("2025-12-08"), storeLocation: STORE_LOCATIONS["Nob Hill"] },
    { title: "$5 off Organic Chicken", brand: "Fresh", store: "Nob Hill", value: 5, type: "Amount", category: otherCategory._id, expiresAt: new Date("2025-12-15"), storeLocation: STORE_LOCATIONS["Nob Hill"] },
    { title: "15% off Artisan Bread", brand: "Fresh Baked", store: "Nob Hill", value: 0, type: "Percent", percentOff: 15, category: otherCategory._id, expiresAt: new Date("2025-12-18"), storeLocation: STORE_LOCATIONS["Nob Hill"] },
    { title: "$2 off Fresh Spinach", brand: "Fresh", store: "Nob Hill", value: 2, type: "Amount", category: produceCategory._id, expiresAt: new Date("2025-12-07"), storeLocation: STORE_LOCATIONS["Nob Hill"] },
    { title: "$6 off Cheese Selection", brand: "House Brand", store: "Nob Hill", value: 6, type: "Amount", category: otherCategory._id, expiresAt: new Date("2025-12-22"), storeLocation: STORE_LOCATIONS["Nob Hill"] },
    { title: "25% off Frozen Organic Meals", brand: "Select", store: "Nob Hill", value: 0, type: "Percent", percentOff: 25, category: otherCategory._id, expiresAt: new Date("2025-12-12"), storeLocation: STORE_LOCATIONS["Nob Hill"] },
    { title: "$3.50 off Yogurt", brand: "Greek Gods", store: "Nob Hill", value: 3.5, type: "Amount", category: otherCategory._id, expiresAt: new Date("2025-12-14"), storeLocation: STORE_LOCATIONS["Nob Hill"] }
  ];

  // Food Maxx - 10 coupons
  const foodMaxxCoupons = [
    { title: "$3 off Ground Beef 1lb", brand: "Fresh", store: "Food Maxx", value: 3, type: "Amount", category: otherCategory._id, expiresAt: new Date("2025-12-10"), storeLocation: STORE_LOCATIONS["Food Maxx"] },
    { title: "BOGO Canned Goods", brand: "House Brand", store: "Food Maxx", value: 0, type: "BOGO", category: otherCategory._id, expiresAt: new Date("2025-12-18"), storeLocation: STORE_LOCATIONS["Food Maxx"] },
    { title: "25% off Frozen Foods", brand: "Select", store: "Food Maxx", value: 0, type: "Percent", percentOff: 25, category: snacksCategory._id, expiresAt: new Date("2025-12-05"), storeLocation: STORE_LOCATIONS["Food Maxx"] },
    { title: "$4 off Cleaning Supplies", brand: "Generic", store: "Food Maxx", value: 4, type: "Amount", category: householdCategory._id, expiresAt: new Date("2025-12-14"), storeLocation: STORE_LOCATIONS["Food Maxx"] },
    { title: "$2 off Pasta", brand: "House Brand", store: "Food Maxx", value: 2, type: "Amount", category: otherCategory._id, expiresAt: new Date("2025-12-16"), storeLocation: STORE_LOCATIONS["Food Maxx"] },
    { title: "20% off Paper Products", brand: "Generic", store: "Food Maxx", value: 0, type: "Percent", percentOff: 20, category: householdCategory._id, expiresAt: new Date("2025-12-20"), storeLocation: STORE_LOCATIONS["Food Maxx"] },
    { title: "$5 off Frozen Vegetables", brand: "Select", store: "Food Maxx", value: 5, type: "Amount", category: produceCategory._id, expiresAt: new Date("2025-12-12"), storeLocation: STORE_LOCATIONS["Food Maxx"] },
    { title: "BOGO Soda 12-pack", brand: "House Brand", store: "Food Maxx", value: 0, type: "BOGO", category: beveragesCategory._id, expiresAt: new Date("2025-12-08"), storeLocation: STORE_LOCATIONS["Food Maxx"] },
    { title: "$3.50 off Ice Cream", brand: "House Brand", store: "Food Maxx", value: 3.5, type: "Amount", category: otherCategory._id, expiresAt: new Date("2025-12-22"), storeLocation: STORE_LOCATIONS["Food Maxx"] },
    { title: "15% off Bulk Items", brand: "House Brand", store: "Food Maxx", value: 0, type: "Percent", percentOff: 15, category: otherCategory._id, expiresAt: new Date("2025-12-15"), storeLocation: STORE_LOCATIONS["Food Maxx"] }
  ];

  // Lucky - 10 coupons
  const luckyCoupons = [
    { title: "$2.50 off Rotisserie Chicken", brand: "Fresh", store: "Lucky", value: 2.5, type: "Amount", category: otherCategory._id, expiresAt: new Date("2025-12-07"), storeLocation: STORE_LOCATIONS.Lucky },
    { title: "BOGO Bakery Items", brand: "Fresh Baked", store: "Lucky", value: 0, type: "BOGO", category: otherCategory._id, expiresAt: new Date("2025-12-03"), storeLocation: STORE_LOCATIONS.Lucky },
    { title: "20% off Prepared Foods", brand: "Deli", store: "Lucky", value: 0, type: "Percent", percentOff: 20, category: otherCategory._id, expiresAt: new Date("2025-12-11"), storeLocation: STORE_LOCATIONS.Lucky },
    { title: "$3 off Soda 12-pack", brand: "Coca-Cola", store: "Lucky", value: 3, type: "Amount", category: beveragesCategory._id, expiresAt: new Date("2025-12-20"), storeLocation: STORE_LOCATIONS.Lucky },
    { title: "$4 off Laundry Detergent", brand: "Tide", store: "Lucky", value: 4, type: "Amount", category: householdCategory._id, expiresAt: new Date("2025-12-17"), storeLocation: STORE_LOCATIONS.Lucky },
    { title: "$2 off Bananas", brand: "Fresh", store: "Lucky", value: 2, type: "Amount", category: produceCategory._id, expiresAt: new Date("2025-12-09"), storeLocation: STORE_LOCATIONS.Lucky },
    { title: "25% off Frozen Pizza", brand: "DiGiorno", store: "Lucky", value: 0, type: "Percent", percentOff: 25, category: otherCategory._id, expiresAt: new Date("2025-12-13"), storeLocation: STORE_LOCATIONS.Lucky },
    { title: "$5 off Toilet Paper Pack", brand: "Charmin", store: "Lucky", value: 5, type: "Amount", category: householdCategory._id, expiresAt: new Date("2025-12-19"), storeLocation: STORE_LOCATIONS.Lucky },
    { title: "BOGO Bread", brand: "Wonder", store: "Lucky", value: 0, type: "BOGO", category: otherCategory._id, expiresAt: new Date("2025-12-06"), storeLocation: STORE_LOCATIONS.Lucky },
    { title: "$3.50 off Butter", brand: "Land O'Lakes", store: "Lucky", value: 3.5, type: "Amount", category: otherCategory._id, expiresAt: new Date("2025-12-21"), storeLocation: STORE_LOCATIONS.Lucky }
  ];

  const allCoupons = [...safewayCoupons, ...nobHillCoupons, ...foodMaxxCoupons, ...luckyCoupons];

  // Clear existing coupons
  await Coupon.deleteMany({});

  // Insert coupons with QR codes
  for (const couponData of allCoupons) {
    const coupon = new Coupon(couponData);
    coupon.qrCode = generateQRCode(coupon);
    await coupon.save();
  }

  console.log(`✅ Seeded ${allCoupons.length} coupons (10 per store)`);
}

// Main seed function
async function seed() {
  try {
    await connectDatabase();
    await seedCategories();
    await seedCoupons();
    console.log('✅ Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();

