/* Local-only static preview. No packages or build step required. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf' };
const server = http.createServer((request, response) => {
  let relative;
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    relative = pathname === '/' ? 'index.html' : pathname.slice(1);
  } catch {
    response.writeHead(400); response.end('Invalid path'); return;
  }
  if (!/^(index\.html|styles\.css|script\.js|motion\.js|assets\/[a-zA-Z0-9._-]+)$/.test(relative)) {
    response.writeHead(404); response.end('Not found'); return;
  }
  fs.readFile(path.join(__dirname, relative), (error, data) => {
    if (error) { response.writeHead(404); response.end('Not found'); return; }
    response.writeHead(200, { 'Content-Type': types[path.extname(relative)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(data);
  });
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? 'Port 8000 is in use. If the preview is already running, open http://127.0.0.1:8000.' : error.message);
  process.exitCode = 1;
});
server.listen(8000, '127.0.0.1', () => console.log('Portfolio preview: http://127.0.0.1:8000'));
