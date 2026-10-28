import type { Bookmark } from '../types';
import BookmarkCard from './BookmarkCard';

type BookmarkGridProps = {
  bookmarks: Bookmark[];
  onDelete: (id: number) => void;
  onRetry: (id: number) => void;
};

function BookmarkGrid({ bookmarks, onDelete, onRetry }: BookmarkGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
}

export default BookmarkGrid;
