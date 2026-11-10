import http from 'node:http';

const PORT = 4000;

const PAGES = {
  '/page.html': {
    title: 'Fixture Page',
    description: 'A page served locally for E2E tests.',
  },
  '/page2.html': {
    title: 'Second Page',
    description: 'A second fixture used by the filter test.',
  },
};

function renderPage({ title, description }) {
  return `<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:image" content="http://localhost:${PORT}/image.png" />
  </head>
  <body><h1>${title}</h1></body>
</html>`;
}

http
  .createServer((req, res) => {
    const page = PAGES[req.url];
    if (page) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderPage(page));
      return;
    }
    res.writeHead(404);
    res.end();
  })
  .listen(PORT, () => console.log(`Fixture server on port ${PORT}`));
