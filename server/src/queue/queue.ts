import { Queue } from 'bullmq';

const bookmarksQueue = new Queue('bookmarksQueue');

export default bookmarksQueue;
