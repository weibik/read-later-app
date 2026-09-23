import app_auth from './routes/auth';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { authMiddleware } from './middleware/middleware';

const app = new Hono();
app.use('/bookmarks/*', authMiddleware);
app.route('/auth', app_auth);

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
