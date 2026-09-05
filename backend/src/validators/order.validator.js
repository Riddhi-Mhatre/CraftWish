const { body } = require('express-validator');

const orderValidator = [
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('Zip Code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
  
  body('paymentMethod')
    .trim()
    .notEmpty().withMessage('Payment method is required')
    .isIn(['Credit Card', 'PayPal', 'Stripe', 'Cash on Delivery']).withMessage('Invalid payment method')
];

const updateOrderStatusValidator = [
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).withMessage('Invalid order status')
];

module.exports = {
  orderValidator,
  updateOrderStatusValidator
};
