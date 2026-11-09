import http from 'node:http';

const PORT = 4000;

const PAGE = `<!doctype html>
<html>
  <head>
    <title>Fixture Page</title>
    <meta name="description" content="A page served locally for E2E tests." />
    <meta property="og:image" content="http://localhost:${PORT}/image.png" />
  </head>
  <body><h1>Fixture</h1></body>
</html>`;

http
  .createServer((req, res) => {
    if (req.url === '/page.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(PAGE);
      return;
    }
    res.writeHead(404);
    res.end();
  })
  .listen(PORT, () => console.log(`Fixture server on port ${PORT}`));
