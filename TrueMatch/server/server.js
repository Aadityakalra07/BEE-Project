// =============================================
//  TRUEMATCH - SERVER ENTRY POINT
// =============================================
// MVC Architecture:
//   Model      → models/       (data layer - Mongoose schemas)
//   View       → client/       (presentation layer - React SPA)
//   Controller → controllers/  (business logic layer)
//
// This file is responsible ONLY for:
//   1. Connecting to the database
//   2. Starting the HTTP server
//
// App configuration lives in app.js (separation of concerns)
// =============================================

const connectDB = require('./config/db');
const app = require('./app');

// =============================================
// CONNECT TO DATABASE (Model layer initialization)
// =============================================
connectDB();

// =============================================
// START SERVER
// Syllabus: Client-Server Architecture
// =============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`  TrueMatch Server running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Architecture: MVC (Model-View-Controller)`);
  console.log(`  API: http://localhost:${PORT}/api`);
  console.log(`  Static Page: http://localhost:${PORT}/static-page`);
  console.log(`  Security: Helmet, Rate-Limit, MongoSanitize, XSS`);
  console.log('='.repeat(50));
});
