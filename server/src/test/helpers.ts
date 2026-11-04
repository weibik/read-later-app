import * as jose from 'jose';
import db from '../db/db';
import { users } from '../db/schema';

export async function createTestUser(username: string = 'test-user') {
  const [inserted] = await db
    .insert(users)
    .values({ username: username, password: 'test-password' })
    .returning();
  return inserted.id;
}

export async function makeToken(userId: number) {
  const alg = 'HS256';
  const jwt = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(process.env.SECRET!));
  return jwt;
}
