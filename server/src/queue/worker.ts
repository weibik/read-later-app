import { Worker } from 'bullmq';
import db from '../db/db';
import * as cheerio from 'cheerio';
import { bookmarks } from '../db/schema';
import { eq } from 'drizzle-orm';

new Worker(
  'bookmarksQueue',
  async (job) => {
    try {
      const { url, id } = job.data;
      const bookmarkId = parseInt(id);
      console.log(`Processing job for bookmark ${id}: ${url}`);
      const response = await fetch(url);
      const rawHtml = await response.text();
      const $ = cheerio.load(rawHtml);
      const metadata = {
        title: $('title').first().text().trim() || '',
        description:
          $('meta[name="description"]').attr('content') ||
          $('meta[property="og:description"]').attr('content') ||
          '',
        image:
          $('meta[property="og:image"]').attr('content') ||
          $('meta[name="twitter:image"]').attr('content') ||
          '',
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
