/**
 * Script to batch update all coupons with product images
 * Run with: npm run update-images
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDatabase } from '../config/database.js';
import Coupon from '../models/Coupon.js';
import CouponCategory from '../models/CouponCategory.js';
import { fetchProductImage } from '../services/productImageService.js';

dotenv.config();

async function updateAllCouponImages() {
  try {
    console.log('🔄 Connecting to database...');
    await connectDatabase();

    // Find all active coupons
    const coupons = await Coupon.find({ isActive: true })
      .populate('category', 'name');

    console.log(`📦 Found ${coupons.length} active coupons`);
    console.log('🖼️  Starting image update process...\n');

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < coupons.length; i++) {
      const coupon = coupons[i];
      const categoryName = coupon.category?.name || 'Other';
      
      // Skip if already has an image URL
      if (coupon.imageUrl && coupon.imageUrl.trim() !== '') {
        console.log(`⏭️  [${i + 1}/${coupons.length}] Skipping ${coupon.title} (already has image)`);
        skipped++;
        continue;
      }

      try {
        console.log(`🔄 [${i + 1}/${coupons.length}] Fetching image for: ${coupon.brand} ${coupon.title}...`);
        
        const imageUrl = await fetchProductImage(
          coupon.brand,
          coupon.title,
          categoryName
        );

        if (imageUrl) {
          coupon.imageUrl = imageUrl;
          await coupon.save();
          console.log(`✅ Updated: ${coupon.title}`);
          updated++;
        } else {
          console.log(`⚠️  No image found for: ${coupon.title}`);
          failed++;
        }

        // Rate limiting: wait 100ms between requests to avoid API quota issues
        if (i < coupons.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`❌ Error updating ${coupon.title}:`, error.message);
        failed++;
      }
    }

    console.log('\n📊 Update Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📦 Total: ${coupons.length}`);

    console.log('\n✅ Image update process completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
updateAllCouponImages();

