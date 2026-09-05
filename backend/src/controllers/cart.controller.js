// backend/src/controllers/cart.controller.js
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Get User's Cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], totalAmount: 0 });
    }
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

// Add Item to Cart with Personalization
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, personalization } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item exists with EXACT same personalization
    const existingItemIndex = cart.items.findIndex(item => {
      if (item.product.toString() !== productId) return false;
      // Simple serialization comparison for personalization nested doc
      return JSON.stringify(item.personalization) === JSON.stringify(personalization);
    });

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        personalization
      });
    }

    await cart.save();
    // Populate before sending back to frontend
    await cart.populate('items.product');
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

// Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    await cart.save();
    await cart.populate('items.product');
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};