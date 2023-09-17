const express = require('express');
const router = express.Router();
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/userlogin');
}
router.get('/',ensureAuthenticated, (req, res) => {
    res.render('contact', { title: 'Contact Us' ,authenticated: req.isAuthenticated()});
});

module.exports = router;
