import { useEffect, useState } from 'react';
import { api, ApiError } from '../api/client';
import type { Bookmark } from '../types';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookmarks() {
      try {
        const data = await api<Bookmark[]>('/bookmarks');
        setBookmarks(data);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : 'Something went wrong',
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadBookmarks();
  }, []);

  async function addBookmark(url: string) {
    const created = await api<Bookmark>('/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
    setBookmarks((prev) => [created, ...prev]);
  }

  return { bookmarks, isLoading, error, addBookmark };
}
