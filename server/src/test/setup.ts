import db from '../db/db';
import { sql } from 'drizzle-orm';
import { beforeEach } from 'vitest';

if (!process.env.DATABASE_URL?.includes('test'))
  throw new Error('DATABASE_URL does not contain test.');

beforeEach(async () => {
  await db.execute(
    sql`TRUNCATE TABLE bookmark_tags, bookmarks, tags, users RESTART IDENTITY CASCADE`,
  );
});
