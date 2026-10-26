import type { Bookmark } from '../types';
import BookmarkCard from './BookmarkCard';

type BookmarkGridProps = {
  bookmarks: Bookmark[];
};

function BookmarkGrid({ bookmarks }: BookmarkGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}

export default BookmarkGrid;
