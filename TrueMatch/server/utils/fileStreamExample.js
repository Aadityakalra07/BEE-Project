// =============================================
// FILE STREAM EXAMPLE
// Syllabus: File Handling Module, File Stream
// =============================================
// This demonstrates how to serve a static HTML page
// using Node.js file streams (fs.createReadStream).
// This is an alternative to express.static().

const fs = require('fs');
const path = require('path');

// Function to serve a static HTML file using file stream
const serveStaticPage = (req, res) => {
  const filePath = path.join(__dirname, '..', 'public', 'index.html');

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: 'Static page not found' });
    return;
  }

  // Set content type header
  res.setHeader('Content-Type', 'text/html');

  // Create a read stream and pipe it to response
  // This is memory-efficient for large files
  const readStream = fs.createReadStream(filePath);

  // Handle errors during streaming
  readStream.on('error', (error) => {
    res.status(500).json({ message: 'Error reading file', error: error.message });
  });

  // Pipe the file stream directly to the HTTP response
  readStream.pipe(res);
};

module.exports = { serveStaticPage };
