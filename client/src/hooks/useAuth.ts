import { useState, useCallback } from 'react';
import { api } from '../api/client';

type LoginAuthResponse = { message: string; jwt: string };
type RegisterAuthResponse = { message: string };

export function useAuth() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  );

  async function login(username: string, password: string) {
    const data = await api<LoginAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('token', data.jwt);
    setToken(data.jwt);
  }

  async function register(username: string, password: string) {
    await api<RegisterAuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    await login(username, password);
  }

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  return { token, login, register, logout };
}
