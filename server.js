const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const mimeLib = require('mime');
const mime = mimeLib.default || mimeLib;

const PORT = 8000;
const DIR = process.cwd();
const COMPRESSIBLE = /^(text\/|application\/(javascript|json|manifest\+json)|image\/svg)/;

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (mime && typeof mime.getType === 'function') {
    return mime.getType(ext) || 'text/plain';
  }
  if (mime && mime.Mime && typeof mime.Mime.getType === 'function') {
    return mime.Mime.getType(ext) || 'text/plain';
  }
  return 'text/plain';
}

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
  const urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  let filePath = path.join(DIR, urlPath === '/' ? 'index.html' : urlPath);

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

    const contentType = getMimeType(filePath);
    res.setHeader('Content-Type', contentType);
    if ((req.headers['accept-encoding'] || '').includes('gzip') && COMPRESSIBLE.test(contentType)) {
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Vary', 'Accept-Encoding');
      res.end(zlib.gzipSync(content));
      return;
    }
    res.end(content, 'utf-8');
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});