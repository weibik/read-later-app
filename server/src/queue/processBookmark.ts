import db from '../db/db';
import * as cheerio from 'cheerio';
import { bookmarks } from '../db/schema';
import { eq } from 'drizzle-orm';
import { delCachedBookmarks } from '../cache/helpers';

const FETCH_TIMEOUT_MS = 15000;

export type BookmarkJob = {
  data: { id: string | number; userId: string | number; url: string };
  attemptsMade: number;
  opts: { attempts?: number };
};

export async function processBookmark(job: BookmarkJob) {
  try {
    const { userId: rawUserId, url, id } = job.data;
    console.log(`Processing job for bookmark ${id}: ${url}`);
    const userId = parseInt(String(rawUserId));
    const bookmarkId = parseInt(String(id));
    const response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
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
}

export async function handleFailedJob(job?: BookmarkJob) {
  if (!job) return;
  if (job.attemptsMade < (job.opts.attempts ?? 1)) return;

  try {
    const bookmarkId = parseInt(String(job.data.id));
    const userId = parseInt(String(job.data.userId));

    await db
      .update(bookmarks)
      .set({ status: 'failed' })
      .where(eq(bookmarks.id, bookmarkId));
    await delCachedBookmarks(userId);
  } catch (error) {
    console.error('Failed to set row as failed.', error);
  }
}
