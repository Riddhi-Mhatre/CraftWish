const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Review = require('../models/review.model');

// 1. Monthly Sales Report
exports.getMonthlySales = async () => {
  return await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalSales: { $sum: "$totalAmount" },
        ordersCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// 2. Revenue by Category
exports.getRevenueByCategory = async () => {
  return await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productData"
      }
    },
    { $unwind: "$productData" },
    {
      $lookup: {
        from: "categories",
        localField: "productData.category",
        foreignField: "_id",
        as: "categoryData"
      }
    },
    { $unwind: "$categoryData" },
    {
      $group: {
        _id: "$categoryData.name",
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
      }
    },
    { $sort: { revenue: -1 } }
  ]);
};

// 3. Best Selling Products
exports.getBestSellingProducts = async () => {
  return await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $project: {
        name: "$product.name",
        totalSold: 1,
        revenue: 1
      }
    }
  ]);
};

// 4. Top Customers
exports.getTopCustomers = async () => {
  return await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    {
      $group: {
        _id: "$user",
        totalSpent: { $sum: "$totalAmount" },
        ordersCount: { $sum: 1 }
      }
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        name: "$user.name",
        email: "$user.email",
        totalSpent: 1,
        ordersCount: 1
      }
    }
  ]);
};

// 5. Average Product Rating
exports.getAverageProductRating = async () => {
  return await Review.aggregate([
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 }
      }
    },
    { $match: { reviewCount: { $gt: 0 } } },
    { $sort: { averageRating: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $project: {
        name: "$product.name",
        averageRating: { $round: ["$averageRating", 1] },
        reviewCount: 1
      }
    }
  ]);
};

// 6. Low Stock Products
exports.getLowStockProducts = async () => {
  return await Product.aggregate([
    { $match: { stock: { $lte: 10 } } }, // Threshold of 10 items
    { $sort: { stock: 1 } },
    { $limit: 10 },
    {
      $project: {
        name: 1,
        stock: 1,
        price: 1
      }
    }
  ]);
};
