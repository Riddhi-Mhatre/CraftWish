const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  isPrimary: { type: Boolean, default: false }
}, { _id: false });

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'Size', 'Color'
  options: [{ type: String, required: true }] // e.g., ['S', 'M', 'L']
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    sku: {
      type: String,
      required: [true, 'Please provide a SKU'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a description']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Reference to Category collection
      required: [true, 'Please assign a category']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: [imageSchema], // Embedded array of images
    variants: [variantSchema], // Embedded array of variants
    isCustomizable: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Advanced Indexing
// 1. Text Index on name and description for fast search functionality
productSchema.index({ name: 'text', description: 'text' });
// 2. Compound Index on category and price for fast filtering/sorting
productSchema.index({ category: 1, price: 1 });
// 3. Single index on price for sorting all products by price
productSchema.index({ price: 1 });
module.exports = mongoose.model('Product', productSchema);
