import { createServer } from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import { createProxyMiddleware } from 'http-proxy-middleware';
import app from './dist/server/entry.mjs';

const bare = createBareServer('/bare/');
const server = createServer();

server.on('request', (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else if (req.url?.startsWith('/w/')) {
    createProxyMiddleware({
      target: 'http://localhost:8081', // Replace with your Wisp server
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        '^/w/': '',
      },
    })(req, res);
  } else {
    app(req, res);
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else if (req.url?.startsWith('/w/')) {
    createProxyMiddleware({
      target: 'http://localhost:8081', // Replace with your Wisp server
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        '^/w/': '',
      },
    })(req, socket, head);
  } else {
    socket.end();
  }
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
