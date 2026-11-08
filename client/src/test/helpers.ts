import type { Bookmark } from '../types';

export function makeBookmark(overrides: Partial<Bookmark> = {}): Bookmark {
  const id = overrides.id ?? 1;
  return {
    id,
    url: `https://example.com/${id}`,
    status: 'complete',
    title: `Title ${id}`,
    description: null,
    image: null,
    tags: [],
    ...overrides,
  };
}
