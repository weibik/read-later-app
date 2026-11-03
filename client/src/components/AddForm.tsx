import { useState, type FormEvent } from 'react';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { ApiError } from '../api/client';

type AddFormProps = {
  onAdd: (url: string, tags: string[]) => Promise<void>;
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
  const [tagsText, setTagsText] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = url.trim();

    if (!isValidUrl(value)) {
      setError('Enter a valid URL.');
      return;
    }

    const tags = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');
    if (tags.length > 5) {
      setError('Use up to 5 tags.');
      return;
    }

    try {
      await onAdd(value, tags);
      setUrl('');
      setTagsText('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            aria-label="URL to save"
            placeholder="Paste a URL..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button className="shrink-0" type="submit">
            Save
          </Button>
        </div>
        <input
          type="text"
          aria-label="Tags, separated by commas"
          placeholder="Tags, separated by commas"
          value={tagsText}
          onChange={(e) => {
            setTagsText(e.target.value);
            setError(null);
          }}
          className="min-w-0 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </form>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default AddForm;
