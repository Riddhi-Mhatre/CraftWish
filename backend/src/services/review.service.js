const Review = require('../models/review.model');
const Order = require('../models/order.model');

exports.createReview = async (userId, productId, reviewData) => {
  // Business Logic: Ensure the user actually bought the product
  const hasOrdered = await Order.findOne({
    user: userId,
    'items.product': productId
  });

  if (!hasOrdered) {
    throw new Error('You can only review products you have purchased.');
  }

  // Ensure they haven't reviewed it yet
  const existingReview = await Review.findOne({ product: productId, user: userId });
  if (existingReview) {
    throw new Error('You have already reviewed this product.');
  }

  const review = new Review({
    user: userId,
    product: productId,
    rating: reviewData.rating,
    comment: reviewData.comment
  });

  return await review.save();
};

exports.getProductReviews = async (productId) => {
  return await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
};

exports.updateReview = async (reviewId, userId, updateData) => {
  const review = await Review.findOne({ _id: reviewId, user: userId });
  if (!review) {
    throw new Error('Review not found or unauthorized');
  }
  
  review.rating = updateData.rating || review.rating;
  review.comment = updateData.comment || review.comment;
  
  return await review.save();
};

exports.deleteReview = async (reviewId, userId, userRole) => {
  let query = { _id: reviewId };
  
  // Normal users can only delete their own reviews; Admins can delete any review
  if (userRole !== 'admin') {
    query.user = userId; 
  }

  const review = await Review.findOneAndDelete(query);
  if (!review) {
    throw new Error('Review not found or unauthorized');
  }
  return review;
};
