// backend/src/models/cart.model.js
const mongoose = require('mongoose');

// Phase 6: Personalization Schema (Nested Document)
const personalizationSchema = new mongoose.Schema({
  customName: { type: String, trim: true },
  giftMessage: { type: String, trim: true },
  font: { type: String },
  fontColor: { type: String },
  imageUrl: { type: String },
  giftWrap: { type: Boolean, default: false }
}, { _id: false }); // _id is false because this is just a sub-document

// Phase 7: Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to Product collection
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true // Capturing price at the time of adding to cart
  },
  personalization: personalizationSchema // Embedding Phase 6 schema
});

// Phase 7: Main Cart Schema
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User collection
    required: true,
    unique: true // One cart per user
  },
  items: [cartItemSchema], // Array of nested cart items
  totalAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Pre-save hook to automatically calculate the total amount
// Pre-save hook to automatically calculate the total amount
cartSchema.pre('save', function() {
  this.totalAmount = this.items.reduce((total, item) => {
    // Add ₹250 if gift wrap is selected
    const giftWrapPrice = item.personalization?.giftWrap ? 250 : 0;
    return total + ((item.price + giftWrapPrice) * item.quantity);
  }, 0);
});

module.exports = mongoose.model('Cart', cartSchema);