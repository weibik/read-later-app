import { Queue } from 'bullmq';

const bookmarksQueue = new Queue('bookmarksQueue', {
  connection: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
  },
});
export default bookmarksQueue;
