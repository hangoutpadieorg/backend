const express = require('express');
const { registerController } = require('../controllers/auth');

const router = express.Router();

router.route('/register').post(registerController);

module.exports = router;
