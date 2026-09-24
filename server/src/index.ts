import app_auth from './routes/auth';
import bookmarks_app from './routes/bookmarks';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { authMiddleware } from './middleware/middleware';

const app = new Hono();
app.use('/bookmarks/*', authMiddleware);
app.route('/auth', app_auth);
app.route('/bookmarks', bookmarks_app);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info: { port: number }) => {
    console.log(`Server running on port ${info.port}`);
  },
);

export default app;
