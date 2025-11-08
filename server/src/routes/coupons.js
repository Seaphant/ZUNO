import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import Coupon from '../models/Coupon.js';
import CouponCategory from '../models/CouponCategory.js';

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * GET /api/coupons
 * Get all active coupons with optional filters
 * Query params: store, category, brand, q (search), sort, limit, page
 */
router.get('/', [
  query('store').optional().isIn(['Safeway', 'Nob Hill', 'Food Maxx', 'Lucky', 'Ranch 99', 'All']),
  query('category').optional().isString(),
  query('brand').optional().isString(),
  query('q').optional().isString(),
  query('sort').optional().isIn(['value', 'latest', 'popular', 'expires']),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 })
], validate, async (req, res) => {
  try {
    const {
      store,
      category,
      brand,
      q,
      sort = 'latest',
      limit = 50,
      page = 1
    } = req.query;

    // Build query
    const queryObj = {
      isActive: true,
      expiresAt: { $gte: new Date() }
    };

    // Filter by store
    if (store && store !== 'All') {
      queryObj.store = store;
    }

    // Filter by category
    if (category) {
      const categoryDoc = await CouponCategory.findOne({ name: category, isActive: true });
      if (categoryDoc) {
        queryObj.category = categoryDoc._id;
      }
    }

    // Filter by brand
    if (brand) {
      queryObj.brand = new RegExp(brand, 'i');
    }

    // Search query
    if (q) {
      queryObj.$or = [
        { title: new RegExp(q, 'i') },
        { brand: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') }
      ];
    }

    // Build sort
    let sortObj = {};
    switch (sort) {
      case 'value':
        sortObj = { value: -1, priority: -1 };
        break;
      case 'popular':
        sortObj = { usageCount: -1, priority: -1 };
        break;
      case 'expires':
        sortObj = { expiresAt: 1, priority: -1 };
        break;
      case 'latest':
      default:
        sortObj = { createdAt: -1, priority: -1 };
        break;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const coupons = await Coupon.find(queryObj)
      .populate('category', 'name description icon color')
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();
    
    // Don't populate restrictions for now (can add later if needed)
    // .populate('restrictions')

    // Get total count for pagination
    const total = await Coupon.countDocuments(queryObj);

    res.json({
      success: true,
      data: coupons,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * GET /api/coupons/:id
 * Get a specific coupon by ID
 */
router.get('/:id', [
  param('id').isMongoId()
], validate, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('category', 'name description icon color');

    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Coupon not found' });
    }

    res.json({ success: true, data: coupon });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * GET /api/coupons/code/:code
 * Get a specific coupon by code (if you add coupon codes)
 */
router.get('/code/:code', [
  param('code').isString().notEmpty()
], validate, async (req, res) => {
  try {
    // If you add coupon codes later, uncomment and modify:
    // const coupon = await Coupon.findOne({ code: req.params.code })
    //   .populate('category')
    //   .populate('restrictions');
    
    // For now, return not implemented
    res.status(501).json({ success: false, error: 'Coupon codes not yet implemented' });
  } catch (error) {
    console.error('Error fetching coupon by code:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/coupons
 * Create a new coupon
 */
router.post('/', [
  body('title').isString().notEmpty().trim(),
  body('brand').isString().notEmpty().trim(),
  body('store').isIn(['Safeway', 'Nob Hill', 'Food Maxx', 'Lucky', 'Ranch 99']),
  body('value').isFloat({ min: 0 }),
  body('type').isIn(['Amount', 'Percent', 'BOGO']),
  body('category').isMongoId(),
  body('expiresAt').isISO8601(),
  body('percentOff').optional().isInt({ min: 0, max: 100 }),
  body('description').optional().isString().trim(),
  body('imageUrl').optional().isURL(),
  body('maxUsage').optional().isInt({ min: 1 })
], validate, async (req, res) => {
  try {
    // Verify category exists
    const category = await CouponCategory.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ success: false, error: 'Invalid category' });
    }

    const coupon = new Coupon(req.body);
    await coupon.save();

    const populatedCoupon = await Coupon.findById(coupon._id)
      .populate('category', 'name description icon color');

    res.status(201).json({ success: true, data: populatedCoupon });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * PUT /api/coupons/:id
 * Update a coupon
 */
router.put('/:id', [
  param('id').isMongoId(),
  body('title').optional().isString().notEmpty().trim(),
  body('brand').optional().isString().notEmpty().trim(),
  body('store').optional().isIn(['Safeway', 'Nob Hill', 'Food Maxx', 'Lucky', 'Ranch 99']),
  body('value').optional().isFloat({ min: 0 }),
  body('type').optional().isIn(['Amount', 'Percent', 'BOGO']),
  body('category').optional().isMongoId(),
  body('expiresAt').optional().isISO8601(),
  body('isActive').optional().isBoolean(),
  body('percentOff').optional().isInt({ min: 0, max: 100 })
], validate, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('category', 'name description icon color');

    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Coupon not found' });
    }

    res.json({ success: true, data: coupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * DELETE /api/coupons/:id
 * Delete/deactivate a coupon
 */
router.delete('/:id', [
  param('id').isMongoId()
], validate, async (req, res) => {
  try {
    // Soft delete - set isActive to false
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Coupon not found' });
    }

    res.json({ success: true, message: 'Coupon deactivated successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;

