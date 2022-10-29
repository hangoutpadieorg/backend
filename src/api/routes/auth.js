const express = require('express');
const {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  changePassword,
} = require('../controllers/auth');
const { vendorsReg } = require('../middlewares/utils');

const router = express.Router();

router.route('/users/register').post(registerController);
router.route('/vendors/register').post(vendorsReg, registerController);
router.route('/login').post(loginController);
router.route('/forgot-password').post(forgotPasswordController);
router.route('/reset-password/:email/:token').patch(resetPasswordController);
router.route('/change-password').patch(changePassword);

module.exports = router;
