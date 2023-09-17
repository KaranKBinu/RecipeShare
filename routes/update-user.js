const express = require('express');
const router = express.Router();
const connectToMongoDB = require('../models/usersdb');
const { authenticate } = require('passport');
const ObjectId = require('mongodb').ObjectId;

router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const client = await connectToMongoDB();
        const db = client.db();
        const usersCollection = db.collection('users');

        // Retrieve the user by _id
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        // Close the MongoDB connection
        client.close();
        authenticated = req.isAuthenticated();
        // Render an update user form with the retrieved user data
        res.render('update-user', { user , title:'Update user',authenticated});
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving user data for update' });
    }
});

router.post('/:id', async (req, res) => {
    if (req.session.admin) {
    try {
        const userId = req.params.id;
        const client = await connectToMongoDB();
        const db = client.db();
        const usersCollection = db.collection('users');

        // Extract updated user data from the POST request
        const { username, email,password,phone_number, } = req.body;
        // Update the user's information in the database
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { username, email,password,phone_number, } }
        );

        // Close the MongoDB connection
        client.close();

        // Check if the operation was acknowledged and a document was updated
        if (result.modifiedCount === 1) {
            // Redirect back to the user list page or show a success message
            res.redirect('/admin');
        } else {
            // If no document was updated, consider it an error
            res.status(500).json({ error: 'Error updating user data' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating user data in MongoDB' });
    }
    }
    else{
         res.redirect('/adminlogin');
    }

});

module.exports = router;
