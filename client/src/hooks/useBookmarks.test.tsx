import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../test/server';
import { makeBookmark } from '../test/helpers';
import { useBookmarks } from './useBookmarks';

describe('useBookmarks', () => {
  it('loads bookmarks on mount', async () => {
    const bookmarks = [makeBookmark({ id: 1 }), makeBookmark({ id: 2 })];
    server.use(
      http.get('http://localhost:3000/bookmarks', () =>
        HttpResponse.json(bookmarks),
      ),
    );

    const { result } = renderHook(() => useBookmarks());

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.bookmarks).toEqual(bookmarks);
  });

  it('returns error on failure', async () => {
    server.use(
      http.get('http://localhost:3000/bookmarks', () =>
        HttpResponse.json({ message: 'Boom' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useBookmarks());

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toEqual('Boom');
    expect(result.current.bookmarks).toEqual([]);
  });

  it('returns error on failure', async () => {
    server.use(
      http.get('http://localhost:3000/bookmarks', () =>
        HttpResponse.json({ message: 'Boom' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useBookmarks());

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toEqual('Boom');
    expect(result.current.bookmarks).toEqual([]);
  });
});
