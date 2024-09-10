const mongoose = require('mongoose');
const { DB_URL } = require('../config'); // Ensure DB_URL uses the correct MongoDB URL format

module.exports = async () => {
  try {
    // Connect to MongoDB without deprecated options
    await mongoose.connect(DB_URL);
    console.log('Database connection successful!');
    
    // Listen for disconnection events
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose connection is disconnected');
    });
    
  } catch (error) {
    console.error('Database connection error:', error.message);
    
    // Optional: Attempt reconnection logic or handle specific cases
    process.exit(1); // Exit the process on failure
  }

  // Optional: Handling termination signals (graceful shutdown)
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection is closed due to app termination');
    process.exit(0);
  });
};
