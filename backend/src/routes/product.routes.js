const express = require('express');
const { 
  createProduct, 
  getProducts, 
  getProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/product.controller');

const { productValidator } = require('../validators/product.validator');
const validateRequest = require('../middlewares/validateRequest');
const { protect, admin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .post(protect, admin, productValidator, validateRequest, createProduct)
  .get(getProducts);

router.route('/:id')
  .get(getProduct) 
  .put(protect, admin, productValidator, validateRequest, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
