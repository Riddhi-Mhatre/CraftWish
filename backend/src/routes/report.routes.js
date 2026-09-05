const express = require('express');
const { getDashboardReports } = require('../controllers/report.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Only admins should have access to dashboard reports
router.route('/').get(protect, admin, getDashboardReports);

module.exports = router;
