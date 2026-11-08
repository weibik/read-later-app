import { describe, it, expect } from 'vitest';
import { getStaleIds } from './staleBookmarks';

const NOW = new Date('2026-01-01T12:00:00Z').getTime();
const STALE_MS = 1000;

type Candidate = {
  id: number;
  status: string;
  pendingSince: Date | string;
};

function makeCandidate(overrides: Partial<Candidate> = {}): Candidate {
  return {
    id: 1,
    status: 'pending',
    pendingSince: new Date(NOW),
    ...overrides,
  };
}

describe('getStaleIds', () => {
  it('returns the id of a pending bookmark older than the threshold', () => {
    const list = [
      makeCandidate({ pendingSince: new Date(NOW - STALE_MS - 1) }),
    ];

    expect(getStaleIds(list, NOW, STALE_MS)).toEqual([1]);
  });

  it('does not treat a bookmark exactly at the threshold as stale', () => {
    const list = [makeCandidate({ pendingSince: new Date(NOW - STALE_MS) })];

    expect(getStaleIds(list, NOW, STALE_MS)).toEqual([]);
  });

  it.each(['complete', 'failed'])(
    'ignores an old bookmark with status %s',
    (status) => {
      const list = [
        makeCandidate({
          status,
          pendingSince: new Date(NOW - STALE_MS * 100),
        }),
      ];

      expect(getStaleIds(list, NOW, STALE_MS)).toEqual([]);
    },
  );

  it('accepts pendingSince as an ISO string, as it comes from the cache', () => {
    const list = [
      makeCandidate({
        pendingSince: new Date(NOW - STALE_MS - 1).toISOString(),
      }),
    ];

    expect(getStaleIds(list, NOW, STALE_MS)).toEqual([1]);
  });

  it('returns only the stale ids from a mixed list, in order', () => {
    const list = [
      makeCandidate({ id: 1, pendingSince: new Date(NOW - STALE_MS - 1) }),
      makeCandidate({ id: 2, pendingSince: new Date(NOW) }),
      makeCandidate({ id: 3, pendingSince: new Date(NOW - STALE_MS * 5) }),
      makeCandidate({
        id: 4,
        status: 'complete',
        pendingSince: new Date(NOW - STALE_MS * 5),
      }),
    ];

    expect(getStaleIds(list, NOW, STALE_MS)).toEqual([1, 3]);
  });
});
