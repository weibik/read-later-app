import { ImageOff, RefreshCw } from 'lucide-react';
import type { Bookmark } from '../types';
import BookmarkCardSkeleton from './BookmarkCardSkeleton';
import DeleteButton from './DeleteButton';
import { useState } from 'react';

type BookmarkCardProps = {
  bookmark: Bookmark;
  onDelete: (id: number) => void;
  onRetry: (id: number) => void;
};

function BookmarkCard({ bookmark, onDelete, onRetry }: BookmarkCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (bookmark.status === 'pending') {
    return <BookmarkCardSkeleton id={bookmark.id} onDelete={onDelete} />;
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
      <DeleteButton id={bookmark.id} onDelete={onDelete} />
      {bookmark.image && !imageFailed ? (
        <img
          src={bookmark.image}
          alt=""
          className="aspect-video w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center text-gray-500">
          <ImageOff size={16} />
          <span className="text-xs">No preview</span>
        </div>
      )}
      <div className="flex flex-col gap-2 p-3">
        <div className="text-base font-medium text-gray-900 line-clamp-2">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="after:absolute after:inset-0"
          >
            {bookmark.title || bookmark.url}
          </a>
        </div>
        <div className="text-sm text-gray-600 line-clamp-2">
          {bookmark.status === 'failed'
            ? "Couldn't load a preview."
            : bookmark.description}
        </div>
        {bookmark.status === 'failed' && (
          <button
            type="button"
            onClick={() => onRetry(bookmark.id)}
            className="relative z-10 inline-flex items-center gap-1 self-start text-sm text-gray-600 underline hover:text-gray-900"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        )}
        <div className="flex flex-wrap gap-1.5">
          {bookmark.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookmarkCard;
