import { Worker } from 'bullmq';
import { processBookmark, handleFailedJob } from './processBookmark';

const worker = new Worker('bookmarksQueue', processBookmark, {
  removeOnFail: { count: 0 },
  connection: { host: 'localhost', port: 6379 },
});

worker.on('failed', handleFailedJob);
