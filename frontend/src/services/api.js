import axios from 'axios';

// Create a centralized Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Add an interceptor to automatically attach the JWT token
api.interceptors.request.use(
  (config) => {
    // Look for the token in LocalStorage
    const token = localStorage.getItem('token');
    
    // If it exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;