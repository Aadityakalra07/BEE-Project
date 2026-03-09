// =============================================
// DATABASE CONFIGURATION
// Syllabus: Modules and NPM, File dependency
// =============================================
// This file connects our Node.js server to MongoDB
// using Mongoose (an ODM - Object Document Mapper)

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
