import PageHeader from '../components/PageHeader';
import AddForm from '../components/AddForm';
import BookmarkGrid from '../components/BookmarkGrid';
import ErrorMessage from '../components/ErrorMessage';
import { useBookmarks } from '../hooks/useBookmarks';
import EmptyState from '../components/EmptyState';

function FeedPage({ logout }: { logout: () => void }) {
  const {
    bookmarks,
    error,
    addBookmark,
    deleteBookmark,
    retryBookmark,
    isLoading,
  } = useBookmarks();

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <PageHeader onLogout={logout} />
      <div className="mx-auto max-w-5xl px-5 flex flex-col gap-4 pt-4">
        {error && <ErrorMessage message={error} />}
        <AddForm onAdd={addBookmark} />
        {!isLoading && bookmarks.length === 0 ? (
          <EmptyState
            title="Start your reading list"
            message="Paste a link above to save your first page."
          ></EmptyState>
        ) : (
          <BookmarkGrid
            bookmarks={bookmarks}
            onDelete={deleteBookmark}
            onRetry={retryBookmark}
          />
        )}
      </div>
    </div>
  );
}

export default FeedPage;
