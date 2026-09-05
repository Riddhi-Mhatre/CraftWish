import api from './api';

export const getWishlist = () => {
  return api.get('/wishlist');
};

export const toggleWishlist = (productId) => {
  return api.post('/wishlist/toggle', { productId });
};