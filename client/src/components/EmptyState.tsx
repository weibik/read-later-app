import { Bookmark } from 'lucide-react';

type EmptyStateProps = {
  title: string;
  message?: string;
};

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-1 py-16 text-center">
      <Bookmark size={28} className="mb-2 text-gray-400" />
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}
