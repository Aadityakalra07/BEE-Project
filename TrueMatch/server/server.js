// =============================================
//  TRUEMATCH - MAIN EXPRESS SERVER
// =============================================
// This is the main entry point of our backend.
// It demonstrates ALL syllabus concepts:
// 1. Express.js Framework
// 2. Middleware (Application, Router, Error, Third-party)
// 3. Routing
// 4. Static file serving
// 5. File streaming
// 6. Environment setup
// =============================================

// --- Load environment variables (from .env file) ---
const dotenv = require('dotenv');
dotenv.config();

// --- Import required modules (Modules & NPM) ---
const express = require('express');      // Express framework
const cors = require('cors');            // Third-party middleware: CORS
const morgan = require('morgan');        // Third-party middleware: HTTP logger
const path = require('path');            // Node built-in: path module

// --- Import our custom modules ---
const connectDB = require('./config/db');
const logger = require('./middleware/loggerMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { serveStaticPage } = require('./utils/fileStreamExample');

// --- Import route files ---
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const interestRoutes = require('./routes/interestRoutes');

// =============================================
// CONNECT TO DATABASE
// =============================================
connectDB();

// =============================================
// CREATE EXPRESS APPLICATION
// Syllabus: Express.js Framework
// =============================================
const app = express();

// =============================================
// THIRD-PARTY MIDDLEWARE
// Syllabus: Third-party Middleware
// =============================================

// 1. CORS - Allow cross-origin requests (frontend on different port)
app.use(cors());

// 2. Morgan - HTTP request logger (logs to console)
app.use(morgan('dev'));

// =============================================
// BUILT-IN MIDDLEWARE
// =============================================

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// =============================================
// APPLICATION-LEVEL MIDDLEWARE
// Syllabus: Application-level Middleware
// =============================================

// Our custom logger middleware (runs on every request)
app.use(logger);

// =============================================
// SERVING STATIC FILES
// Syllabus: Serving Static Files, express.static
// =============================================

// Serve uploaded images as static files
// URL: http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve public folder as static
app.use(express.static(path.join(__dirname, 'public')));

// =============================================
// API ROUTES
// Syllabus: Routing, Route Methods, Route Paths
// =============================================

// Auth routes (register, login)
app.use('/api/auth', authRoutes);

// Profile routes (CRUD, search, admin)
app.use('/api/profile', profileRoutes);

// Interest routes (send, accept, reject)
app.use('/api/interest', interestRoutes);

// =============================================
// FILE STREAM ROUTE
// Syllabus: File Handling, File Stream
// =============================================

// Serve static HTML page using file stream (fs.createReadStream)
app.get('/static-page', serveStaticPage);

// =============================================
// ROOT ROUTE
// =============================================
app.get('/api', (req, res) => {
  // Syllabus: Response Methods
  res.status(200).json({
    message: 'Welcome to TrueMatch API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      interest: '/api/interest',
    },
  });
});

// =============================================
// ERROR HANDLING MIDDLEWARE
// Syllabus: Error-handling Middleware
// Must be LAST (after all routes)
// =============================================
app.use(notFound);     // Handle 404 errors
app.use(errorHandler); // Handle all other errors

// =============================================
// START SERVER
// Syllabus: Client-Server Architecture
// =============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`  TrueMatch Server running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  API: http://localhost:${PORT}/api`);
  console.log(`  Static Page: http://localhost:${PORT}/static-page`);
  console.log('='.repeat(50));
});
