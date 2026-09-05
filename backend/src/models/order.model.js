const mongoose = require('mongoose');

// Phase 6: Personalization Schema (Nested Document - mirrored from Cart)
const personalizationSchema = new mongoose.Schema({
  customName: { type: String, trim: true },
  giftMessage: { type: String, trim: true },
  font: { type: String },
  fontColor: { type: String },
  imageUrl: { type: String },
  giftWrap: { type: Boolean, default: false }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to Product collection
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1']
  },
  price: {
    type: Number,
    required: true // Capturing price at the time of order creation
  },
  personalization: personalizationSchema // Embedding personalization
}, { _id: false });

// Embedding shipping address
const shippingAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' }
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User collection
      required: true
    },
    items: [orderItemSchema], // Array of nested order items
    shippingAddress: {
      type: shippingAddressSchema,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Credit Card', 'PayPal', 'Stripe']
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

// Advanced Indexing for Orders
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
