function FeedPage({ logout }: { logout: () => void }) {
  return (
    <div>
      <h1>Bookmarks placeholder</h1>
      <button onClick={logout}>Log out</button>
    </div>
  );
}

export default FeedPage;
