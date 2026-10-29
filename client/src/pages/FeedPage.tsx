import PageHeader from '../components/PageHeader';
import AddForm from '../components/AddForm';
import BookmarkGrid from '../components/BookmarkGrid';
import ErrorMessage from '../components/ErrorMessage';
import { useBookmarks } from '../hooks/useBookmarks';
import EmptyState from '../components/EmptyState';
import { useState } from 'react';
import TagFilter from '../components/TagFilter';

function FeedPage({ logout }: { logout: () => void }) {
  const {
    bookmarks,
    error,
    addBookmark,
    deleteBookmark,
    retryBookmark,
    isLoading,
  } = useBookmarks();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const tags = [...new Set(bookmarks.flatMap((b) => b.tags))];
  const activeTag =
    selectedTag && tags.includes(selectedTag) ? selectedTag : null;
  const visibleBookmarks = activeTag
    ? bookmarks.filter((b) => b.tags.includes(activeTag))
    : bookmarks;

  let content: React.ReactNode;
  if (bookmarks.length === 0 && !isLoading) {
    content = (
      <EmptyState
        title="Start your reading list"
        message="Paste a link above to save your first page."
      />
    );
  } else if (visibleBookmarks.length === 0 && !isLoading) {
    content = <EmptyState title="No bookmarks with this tag." />;
  } else {
    content = (
      <BookmarkGrid
        bookmarks={visibleBookmarks}
        onDelete={deleteBookmark}
        onRetry={retryBookmark}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <PageHeader onLogout={logout} />
      <div className="mx-auto max-w-5xl px-5 flex flex-col gap-4 pt-4">
        {error && <ErrorMessage message={error} />}
        <AddForm onAdd={addBookmark} />
        {tags.length > 0 && (
          <TagFilter
            tags={tags}
            selected={activeTag}
            onSelect={setSelectedTag}
          />
        )}
        {content}
      </div>
    </div>
  );
}

export default FeedPage;
