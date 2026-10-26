import { useState, type FormEvent } from 'react';
import Button from '../components/Button';

type AddFormProps = {
  onAdd: (url: string) => void;
};

function AddForm({ onAdd }: AddFormProps) {
  const [url, setUrl] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onAdd(url);
    setUrl('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        aria-label="URL to save"
        placeholder="Paste a URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <Button type="submit">Save</Button>
    </form>
  );
}

export default AddForm;
