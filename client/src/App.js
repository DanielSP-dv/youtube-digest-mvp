import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Channels from './pages/Channels';
import Saved from './pages/Saved';

// This custom hook handles authentication logic by checking the backend for the user's status.
// It replaces the previous placeholder to provide real-time authentication.
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Actually check the backend for auth status
    fetch('http://localhost:5001/auth/status', {
      credentials: 'include'  // This sends the session cookie
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
  }, []);

  const login = () => window.location.href = 'http://localhost:5001/auth/google';
  const logout = () => window.location.href = 'http://localhost:5001/auth/logout';

  return { user, loading, login, logout };
};

function App() {
  const { user, loading, login, logout } = useAuth(); // Using the custom authentication hook to manage user state and authentication actions.

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <header style={{ padding: '1rem', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <nav>
            <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
            {user && <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>}
            {user && <Link to="/channels" style={{ marginRight: '1rem' }}>Channels</Link>}
            {user && <Link to="/saved">Saved</Link>}
          </nav>
          <div>
            {user ? (
              <span>
                {user.email} <button onClick={logout}>Logout</button>
              </span>
            ) : (
              <button onClick={login}>Login with Google</button>
            )}
          </div>
        </header>

        <main style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Landing />} />
            <Route path="/channels" element={user ? <Channels /> : <Landing />} />
            <Route path="/saved" element={user ? <Saved /> : <Landing />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;