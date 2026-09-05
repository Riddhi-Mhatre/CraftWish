const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order', // Reference to Order collection
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User collection
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative']
    },
    status: {
      type: String,
      enum: ['Success', 'Failed', 'Pending'],
      default: 'Pending'
    },
    transactionId: {
      type: String,
      required: true,
      unique: true // Ensure uniqueness of transactions
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
