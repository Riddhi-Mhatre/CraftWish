const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Helper function to generate JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

/**
 * Register a new user
 */
const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // 1. Check if user already exists in MongoDB
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists with this email');
  }

  // 2. Create new user. 
  // Note: Password hashing is handled automatically by the Model's pre-save hook!
  const user = await User.create({
    name,
    email,
    password,
  });

  // 3. Return user data and token
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
};

/**
 * Login user
 */
const loginUser = async (email, password) => {
  // 1. Find user by email
  // We must explicitly select the password because we set { select: false } in the schema
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 2. Use the instance method we created in the user model to verify the password
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // 3. Return user data and token
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };
};

module.exports = {
  registerUser,
  loginUser
};