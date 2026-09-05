const express = require('express');
const {
  checkout,
  getMyOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus
} = require('../controllers/order.controller');

const { orderValidator, updateOrderStatusValidator } = require('../validators/order.validator');
const validateRequest = require('../middlewares/validateRequest');
const { protect, admin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Publicly accessible user routes (must be logged in)
router.route('/')
  .post(protect, orderValidator, validateRequest, checkout)
  .get(protect, getMyOrders);

// Admin only route (Must be before /:id)
router.route('/all')
  .get(protect, admin, getAllOrders);

router.route('/:id')
  .get(protect, getOrder);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatusValidator, validateRequest, updateOrderStatus);



module.exports = router;