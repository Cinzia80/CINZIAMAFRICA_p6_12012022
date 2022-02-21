//----------------//
// Import express //
// Create router  //
//----------------//
const express = require('express');
const router = express.Router();
//----------------//
// Import limiter //
//----------------//
const limiter = require('../middleware/limiter');
//-------------------//
// Import controller //
//-------------------//
const userCtrl = require('../controllers/user');
//---------------//
// Create routes //
//---------------//
router.post('/signup', userCtrl.signup);
router.post('/login', limiter.loginLimiter, userCtrl.login);
//----------------//
// Exports router //
//----------------//
module.exports = router;
