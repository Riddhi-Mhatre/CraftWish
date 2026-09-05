const express = require('express');
const { 
  createCategory, 
  getCategories, 
  getCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/category.controller');

const { categoryValidator } = require('../validators/category.validator');
const validateRequest = require('../middlewares/validateRequest');

// 1. Import our security middlewares
const { protect, admin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Routes for: /api/categories
router.route('/')
  // 2. Inject protect and admin before validation
  .post(protect, admin, categoryValidator, validateRequest, createCategory) 
  .get(getCategories); // GET is still public (customers need to see categories!)

// Routes for: /api/categories/:id
router.route('/:id')
  .get(getCategory) // Public
  .put(protect, admin, categoryValidator, validateRequest, updateCategory) // Secured
  .delete(protect, admin, deleteCategory); // Secured

module.exports = router;