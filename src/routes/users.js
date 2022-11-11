const express = require('express');
const { signUp, signIn, activateAccount,signOut,forgotPassword,resetPassword,changePassword } = require('../constroller/users')
const {isAuthenticated,isAuthorized} = require('../middleware/isAuth')

const router = express.Router();

router.post('/users/register', );
router.post('/signUp', signUp)
router.post('/signIn', signIn);
router.post('/activateAccount', activateAccount);
router.post('/signOut',isAuthenticated,isAuthorized, signOut)
router.post('/forgotPassword',isAuthenticated,isAuthorized, forgotPassword)
router.patch('/resetPassword', resetPassword);
router.patch('/changePassword',isAuthenticated,isAuthorized, changePassword)


module.exports = router;