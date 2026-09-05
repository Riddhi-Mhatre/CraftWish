// frontend/src/services/cart.service.js
import api from './api';

export const getCart = () => {
  return api.get('/cart');
};

export const addToCart = async (data) => {
  const response = await api.post('/cart/add', data);
  window.dispatchEvent(new Event('cartUpdated')); 
  return response;
};

// Now this triggers the navbar to update when deleting!
export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/cart/remove/${itemId}`);
  window.dispatchEvent(new Event('cartUpdated')); 
  return response;
};