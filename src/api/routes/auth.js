const express = require('express');
const {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} = require('../controllers/auth');

const router = express.Router();

router.route('/register').post(registerController);
router.route('/login').post(loginController);
router.route('/forgot-password').post(forgotPasswordController);
router.route('/reset-password/:email/:token').patch(resetPasswordController);

module.exports = router;
