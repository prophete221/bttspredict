import http from 'http';
import fs from 'fs';
import path from 'path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
};

const OUT = '/home/z/my-project/out';

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0]; // Remove query strings
  let p = path.join(OUT, urlPath === '/' ? 'index.html' : urlPath);
  
  // Try to serve the file, fallback to .html extension, then 404
  if (!fs.existsSync(p)) {
    // Try with .html extension
    if (fs.existsSync(p + '.html')) {
      p = p + '.html';
    } else if (fs.existsSync(path.join(p, 'index.html'))) {
      p = path.join(p, 'index.html');
    } else {
      p = path.join(OUT, '404.html');
    }
  }
  
  // If path is a directory, serve index.html inside
  if (fs.statSync(p).isDirectory()) {
    p = path.join(p, 'index.html');
  }
  
  const ext = path.extname(p);
  const ct = MIME[ext] || 'application/octet-stream';
  
  fs.readFile(p, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': ct,
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('✅ BttsBet server running at http://0.0.0.0:3000');
  console.log('   Serving static build from /home/z/my-project/out');
});
