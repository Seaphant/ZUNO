import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Store Information
  store: {
    type: String,
    required: true,
    enum: ['Safeway', 'Nob Hill', 'Food Maxx', 'Lucky', 'Ranch 99'],
    index: true
  },
  storeLocation: {
    address: String,
    city: String,
    zipCode: String,
    latitude: Number,
    longitude: Number
  },
  
  // Coupon Value
  value: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['Amount', 'Percent', 'BOGO'],
    index: true
  },
  percentOff: {
    type: Number,
    min: 0,
    max: 100,
    validate: {
      validator: function(value) {
        return this.type !== 'Percent' || value !== undefined;
      },
      message: 'percentOff is required when type is Percent'
    }
  },
  
  // Category
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CouponCategory',
    required: true,
    index: true
  },
  
  // Dates
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Images
  imageUrl: {
    type: String,
    trim: true
  },
  
  // QR Code
  qrCode: {
    type: String,
    trim: true
  },
  
  // Restrictions
  restrictions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CouponRestriction'
  }],
  
  // Usage Tracking
  usageCount: {
    type: Number,
    default: 0
  },
  maxUsage: {
    type: Number,
    default: null // null = unlimited
  },
  
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  priority: {
    type: Number,
    default: 0, // Higher number = higher priority
    index: true
  }
}, {
  timestamps: true
});

// Indexes for performance
couponSchema.index({ store: 1, isActive: 1, expiresAt: 1 });
couponSchema.index({ category: 1, isActive: 1 });
couponSchema.index({ brand: 1, isActive: 1 });
couponSchema.index({ createdAt: -1 });
couponSchema.index({ expiresAt: 1, isActive: 1 });

// Virtual for checking if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
  return this.isActive && 
         !this.isExpired && 
         (this.maxUsage === null || this.usageCount < this.maxUsage);
};

// Static method to find active coupons
couponSchema.statics.findActive = function() {
  return this.find({
    isActive: true,
    expiresAt: { $gte: new Date() }
  });
};

export default mongoose.model('Coupon', couponSchema);

