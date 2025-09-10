import React from 'react';

function Landing({ user, login }) {
  return (
    <div className="landing-container">
      <h1 className="landing-title">YouTube Digest</h1>
      <p className="landing-subtitle">
        Get AI-powered summaries of your favorite YouTube channels
      </p>
      {!user && (
        <button onClick={login} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
          Get Started with Google
        </button>
      )}
      {user && (
        <div>
          <p className="text-muted mb-3">Welcome back, {user.name}!</p>
          <a href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </a>
        </div>
      )}
    </div>
  );
}

export default Landing;