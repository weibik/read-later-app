import { describe, it, expect } from 'vitest';
import { parseTags } from './parseTags';

describe('parseTags', () => {
  it('returns empty array for undefined', () => {
    expect(parseTags(undefined)).toEqual([]);
  });

  it('rejects non-array objects', () => {
    expect(parseTags('react')).toBeNull();
  });

  it('rejects non-string item', () => {
    expect(parseTags(['react', 5])).toBeNull();
  });

  it('trims, lowercases and dedupes array', () => {
    expect(parseTags(['React', 'docs ', 'react'])).toEqual(['react', 'docs']);
  });

  it('drops blank tags', () => {
    expect(parseTags(['', ' '])).toEqual([]);
  });

  it('accepts five different tags', () => {
    expect(parseTags(['one', 'two', 'three', 'four', 'five'])).toEqual([
      'one',
      'two',
      'three',
      'four',
      'five',
    ]);
  });

  it('rejects six tags', () => {
    expect(
      parseTags(['one', 'two', 'three', 'four', 'five', 'six']),
    ).toBeNull();
  });

  it('counts duplicates once, so six identical tags are allowed', () => {
    expect(parseTags(['one', 'one', 'one', 'one', 'one', 'one'])).toEqual([
      'one',
    ]);
  });

  it('accepts tag of 30 chars', () => {
    expect(parseTags(['a'.repeat(30)])).toEqual(['a'.repeat(30)]);
  });

  it('rejects tag longer than 30 chars', () => {
    expect(parseTags(['a'.repeat(31)])).toBeNull();
  });
});
