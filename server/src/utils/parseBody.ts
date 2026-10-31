import type { Context } from 'hono';

export async function parseBody(
  c: Context,
): Promise<Record<string, unknown> | null> {
  try {
    const body = await c.req.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return null;
    }
    return body;
  } catch {
    return null;
  }
}
