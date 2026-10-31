const API_URL = 'http://localhost:3000';

let onUnauthorized: (() => void) | null = null;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    if (response.status === 401 && token) {
      onUnauthorized?.();
    }
    throw new ApiError(
      response.status,
      body?.message ?? 'Something went wrong',
    );
  }
  return response.json() as Promise<T>;
}

export function setOnUnauthorized(fn: () => void) {
  onUnauthorized = fn;
}
