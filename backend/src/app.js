const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');

// 1. Import Route Files
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const orderRoutes = require('./routes/order.routes');
const reviewRoutes = require('./routes/review.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors({
  origin: env.clientUrl,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CraftWish API is running smoothly',
    environment: env.nodeEnv
  });
});

// 2. Mount Modular Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes); // Categories mounted here!
app.use('/api/products', productRoutes); // Products mounted here!
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products/:productId/reviews', reviewRoutes);
app.use('/api/reports', reportRoutes);
// We will add our centralized error handling middleware here later

module.exports = app;