//----------------//
// Import express //
// Create router  //
//----------------//
const express = require('express');
const router = express.Router();
//-------------------------//
// Import authentification //
//-------------------------//
const auth = require('../middleware/auth');
//-------------------//
// Import controller //
//-------------------//
const sauceCtrl = require('../controllers/sauce');
//---------------//
// Import multer //
//---------------//
const multer = require('../middleware/multer-config');
//--------//
//  CRUD  //
//--------//
// Create //
// Read   //
// Update //
// Delete //
//--------//
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.readSauce);
router.put('/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//-----------------//
// Read all Sauces //
//-----------------//
router.get('/', auth, sauceCtrl.readAllSauces);
//-----------------//
// Like or Dislike //
//-----------------//
router.post('/:id/like', auth, sauceCtrl.likeDislike);
//----------------//
// Exports router //
//----------------//
module.exports = router;
