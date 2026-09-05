import api from './api';

export const getProductReviews = async (productId) => {
  const response = await api.get(`/products/${productId}/reviews`);
  return response.data;
};

export const createReview = async (productId, reviewData) => {
  const response = await api.post(`/products/${productId}/reviews`, reviewData);
  return response.data;
};

export const deleteReview = async (productId, reviewId) => {
  const response = await api.delete(`/products/${productId}/reviews/${reviewId}`);
  return response.data;
};
