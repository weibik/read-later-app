import { describe, it, expect } from 'vitest';
import { isValidUrl } from './isValidUrl';

describe('isValidUrl', () => {
  it('returns empty array for undefined', () => {
    expect(isValidUrl('http://example.com')).toBe(true);
  });

  it('rejects non-array objects', () => {
    expect(isValidUrl('https://example.com/path?q=1#top')).toBe(true);
  });

  it('rejects non-string item', () => {
    expect(isValidUrl('ftp://example.com')).toBe(false);
  });

  it('trims, lowercases and dedupes array', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
  });

  it('drops blank tags', () => {
    expect(isValidUrl('')).toBe(false);
  });

  it('accepts five different tags', () => {
    expect(isValidUrl('not a url')).toBe(false);
  });

  it('rejects six tags', () => {
    expect(isValidUrl('example.com')).toBe(false);
  });
});
