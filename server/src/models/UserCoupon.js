import mongoose from 'mongoose';

const userCouponSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['claimed', 'saved', 'used', 'expired'],
    default: 'saved',
    index: true
  },
  claimedAt: {
    type: Date,
    default: Date.now
  },
  usedAt: {
    type: Date
  },
  expiredAt: {
    type: Date
  },
  // Store transaction info if used
  transactionId: {
    type: String,
    trim: true
  },
  storeLocation: {
    type: String,
    trim: true
  },
  // Notes or feedback
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound indexes
userCouponSchema.index({ userId: 1, couponId: 1 }, { unique: true });
userCouponSchema.index({ userId: 1, status: 1 });
userCouponSchema.index({ couponId: 1, status: 1 });

// Method to check if user coupon is valid
userCouponSchema.methods.isValid = function() {
  return this.status === 'saved' || this.status === 'claimed';
};

export default mongoose.model('UserCoupon', userCouponSchema);

