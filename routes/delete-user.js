const express = require('express');
const router = express.Router();
const connectToMongoDB = require('../models/usersdb');
const ObjectId = require('mongodb').ObjectId;

router.post('/:id', async (req, res) => {
    if (req.session.admin) {
    try {
        const userId = req.params.id;
        const client = await connectToMongoDB();
        const db = client.db();
        const usersCollection = db.collection('users');

        // Delete the user by _id
        const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

        // Close the MongoDB connection
        client.close();

        // Check if the operation was acknowledged and a document was deleted
        if (result.deletedCount === 1) {
            // Redirect back to the user list page or show a success message
            res.redirect('/admin');
        } else {
            // Log the error for debugging
            res.status(500).json({ error: 'Error deleting user' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user from MongoDB' });
    }
    }
    else{
         res.redirect('/adminlogin');
    }

});

module.exports = router;
