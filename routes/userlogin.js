const express = require('express');
const router = express.Router();
const connectToMongoDB = require('../models/usersdb');

// Render the login page
router.get('/', (req, res) => {
  res.render('userlogin', { title: 'Login', errorMessage: req.query.errorMessage, successMessage: req.query.successMessage , authenticated: req.isAuthenticated() });
});

// Handle login form submission
router.post('/', async (req, res) => {
  const { username, password } = req.body; // Assuming you have username and password fields

  try {
    // Check user credentials in your MongoDB
    const client = await connectToMongoDB();
    const db = client.db();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ username, password });

    if (user) {
      // Set user information in the session (assuming you're using Passport.js for session management)
      req.login(user, (err) => {
        if (err) {
          return res.redirect('/userlogin?errorMessage=Login%20failed');
        }
        return res.redirect('/?successMessage=Login%20successful');
      });
    } else {
      // Set error message and redirect to '/userlogin'
      res.redirect('/userlogin?errorMessage=Invalid%20username%20or%20password');
    }

    // Close the MongoDB connection when done.
    client.close();
  } catch (error) {
    // Handles errors here
    res.status(500).json({ success: false, errorMessage: 'Internal Server Error' });
  }
});

module.exports = router;
