const Category = require('../models/category.model');

/**
 * Create a new category
 */
const createCategory = async (data) => {
  // Prevent duplicate category names
  const categoryExists = await Category.findOne({ name: data.name });
  if (categoryExists) {
    throw new Error('Category already exists');
  }
  return await Category.create(data);
};

/**
 * Get all categories
 */
const getAllCategories = async () => {
  // Retrieve all categories, sorted by newest first
  return await Category.find({}).sort({ createdAt: -1 });
};

/**
 * Get a single category by ID
 */
const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

/**
 * Update a category
 */
const updateCategory = async (id, data) => {
  // Find by ID and update. 
  // 'new: true' returns the updated document instead of the old one
  // 'runValidators: true' ensures our schema rules (like maxlength) are checked during update
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
  
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

/**
 * Delete a category
 */
const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};