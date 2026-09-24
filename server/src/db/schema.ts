import {
  integer,
  pgTable,
  pgEnum,
  serial,
  text,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['pending', 'complete']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
});

export const bookmarks = pgTable('bookmarks', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  status: statusEnum('status').notNull(),
  title: text('title'),
  description: text('description'),
  image: text('image'),
  userId: integer('user_id').references(() => users.id),
});

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const bookmark_tags = pgTable(
  'bookmark_tags',
  {
    bookmark_id: integer('bookmark_id'),
    tag_id: integer('tag_id'),
  },
  (table) => [primaryKey({ columns: [table.bookmark_id, table.tag_id] })],
);
