import { Client } from 'pg';
import { createClient } from 'redis';

const EXPECTED_REDIS_PORT = '6380';

export async function resetState() {
  const dbUrl = process.env.E2E_DATABASE_URL ?? '';
  const redisPort = process.env.E2E_REDIS_PORT ?? '';

  if (!dbUrl.includes('test')) {
    throw new Error('resetState refused: E2E_DATABASE_URL is not a test DB.');
  }
  if (redisPort !== EXPECTED_REDIS_PORT) {
    throw new Error(
      `resetState refused: E2E_REDIS_PORT must be ${EXPECTED_REDIS_PORT}.`,
    );
  }
  const pg = new Client({ connectionString: dbUrl });
  const redis = createClient({ socket: { port: Number(redisPort) } });

  try {
    await pg.connect();
    await redis.connect();
    await pg.query(
      'TRUNCATE bookmark_tags, bookmarks, tags, users RESTART IDENTITY CASCADE',
    );
    await redis.flushDb();
  } finally {
    await pg.end();
    if (redis.isOpen) {
      await redis.close();
    }
  }
}
