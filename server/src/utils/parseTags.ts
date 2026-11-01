const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 30;

export function parseTags(value: unknown): string[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;
  if (!value.every((item) => typeof item === 'string')) return null;

  const cleaned = value
    .map((item: string) => item.trim().toLowerCase())
    .filter((tag) => tag !== '');
  const tags = [...new Set(cleaned)];

  if (tags.length > MAX_TAGS) return null;
  if (tags.some((tag) => tag.length > MAX_TAG_LENGTH)) return null;

  return tags;
}
