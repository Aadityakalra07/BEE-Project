// =============================================
// CUSTOM LOGGER MIDDLEWARE
// Syllabus: Application-level Middleware
// =============================================
// This is a custom middleware that logs every
// incoming request with method, URL, and timestamp.
// Middleware runs BEFORE the route handler.

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;       // GET, POST, PUT, DELETE
  const url = req.originalUrl;     // The requested URL path

  console.log(`[${timestamp}] ${method} ${url}`);

  // IMPORTANT: Always call next() to pass control
  // to the next middleware or route handler
  next();
};

module.exports = logger;
