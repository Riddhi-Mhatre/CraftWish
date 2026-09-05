const authService = require('../services/auth.service');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    // 1. Pass the incoming request body to our Service Layer
    const userData = await authService.registerUser(req.body);
    
    // 2. Format and send a consistent JSON response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userData
    });
  } catch (error) {
    // We catch errors thrown by the Service Layer (e.g., 'User already exists')
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Pass credentials to the Service Layer
    const userData = await authService.loginUser(email, password);

    // 2. Send successful response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userData
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};