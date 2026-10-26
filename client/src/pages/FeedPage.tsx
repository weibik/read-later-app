import PageHeader from '../components/PageHeader';
import AddForm from '../components/AddForm';
import type { Bookmark } from '../types';
import BookmarkGrid from '../components/BookmarkGrid';

const fakeBookmark1: Bookmark = {
  id: 1,
  url: 'https://example.com',
  status: 'complete',
  title:
    'A very long title that goes on and on so we can check that it clamps at two linesy long title that goes on and on so we can check thay long title that goey long title that goes on and on so we can check thay long title that goes on and on so we can check thay long title that goes on and on so we can check thas on and on so we can check tha',
  description:
    'A very long y long title that goes on and on so we can check thay long title that goes on and on so we can check thay long title that goes on and on so we can check thay long title that goes on and on so we can check thay long title that goes on and on so we can check thay long title that goes on and on so we can check thadescription that keeps going and going, long enough to overflow two lines for sure.',
  image: 'https://picsum.photos/seed/first/640/360',
  tags: ['react', 'css'],
};

const fakeBookmark2: Bookmark = {
  id: 2,
  url: 'https://example.com',
  status: 'complete',
  title:
    'A very long title that goes on and on so we can check that it clamps at two linesy long title that goes on and on so we can check thay long title that goey long title that goes on and on so we can check thay long title that goes on and on so we can check thay long title that goes on and on so we can check thas on and on so we can check tha',
  description:
    'A very long y long title that goes on and on so we can check thay long title that goes on and on so we can check thay long title that goes on and on so we can check thay long title that goes on and on so we can check thay long title that goes on and on so we can check thay long title that goes on and on so we can check thadescription that keeps going and going, long enough to overflow two lines for sure.',
  image: 'https://picsum.photos/seed/second/640/360',
  tags: ['react', 'css'],
};

const array = [fakeBookmark1, fakeBookmark2];

function FeedPage({ logout }: { logout: () => void }) {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <PageHeader onLogout={logout} />
      <div className="mx-auto max-w-5xl px-5 flex flex-col gap-4 pt-4">
        <AddForm onAdd={(url) => console.log(url)} />
        <BookmarkGrid bookmarks={array} />
      </div>
    </div>
  );
}

export default FeedPage;
