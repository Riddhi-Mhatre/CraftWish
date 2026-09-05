const { body } = require('express-validator');

const productValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
    
  body('sku')
    .trim()
    .notEmpty().withMessage('SKU is required'),
    
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
    
  body('price')
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value >= 0).withMessage('Price cannot be negative'),
    
  body('category')
    .notEmpty().withMessage('Category ID is required')
    .isMongoId().withMessage('Invalid Category ID format'),
    
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a positive integer')
];

module.exports = {
  productValidator
};
