import * as jose from 'jose';

export const authMiddleware = async (c, next) => {
  const token = c.req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return c.json({ message: 'Authentication was not succesfull' }, 401);
  }
  try {
    await jose.jwtVerify(token, new TextEncoder().encode(process.env.SECRET!));
  } catch {
    return c.json({ message: 'Authentication was not succesfull' }, 401);
  }
  await next();
};
