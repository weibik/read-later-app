import { ImageOff, Trash2 } from 'lucide-react';
import type { Bookmark } from '../types';
import BookmarkCardSkeleton from './BookmarkCardSkeleton';

type BookmarkCardProps = {
  bookmark: Bookmark;
  onDelete: (id: number) => void;
};

function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  if (bookmark.status === 'pending') {
    return <BookmarkCardSkeleton />;
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        aria-label="Delete bookmark"
        onClick={() => onDelete(bookmark.id)}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-500 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>
      {bookmark.image ? (
        <img
          src={bookmark.image}
          alt=""
          className="aspect-video w-full object-cover"
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
          {bookmark.description}
        </div>
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
