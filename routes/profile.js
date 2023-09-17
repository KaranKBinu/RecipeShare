const express = require('express');
const router = express.Router();
const connectToMongoDB = require('../models/usersdb');
// Configure the Facebook OAuth strategy
const passport = require('passport');
require('../config/googleAuth')(passport);
require('../config/facebookAuth')(passport);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/userlogin');
}



router.get('/', ensureAuthenticated, (req, res) => {
  // Access the user's details from req.user
  const user = req.user;
  // Render the profile page and pass the user's details to the template
  res.render('profile', { user ,authenticated: req.isAuthenticated()});
});


module.exports = router;