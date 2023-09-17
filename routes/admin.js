const express = require('express');
const router = express.Router();
const connectToMongoDB = require('../models/usersdb');
const ObjectId = require('mongodb').ObjectId;
// Render the admin dashboard page
router.get('/',async (req, res) => {
  if (req.session.admin) {
    try {
        const client = await connectToMongoDB();
        const db = client.db();
        const usersCollection = db.collection('users');
        const users = await usersCollection.find().toArray();

        // Render the EJS template with user data
      
        res.render('admin', { title: 'Admin Dashboard' ,'users': users });
        client.close();
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from MongoDB' });
    }
    // Admin is authenticated, render the admin dashboard

  } else {
    // Admin is not authenticated, redirect to the login page
    res.redirect('/adminlogin');
  }
});

module.exports = router;
