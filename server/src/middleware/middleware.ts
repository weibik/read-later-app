import * as jose from 'jose';
import { createMiddleware } from 'hono/factory';
import type { appVariables } from '../types';

export const authMiddleware = createMiddleware<{ Variables: appVariables }>(
  async (c, next) => {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return c.json({ message: 'Authentication was not succesfull' }, 401);
    }
    try {
      const { payload } = await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.SECRET!),
      );
      const userId = payload['userId'];
      if (typeof userId !== 'number') {
        return c.json({ message: 'Authentication was not succesfull' }, 401);
      }
      c.set('userId', userId);
    } catch {
      return c.json({ message: 'Authentication was not succesfull' }, 401);
    }
    await next();
  },
);
