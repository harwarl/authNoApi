const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth')

router
.route('/signup')
.get(authController.getSignUp)
.post(authController.postSignUp);

router
.route('/login')
.get(authController.getLogin)
.post(authController.postLogin);

router
.route('/reset')
.get(authController.getReset)
.post(authController.postReset);

router.get('/reset/:token', authController.getNewPassword)
router.post('/newpassword', authController.postNewPassword);
router.post('/logout', authController.postLogout);

module.exports = router;