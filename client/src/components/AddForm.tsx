import { useState, type FormEvent } from 'react';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { ApiError } from '../api/client';

type AddFormProps = {
  onAdd: (url: string) => Promise<void>;
};

function isValidUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function AddForm({ onAdd }: AddFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = url.trim();

    if (!isValidUrl(value)) {
      setError('Enter a valid URL.');
      return;
    }

    try {
      await onAdd(value);
      setUrl('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          aria-label="URL to save"
          placeholder="Paste a URL..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
          }}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button type="submit">Save</Button>
      </form>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default AddForm;
