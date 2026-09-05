const Wishlist = require('../models/wishlist.model');

// Get User's Wishlist
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

// Toggle Product in Wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const productIndex = wishlist.products.indexOf(productId);
    
    // If it exists in the array, remove it. If not, add it.
    if (productIndex > -1) {
      wishlist.products.splice(productIndex, 1);
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating wishlist' });
  }
};