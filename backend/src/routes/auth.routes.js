const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// 1. Run validation rules -> 2. Check for errors -> 3. Execute controller
router.post('/register', registerValidator, validateRequest, register);

router.post('/login', loginValidator, validateRequest, login);

module.exports = router;