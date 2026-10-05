import { useAuth } from './hooks/useAuth';
import FeedPage from './pages/FeedPage';
import AuthPage from './pages/AuthPage';

function App() {
  const { token, login, logout } = useAuth();

  if (!token) {
    return <AuthPage login={login} />;
  } else {
    return <FeedPage logout={logout} />;
  }
}

export default App;
