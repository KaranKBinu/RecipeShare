const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://localhost:27017/admindb";// MongoDB connection URI, change the database name if necessary

// Create a function to connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = connectToMongoDB;
