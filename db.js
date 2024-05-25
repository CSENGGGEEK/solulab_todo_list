// db.js

// Import necessary modules and configurations
const { mongoURI, dbName } = require('./config'); // Replace with your MongoDB connection string and database name
const mongoose = require('mongoose');

// Function to establish a connection to MongoDB
async function getConnection() {
  try {
    // Create a connection using mongoose with the provided connection URI
    const conn = await mongoose.createConnection(mongoURI);

    // Await the 'connected' event to ensure the connection is fully established
    await new Promise((resolve, reject) => {
      conn.once('connected', resolve); // Resolve promise when connection is established
      conn.on('error', reject); // Reject promise if there's an error
    });

    return conn; // Return the connection object
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Re-throw the error for proper handling
  }
}

// Function to create a collection within the connected database
async function createCollection(model) {
  try {
    const conn = await getConnection(); // Get connection to MongoDB

    
    // Create the collection using the provided model
    await conn.db.createCollection(model.collection.name);

  } catch (error) {
    console.error("Error creating collection:", error);
  }
}


// Export functions to be used in other modules
module.exports = {
  getConnection, // Export function to get a connection to MongoDB
  createCollection // Export function to create a collection within the connected database
};