import mongoose from 'mongoose';

const couponRestrictionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'minPurchaseAmount',      // Minimum purchase required
      'productSpecific',        // Valid only for specific products
      'brandSpecific',          // Valid only for specific brands
      'categorySpecific',       // Valid only for specific categories
      'quantityRequired',       // Minimum quantity required
      'dayOfWeek',              // Valid only on certain days
      'timeOfDay',              // Valid only at certain times
      'firstTimeCustomer',      // First time customers only
      'loyaltyMember',          // Loyalty members only
      'locationSpecific',       // Valid only at specific locations
      'combinationRequired'     // Must buy with other items
    ]
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // Can be number, string, array, etc.
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Examples:
// { type: 'minPurchaseAmount', value: 50, description: 'Minimum $50 purchase required' }
// { type: 'productSpecific', value: ['product-id-1', 'product-id-2'], description: 'Valid only for specific products' }
// { type: 'brandSpecific', value: ['Lays', 'Cheerios'], description: 'Valid only for Lays and Cheerios' }
// { type: 'dayOfWeek', value: [1, 2, 3], description: 'Valid Monday, Tuesday, Wednesday' } // 0 = Sunday
// { type: 'quantityRequired', value: 2, description: 'Must purchase at least 2 items' }

export default mongoose.model('CouponRestriction', couponRestrictionSchema);

