const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime').default;

const PORT = 8000;
const DIR = process.cwd();

const server = http.createServer((req, res) => {
  // Serve the 192px icon as favicon when favicon.ico is requested
  if (req.url.toLowerCase() === '/favicon.ico') {
    const iconPath = path.join(DIR, 'icon-192.png');
    fs.readFile(iconPath, (err, content) => {
      if (err) {
        res.statusCode = 404;
        res.end('Favicon not found', 'utf-8');
        return;
      }
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Length', content.length);
      res.end(content);
    });
    return;
  }
  let filePath = path.join(DIR, req.url === '/' ? 'index.html' : req.url);

  // Security: prevent directory traversal
  if (filePath.includes('..')) {
    res.statusCode = 403;
    res.end('Access denied');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File not found', 'utf-8');
      } else {
        res.statusCode = 500;
        res.end(err.code, 'utf-8');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mime.getType(ext) || 'text/plain';
    res.setHeader('Content-Type', contentType);
    res.end(content, 'utf-8');
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});