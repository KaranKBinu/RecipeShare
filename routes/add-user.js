
const express = require('express');
const router = express.Router();
const connectToMongoDB = require('../models/usersdb');

router.get('/', (req, res) => {
    if (req.session.admin) {
    res.render('add-user', { title: 'Add User', errorMessage: req.query.errorMessage, successMessage: req.query.successMessage });
    }
    else{
         res.redirect('/adminlogin');
    }
});

router.post('/', async (req, res) => {
    const { username, password, confirmPassword, phone_number, email } = req.body;

    try {
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.redirect('/admin/add-user?errorMessage=Passwords%20do%20not%20match');
        }
        if (phone_number.length !== 10){
            return res.redirect('/admin/add-user?errorMessage=Phonenumber%20should%20have%20ten%20deigits');
        }
        // Check user credentials in your MongoDB
        const client = await connectToMongoDB();
        const db = client.db();
        const usersCollection = db.collection('users');
        
        // Check if the username or email already exists
        const existingUser = await usersCollection.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.redirect('/admin/add-user?errorMessage=Username%20or%20email%20already%20exists');
        }

        // Insert the new user into the database
        await usersCollection.insertOne({ username, password, phone_number, email });

        // Set success message and redirect to login page
        res.redirect('/admin?successMessage=Sign%20up%20successful');

        // Close the MongoDB connection when done.
        client.close();
    } catch (error) {
        // Handle errors here
        res.status(500).json({ success: false, errorMessage: 'Internal Server Error' });
    }
});

module.exports = router;
