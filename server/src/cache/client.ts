import type { RedisClientType } from 'redis';
import { createClient } from 'redis';

const redisClient: RedisClientType = createClient({
  url: `redis://${process.env.REDIS_HOST ?? 'localhost'}:${process.env.REDIS_PORT ?? 6379}`,
});
redisClient.on('error', (err: Error) => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

export default redisClient;
