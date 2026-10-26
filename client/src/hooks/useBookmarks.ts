import { useEffect, useState } from 'react';
import { api, ApiError } from '../api/client';
import type { Bookmark } from '../types';

const POLL_INTERVAL_MS = 3000;

function fetchBookmarks() {
  return api<Bookmark[]>('/bookmarks');
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasPending = bookmarks.some((b) => b.status === 'pending');

  useEffect(() => {
    async function load() {
      try {
        setBookmarks(await fetchBookmarks());
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : 'Something went wrong',
        );
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  // Polling while something is pending
  useEffect(() => {
    if (!hasPending) return;

    const id = setInterval(async () => {
      try {
        setBookmarks(await fetchBookmarks());
      } catch {
        // quiet: try again on the next tick
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [hasPending]);

  async function addBookmark(url: string) {
    const created = await api<Bookmark>('/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
    setBookmarks((prev) => [created, ...prev]);
  }

  return { bookmarks, isLoading, error, addBookmark };
}
