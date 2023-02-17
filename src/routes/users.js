const express = require('express');
const { signUp, signIn, activateAccount,signOut,forgotPassword,resetPassword,changePassword,getAllUsers, mailtest } = require('../constroller/users')
const {isAuthenticated,isAuthorized} = require('../middleware/isAuth')

const router = express.Router();

router.post('/users/register', );
router.post('/signUp', signUp)
router.post('/signIn', signIn);
router.post('/getAllUsers', getAllUsers);
router.post('/activateAccount', activateAccount);
router.delete('/signOut',isAuthenticated,isAuthorized, signOut)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword', resetPassword);
router.patch('/changePassword', isAuthenticated, isAuthorized, changePassword);
router.post('/mail', mailtest)


module.exports = router;