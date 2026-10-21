import { useState, type FormEvent } from 'react';
import { ApiError } from '../api/client';
import TextField from '../components/TextField';
import ErrorMessage from '../components/ErrorMessage';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';

type AuthPageProps = {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
};

const copy: Record<
  'login' | 'register',
  { heading: string; button: string; switchText: string }
> = {
  login: {
    heading: 'Log in',
    button: 'Log in',
    switchText: 'No account? Register',
  },
  register: {
    heading: 'Create account',
    button: 'Register',
    switchText: 'Already have an account? Log in',
  },
};

function AuthPage({ login, register }: AuthPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register(username, password);
      }
      setError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Wrong username or password.');
      } else if (err instanceof ApiError && err.status === 409) {
        setError('That username’s already taken. Try another.');
      } else {
        setError('Something went wrong');
        console.error(err);
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
        <h2 className="text-lg font-medium">{copy[mode].heading}</h2>
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
        <Button type="submit" className="w-full">
          {copy[mode].button}
        </Button>
        <button
          type="button"
          className="text-center text-sm text-gray-600 underline hover:text-gray-900"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError(null);
          }}
        >
          {copy[mode].switchText}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
