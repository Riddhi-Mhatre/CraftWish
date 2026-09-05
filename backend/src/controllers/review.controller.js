const reviewService = require('../services/review.service');

exports.createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.user._id, req.params.productId, req.body);
    res.status(201).json({ success: true, message: 'Review added successfully', data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getProductReviews(req.params.productId);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.user._id, req.body);
    res.status(200).json({ success: true, message: 'Review updated', data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id, req.user._id, req.user.role);
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
