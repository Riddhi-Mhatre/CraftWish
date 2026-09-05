const Product = require('../models/product.model');

const createProduct = async (data) => {
  const skuExists = await Product.findOne({ sku: data.sku });
  if (skuExists) {
    throw new Error('Product with this SKU already exists');
  }
  return await Product.create(data);
};

const getProducts = async (query = {}) => {
  const filter = {};
  
  // 1. Handle Category Filtering
  if (query.category) {
    filter.category = query.category;
  }
  
  // 2. Handle Text Search (Changed to Regex for partial matching)
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } }
    ];
  }

  // Handle pagination
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .populate('category', 'name') // Pull in the category name via referencing
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Product.countDocuments(filter);

  return {
    products,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

const getProductById = async (id) => {
  const product = await Product.findById(id).populate('category', 'name');
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).populate('category', 'name');
  
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
