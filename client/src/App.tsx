import { useAuth } from './hooks/useAuth';
import FeedPage from './pages/FeedPage';
import AuthPage from './pages/AuthPage';
import { useEffect } from 'react';
import { setOnUnauthorized } from './api/client';

function App() {
  const { token, login, register, logout } = useAuth();

  useEffect(() => {
    setOnUnauthorized(logout);
  }, []);

  if (!token) {
    return <AuthPage login={login} register={register} />;
  } else {
    return <FeedPage logout={logout} />;
  }
}

export default App;
