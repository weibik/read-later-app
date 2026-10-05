import app_auth from './routes/auth';
import bookmarks_app from './routes/bookmarks';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { authMiddleware } from './middleware/middleware';
import { appVariables } from './types';
import { cors } from 'hono/cors';

const app = new Hono<{ Variables: appVariables }>();
app.use('*', cors({ origin: 'http://localhost:5173' }));
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
