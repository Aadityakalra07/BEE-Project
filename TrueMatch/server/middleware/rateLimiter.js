// =============================================
// RATE LIMITING MIDDLEWARE
// Security: Prevents brute-force & DDoS attacks
// =============================================
// Uses express-rate-limit to throttle requests.
// Separate limits for auth routes (strict) and
// general API routes (lenient).

const rateLimit = require('express-rate-limit');

// ─── Auth Rate Limiter ───────────────────────
// Strict limit: 10 requests per minute per IP
// Applies to /api/auth/* (login, register, etc.)
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 10,                  // 10 requests per window
  message: {
    message: 'Too many authentication attempts. Please try again after 1 minute.',
  },
  standardHeaders: true,    // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,     // Disable `X-RateLimit-*` headers
});

// ─── General API Rate Limiter ────────────────
// Lenient limit: 100 requests per minute per IP
// Applies to all /api/* routes
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 100,                 // 100 requests per window
  message: {
    message: 'Too many requests from this IP. Please try again after 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
