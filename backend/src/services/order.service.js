const Order = require('../models/order.model');
const Payment = require('../models/payment.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const crypto = require('crypto');

exports.createOrderTransaction = async (userId, checkoutData) => {
  const { shippingAddress, paymentMethod } = checkoutData;
  
  // Note: We have removed the strict Mongoose session wrappers here 
  // because local MongoDB standalone instances do not support transactions.
  // In a production replica set (e.g., MongoDB Atlas), you would wrap this in:
  // const session = await mongoose.startSession(); session.startTransaction();

  // 1. Get Cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  // 2. Reduce Stock for each product
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }
    product.stock -= item.quantity;
    await product.save();
  }

  // 3. Create Order
  const orderItems = cart.items.map(item => ({
    product: item.product,
    quantity: item.quantity,
    price: item.price,
    personalization: item.personalization
  }));

  const order = new Order({
    user: userId,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount: cart.totalAmount,
    status: 'Pending'
  });
  await order.save();

  // 4. Create Payment (Mocking a successful payment gateway response)
  const payment = new Payment({
    order: order._id,
    user: userId,
    amount: cart.totalAmount,
    status: 'Success',
    transactionId: crypto.randomBytes(16).toString('hex')
  });
  await payment.save();

  // 5. Clear Cart
  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  return order;
};

exports.getOrdersByUser = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.product');
};

exports.getAllOrders = async () => {
  return await Order.find().sort({ createdAt: -1 }).populate('items.product').populate('user', 'name email');
};

exports.getOrderById = async (orderId) => {
  return await Order.findById(orderId).populate('items.product').populate('user', 'name email');
};

exports.updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  order.status = status;
  await order.save();
  return order;
};