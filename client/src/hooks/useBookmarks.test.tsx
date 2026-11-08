import { vi, describe, it, expect, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../test/server';
import { makeBookmark } from '../test/helpers';
import { useBookmarks } from './useBookmarks';

describe('useBookmarks', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

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

  it('refetches while a bookmark is pending and picks up the change', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });

    let requests = 0;
    server.use(
      http.get('http://localhost:3000/bookmarks', () => {
        requests++;
        const status = requests === 1 ? 'pending' : 'complete';
        return HttpResponse.json([makeBookmark({ id: 1, status })]);
      }),
    );

    const { result } = renderHook(() => useBookmarks());
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.bookmarks[0].status).toBe('pending');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });

    await vi.waitFor(() =>
      expect(result.current.bookmarks[0].status).toBe('complete'),
    );
  });

  it('stops polling once no bookmark is pending', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });

    let requests = 0;
    server.use(
      http.get('http://localhost:3000/bookmarks', () => {
        requests++;
        const status = requests === 1 ? 'pending' : 'complete';
        return HttpResponse.json([makeBookmark({ id: 1, status })]);
      }),
    );

    const { result } = renderHook(() => useBookmarks());
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.bookmarks[0].status).toBe('pending');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });

    await vi.waitFor(() =>
      expect(result.current.bookmarks[0].status).toBe('complete'),
    );
    const requestsAfterComplete = requests;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(9000);
    });
    expect(requests).toEqual(requestsAfterComplete);
  });
});
