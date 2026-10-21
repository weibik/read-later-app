import PageHeader from '../components/PageHeader';

function FeedPage({ logout }: { logout: () => void }) {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <PageHeader onLogout={logout} />
      <div className="mx-auto max-w-5xl px-5">
        <h1>Bookmarks placeholder</h1>
      </div>
    </div>
  );
}

export default FeedPage;
