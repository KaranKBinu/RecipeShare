const express = require('express');
const router = express.Router();

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/userlogin');
// }
// route to check the MongoDB connection
router.get('/', (req, res) => {
  res.render('index',{ authenticated: req.isAuthenticated() });
});

module.exports = router;
