import { useState } from 'react';
import { ApiError } from '../api/client';

function AuthPage({
  login,
}: {
  login: (name: string, password: string) => Promise<void>;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    try {
      await login(username, password);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Wrong username or password.');
      } else {
        setError('Something went wrong');
      }
    }
  }

  return (
    <div>
      <h1>Exercise</h1>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button onClick={handleLogin}>Log in</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default AuthPage;
