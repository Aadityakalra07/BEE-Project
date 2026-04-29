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
const helmet = require('helmet');        // Security: HTTP headers
const mongoSanitize = require('express-mongo-sanitize'); // Security: NoSQL injection
const xss = require('xss-clean');        // Security: XSS attack prevention

// --- Import our custom modules ---
const connectDB = require('./config/db');
const logger = require('./middleware/loggerMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { serveStaticPage } = require('./utils/fileStreamExample');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');

// --- Import route files ---
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const interestRoutes = require('./routes/interestRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');

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
// SECURITY MIDDLEWARE (must be first)
// =============================================

// 1. Helmet - Sets various HTTP security headers
//    Protects against clickjacking, XSS, MIME sniffing, etc.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow serving uploads cross-origin
}));

// =============================================
// THIRD-PARTY MIDDLEWARE
// Syllabus: Third-party Middleware
// =============================================

// 2. CORS - Allow cross-origin requests (whitelisted origins only)
const allowedOrigins = [
  'http://localhost:3000',   // Vite dev server
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,    // Production frontend URL (from .env)
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies for future refresh token support
}));

// 3. Morgan - HTTP request logger (logs to console)
app.use(morgan('dev'));

// =============================================
// BUILT-IN MIDDLEWARE
// =============================================

// Parse JSON request bodies (with 1MB size limit)
app.use(express.json({ limit: '1mb' }));

// Parse URL-encoded form data (with 1MB size limit)
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// =============================================
// DATA SANITIZATION MIDDLEWARE
// Must come AFTER body parsers, BEFORE routes
// =============================================

// 4. Mongo Sanitize - Prevents NoSQL injection attacks
//    Removes $ and . from req.body, req.query, req.params
//    Example attack blocked: { "email": { "$gt": "" } }
app.use(mongoSanitize());

// 5. XSS Clean - Sanitizes user input to prevent XSS attacks
//    Converts malicious HTML/JS in input to safe strings
//    Example attack blocked: <script>alert('hacked')</script>
app.use(xss());

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
// RATE LIMITING
// Apply general API limiter to all /api routes
// Auth limiter is applied per-route in authRoutes.js
// =============================================
app.use('/api', apiLimiter);

// =============================================
// API ROUTES
// Syllabus: Routing, Route Methods, Route Paths
// =============================================

// Auth routes (register, login) — has additional strict rate limiter
app.use('/api/auth', authRoutes);

// Profile routes (CRUD, search, admin)
app.use('/api/profile', profileRoutes);

// Interest routes (send, accept, reject)
app.use('/api/interest', interestRoutes);

// Message routes (chat, conversations)
app.use('/api/messages', messageRoutes);

// Admin routes (analytics, verification, management)
app.use('/api/admin', adminRoutes);

// Settings routes (privacy, notifications, account)
const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/settings', settingsRoutes);

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
  console.log(`  Security: Helmet, Rate-Limit, MongoSanitize, XSS`);
  console.log('='.repeat(50));
});
