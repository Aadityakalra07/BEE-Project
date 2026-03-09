// =============================================
// DATABASE CONFIGURATION
// Syllabus: Modules and NPM, File dependency
// =============================================
// This file connects our Node.js server to MongoDB
// using Mongoose (an ODM - Object Document Mapper)

const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 10;
  const retryDelay = 5000; // 5 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return; // success — exit the loop
    } catch (error) {
      console.error(`Database Connection Error (attempt ${attempt}/${maxRetries}): ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000}s...`);
        await new Promise((r) => setTimeout(r, retryDelay));
      } else {
        console.error('All connection attempts failed. Exiting.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
