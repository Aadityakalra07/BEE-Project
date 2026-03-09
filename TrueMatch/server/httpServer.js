// =============================================
// NODE HTTP MODULE SERVER (BASIC EXAMPLE)
// Syllabus: Node HTTP Module, Creating Endpoints
// =============================================
// This file demonstrates creating a server using
// Node.js built-in HTTP module (WITHOUT Express).
// Run this separately: node httpServer.js

const http = require('http');

// Create server using Node's built-in http module
const server = http.createServer((req, res) => {
  // Set response headers
  res.setHeader('Content-Type', 'application/json');

  // Simple routing using if-else (no Express)
  if (req.url === '/' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      message: 'Welcome to TrueMatch API (HTTP Module)',
      server: 'Node.js HTTP Module Server',
    }));
  } else if (req.url === '/about' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      name: 'TrueMatch',
      description: 'Online Matrimonial Platform',
      version: '1.0.0',
    }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP Module Server running on http://localhost:${PORT}`);
  console.log('This is a basic server without Express.');
  console.log('Press Ctrl+C to stop.');
});
