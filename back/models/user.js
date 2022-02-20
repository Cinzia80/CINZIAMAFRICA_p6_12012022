//-----------------//
// Import mongoose //
//-----------------//
const mongoose = require('mongoose');
//----------------//
// Import plugin //
//----------------//
const uniqueValidator = require('mongoose-unique-validator');
//------------------------//
// Creation of the schema //
//------------------------//
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
//----------------//
// Calling plugin //
//----------------//
userSchema.plugin(uniqueValidator);
//---------------//
// Exports model //
//---------------//
module.exports = mongoose.model('User', userSchema);
