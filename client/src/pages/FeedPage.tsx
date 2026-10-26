import PageHeader from '../components/PageHeader';
import AddForm from '../components/AddForm';
import BookmarkGrid from '../components/BookmarkGrid';
import ErrorMessage from '../components/ErrorMessage';
import { useBookmarks } from '../hooks/useBookmarks';

function FeedPage({ logout }: { logout: () => void }) {
  const { bookmarks, error } = useBookmarks();

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <PageHeader onLogout={logout} />
      <div className="mx-auto max-w-5xl px-5 flex flex-col gap-4 pt-4">
        {error && <ErrorMessage message={error} />}
        <AddForm onAdd={(url) => console.log(url)} />
        <BookmarkGrid bookmarks={bookmarks} />
      </div>
    </div>
  );
}

export default FeedPage;
