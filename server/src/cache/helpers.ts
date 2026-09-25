import redisClient from './client';
import { bookmarks } from '../db/schema';

export async function getCachedBookmarks(userId: number) {
  const value = await redisClient.get(`bookmarks:${userId}`);
  if (!value) {
    return null;
  }
  return JSON.parse(value) as Array<typeof bookmarks.$inferSelect>;
}

export async function setCachedBookmarks(
  userId: number,
  bookmarksList: Array<typeof bookmarks.$inferSelect>,
) {
  await redisClient.set(`bookmarks:${userId}`, JSON.stringify(bookmarksList));
}

export async function delCachedBookmarks(userId: number) {
  await redisClient.del(`bookmarks:${userId}`);
}
