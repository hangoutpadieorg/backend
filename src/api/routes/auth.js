const express = require('express');
const {
  registerController,
  forgotPasswordController,
} = require('../controllers/auth');

const router = express.Router();

router.route('/register').post(registerController);
router.route('/forgot-password').post(forgotPasswordController);

module.exports = router;
