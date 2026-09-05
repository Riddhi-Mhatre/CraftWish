const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true, 
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: ''
    },
    // NEW: We are now storing an image URL for the category
    image: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model('Category', categorySchema);