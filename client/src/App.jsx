import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Channels from './pages/Channels';
import Saved from './pages/Saved';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || ''; // same origin

  useEffect(() => {
    if (import.meta.env.VITE_DEMO === 'true') {
      setUser({ email: 'demo@demo' });
      setLoading(false);
      return;
    }
    fetch(`${API_BASE_URL}/auth/status`, {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.authenticated && data.user) {
        setUser(data.user);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Auth check failed:', err);
      setUser(null);
      setLoading(false);
    });
  }, [API_BASE_URL]);

  const login = () => {
    if (import.meta.env.VITE_DEMO === 'true') return;
    window.location.href = `${API_BASE_URL}/auth/google`;
  };
  const logout = () => {
    if (import.meta.env.VITE_DEMO === 'true') return;
    window.location.href = `${API_BASE_URL}/auth/logout`;
  };

  return { user, loading, login, logout };
};

// Navigation component with active link highlighting
function Navigation({ user, logout, login }) {
  const location = useLocation();
  
  return (
    <header className="app-header">
      <div className="header-content">
        <nav className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                Dashboard
              </Link>
              <Link to="/channels" className={location.pathname === '/channels' ? 'active' : ''}>
                Channels
              </Link>
              <Link to="/saved" className={location.pathname === '/saved' ? 'active' : ''}>
                Saved
              </Link>
            </>
          )}
        </nav>
        <div className="user-info">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <button onClick={login} className="btn btn-primary">
              Login with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function App() {
  const { user, loading, login, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && user && window.location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [loading, user, navigate]);

  return (
    <div>
      <Navigation user={user} logout={logout} login={login} />
      <main>
        {loading ? (
          <div className="loading-container">Loading...</div>
        ) : (
          <Routes>
            <Route path="/" element={<Landing user={user} login={login} />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Landing user={user} login={login} />} />
            <Route path="/channels" element={user ? <Channels /> : <Landing user={user} login={login} />} />
            <Route path="/saved" element={user ? <Saved /> : <Landing user={user} login={login} />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

const Root = () => <Router><App /></Router>;

export default Root;
