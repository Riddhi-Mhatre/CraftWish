const { body } = require('express-validator');

const categoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters'),
    
  body('description')
    .optional() // The description is not required...
    .trim()
    .isLength({ max: 200 }) // ...but if it is provided, it cannot exceed 200 chars
    .withMessage('Description cannot exceed 200 characters')
];

module.exports = {
  categoryValidator
};