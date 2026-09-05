const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  // Extract the validation errors from a request
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // If errors exist, stop the request and return a 400 Bad Request
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array().map(err => ({
        field: err.path, // The field that caused the error (e.g., 'email')
        message: err.msg // The error message we define
      }))
    });
  }
  
  // If no errors, pass control to the next middleware or controller
  next();
};

module.exports = validateRequest;