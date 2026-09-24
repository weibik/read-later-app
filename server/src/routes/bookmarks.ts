// Build POST /bookmarks (saves URL immediately with status: "pending").
// Build GET /bookmarks and DELETE /bookmarks/:id endpoints.

import { Hono } from 'hono';
import db from '../db/db';
import { bookmarks } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import bookmarksQueue from '../queue/queue';

const bookmarks_app = new Hono();

bookmarks_app.post('/', async (c) => {
  const { url } = await c.req.json();
  if (!url) {
    return c.json({ message: 'Webpage not found' }, 400);
  }
  const [bookmark] = await db
    .insert(bookmarks)
    .values({
      url: url,
      status: 'pending',
      userId: c.get('userId'),
    })
    .returning();
  await bookmarksQueue.add('bookmarksQueue', { url, id: bookmark.id });
  return c.json(bookmark, 201);
});

bookmarks_app.get('/', async (c) => {
  const collectedBookmarks = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, c.get('userId')));
  return c.json(collectedBookmarks, 200);
});

bookmarks_app.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const [deleted] = await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, c.get('userId'))))
    .returning();
  if (!deleted) {
    return c.json({ message: 'Bookmark not found' }, 404);
  }
  return c.json(deleted, 200);
});

export default bookmarks_app;
