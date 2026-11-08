import { Worker } from 'bullmq';
import { processBookmark, handleFailedJob } from './processBookmark';

const worker = new Worker('bookmarksQueue', processBookmark, {
  removeOnFail: { count: 0 },
  connection: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
  },
});

worker.on('failed', handleFailedJob);
