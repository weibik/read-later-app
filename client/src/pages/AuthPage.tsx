import { useState, type FormEvent } from 'react';
import { ApiError } from '../api/client';
import TextField from '../components/TextField';
import ErrorMessage from '../components/ErrorMessage';
import PageHeader from '../components/PageHeader';

type AuthPageProps = {
  login: (username: string, password: string) => Promise<void>;
};

function AuthPage({ login }: AuthPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <PageHeader />
      <form
        className="mx-auto mt-10 w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-3"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-medium">Log in</h2>
        <TextField
          id="username"
          label="Username"
          value={username}
          onChange={(v) => {
            setUsername(v);
            setError(null);
          }}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(v) => {
            setPassword(v);
            setError(null);
          }}
        />
        {error && <ErrorMessage message={error} />}
        <button
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          type="submit"
        >
          Log in
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
