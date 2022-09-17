const express = require('express');
const {
  registerController,
  forgotPasswordController,
  resetPasswordController,
} = require('../controllers/auth');

const router = express.Router();

router.route('/register').post(registerController);
router.route('/forgot-password').post(forgotPasswordController);
router.route('/reset-password/:email/:token').patch(resetPasswordController);

module.exports = router;
