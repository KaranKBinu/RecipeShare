const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const connectToAdminDB = require('../models/admindb'); // Import the admin database model


// Render the admin login page
router.get('/', (req, res) => {
  res.render('adminlogin', { title: 'Admin Login', errorMessage: req.query.errorMessage });
});

// Handle admin login form submission
router.post('/', async (req, res) => {
  
  const { username, password } = req.body;

  const client = await connectToAdminDB(); // Use the admin database model to connect

  try {
    const db = client.db();
    const adminCollection = db.collection('admins');
    const admin = await adminCollection.findOne({ username });

    if (!admin) {
      return res.redirect('/adminlogin?errorMessage=Invalid%20username%20or%20password');
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (passwordMatch) {
      // Set admin information in the session 
      req.session.admin = admin; // Assuming 'admin' is the user object

      // Redirect to the admin dashboard
      return res.redirect('/admin');
    } else {
      return res.redirect('/adminlogin?errorMessage=Invalid%20username%20or%20password');
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    return res.status(500).json({ success: false, errorMessage: 'Internal Server Error' });
  } finally {
    client.close();
  }
});

module.exports = router;
