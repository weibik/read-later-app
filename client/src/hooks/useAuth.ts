import { useState } from 'react';
import { api } from '../api/client';

type LoginResponse = { message: string; jwt: string };

export function useAuth() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  );

  async function login(username: string, password: string) {
    const data = await api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('token', data.jwt);
    setToken(data.jwt);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  return { token, login, logout };
}
