import app_auth from './routes/auth';
import bookmarks_app from './routes/bookmarks';
import { Hono } from 'hono';
import { authMiddleware } from './middleware/middleware';
import type { appVariables } from './types';
import { cors } from 'hono/cors';

const app = new Hono<{ Variables: appVariables }>();
app.use(
  '*',
  cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }),
);
app.use('/bookmarks/*', authMiddleware);
app.route('/auth', app_auth);
app.route('/bookmarks', bookmarks_app);

export default app;
