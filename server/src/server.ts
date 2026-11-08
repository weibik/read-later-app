import { serve } from '@hono/node-server';
import app from './app';

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT ?? 3000),
  },
  (info: { port: number }) => {
    console.log(`Server running on port ${info.port}`);
  },
);
