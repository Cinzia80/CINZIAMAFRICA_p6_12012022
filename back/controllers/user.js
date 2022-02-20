//--------------------------//
// Import security packages //
//--------------------------//
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
//--------------//
// Import model //
//--------------//
const User = require('../models/user');
//------------------//
// Exports signup   //
// Create new user  //
//------------------//
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() =>
          res.status(201).json({ message: 'User created successfully.' })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
//---------------//
// Exports login //
//---------------//
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'User not found.' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Incorrect password.' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.KEY, {
              expiresIn: '24h',
            }),
          });
        })
        .catch((error) => {
            console.log(error)
            return res.status(500).json({ 'error1': error });
        });
    })
    .catch((error) => res.status(500).json({ 'error2': error }));
};
