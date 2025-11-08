import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import UserCoupon from '../models/UserCoupon.js';
import Coupon from '../models/Coupon.js';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * GET /api/user-coupons/:userId
 * Get all coupons for a specific user
 */
router.get('/:userId', [
  param('userId').isString().notEmpty(),
  query('status').optional().isIn(['claimed', 'saved', 'used', 'expired'])
], validate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const queryObj = { userId };
    if (status) {
      queryObj.status = status;
    }

    const userCoupons = await UserCoupon.find(queryObj)
      .populate('couponId')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: userCoupons });
  } catch (error) {
    console.error('Error fetching user coupons:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/user-coupons
 * Save/claim a coupon for a user
 */
router.post('/', [
  body('userId').isString().notEmpty(),
  body('couponId').isMongoId(),
  body('status').optional().isIn(['claimed', 'saved'])
], validate, async (req, res) => {
  try {
    const { userId, couponId, status = 'saved' } = req.body;

    // Check if coupon exists and is valid
    const coupon = await Coupon.findById(couponId);
    if (!coupon || !coupon.isValid()) {
      return res.status(400).json({ success: false, error: 'Invalid or expired coupon' });
    }

    // Check if user already has this coupon
    const existing = await UserCoupon.findOne({ userId, couponId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Coupon already saved' });
    }

    const userCoupon = new UserCoupon({
      userId,
      couponId,
      status,
      claimedAt: status === 'claimed' ? new Date() : null
    });

    await userCoupon.save();

    const populated = await UserCoupon.findById(userCoupon._id)
      .populate('couponId');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Error saving user coupon:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * PUT /api/user-coupons/:id
 * Update user coupon status (e.g., mark as used)
 */
router.put('/:id', [
  param('id').isMongoId(),
  body('status').isIn(['claimed', 'saved', 'used', 'expired']),
  body('transactionId').optional().isString(),
  body('storeLocation').optional().isString()
], validate, async (req, res) => {
  try {
    const updateData = {
      status: req.body.status,
      ...(req.body.status === 'used' && { usedAt: new Date() }),
      ...(req.body.transactionId && { transactionId: req.body.transactionId }),
      ...(req.body.storeLocation && { storeLocation: req.body.storeLocation })
    };

    const userCoupon = await UserCoupon.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('couponId');

    if (!userCoupon) {
      return res.status(404).json({ success: false, error: 'User coupon not found' });
    }

    // Increment usage count on coupon
    if (req.body.status === 'used') {
      await Coupon.findByIdAndUpdate(userCoupon.couponId._id, {
        $inc: { usageCount: 1 }
      });
    }

    res.json({ success: true, data: userCoupon });
  } catch (error) {
    console.error('Error updating user coupon:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * DELETE /api/user-coupons/:id
 * Remove a coupon from user's saved list
 */
router.delete('/:id', [
  param('id').isMongoId()
], validate, async (req, res) => {
  try {
    const userCoupon = await UserCoupon.findByIdAndDelete(req.params.id);

    if (!userCoupon) {
      return res.status(404).json({ success: false, error: 'User coupon not found' });
    }

    res.json({ success: true, message: 'Coupon removed successfully' });
  } catch (error) {
    console.error('Error deleting user coupon:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;

