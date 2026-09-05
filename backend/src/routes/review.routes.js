const express = require('express');
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview
} = require('../controllers/review.controller');

const { reviewValidator } = require('../validators/review.validator');
const validateRequest = require('../middlewares/validateRequest');
const { protect } = require('../middlewares/auth.middleware');

// mergeParams: true allows us to access :productId from the nested route in app.js
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getProductReviews)
  .post(protect, reviewValidator, validateRequest, createReview);

router.route('/:id')
  .put(protect, reviewValidator, validateRequest, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
