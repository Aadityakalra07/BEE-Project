// =============================================
// ERROR HANDLING MIDDLEWARE
// Syllabus: Error-handling Middleware
// =============================================
// Express error-handling middleware has 4 parameters:
// (err, req, res, next). This catches any errors
// thrown in our routes and sends a clean JSON response.

// Handle 404 - Route Not Found
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass error to the error handler below
};

// Global Error Handler
// This catches ALL errors in the application
const errorHandler = (err, req, res, next) => {
  // If status is 200 (default), change to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Show stack trace only in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
