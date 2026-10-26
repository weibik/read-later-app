import { Worker } from 'bullmq';
import db from '../db/db';
import * as cheerio from 'cheerio';
import { bookmarks } from '../db/schema';
import { eq } from 'drizzle-orm';
import { delCachedBookmarks } from '../cache/helpers';

const worker = new Worker(
  'bookmarksQueue',
  async (job) => {
    try {
      const { userId: rawUserId, url, id } = job.data;
      console.log(`Processing job for bookmark ${id}: ${url}`);
      const userId = parseInt(rawUserId);
      const bookmarkId = parseInt(id);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }
      const rawHtml = await response.text();
      const $ = cheerio.load(rawHtml);
      const metadata = {
        title: $('title').first().text().trim() || null,
        description:
          $('meta[name="description"]').attr('content') ||
          $('meta[property="og:description"]').attr('content') ||
          null,
        image:
          $('meta[property="og:image"]').attr('content') ||
          $('meta[name="twitter:image"]').attr('content') ||
          null,
      };
      await db
        .update(bookmarks)
        .set({
          title: metadata.title,
          description: metadata.description,
          image: metadata.image,
          status: 'complete',
        })
        .where(eq(bookmarks.id, bookmarkId));
      await delCachedBookmarks(userId);
    } catch (error) {
      console.error('Worker error:', error);
      throw error;
    }
  },
  {
    removeOnFail: { count: 0 },
    connection: { host: 'localhost', port: 6379 },
  },
);

worker.on('failed', async (job) => {
  if (!job) return;
  if (job.attemptsMade < (job.opts.attempts ?? 1)) return;

  const bookmarkId = parseInt(job.data.id);
  const userId = parseInt(job.data.userId);

  await db
    .update(bookmarks)
    .set({ status: 'failed' })
    .where(eq(bookmarks.id, bookmarkId));
  await delCachedBookmarks(userId);
});
