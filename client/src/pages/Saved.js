import React, { useState, useEffect } from 'react';

function Saved() {
  const [savedVideos, setSavedVideos] = useState([]);

  useEffect(() => {
    loadSavedVideos();
  }, []);

  const loadSavedVideos = () => {
    const saved = JSON.parse(localStorage.getItem('savedVideos') || '[]');
    // Sort by saved date, newest first
    saved.sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at));
    setSavedVideos(saved);
  };

  const handleRemove = (videoId) => {
    const saved = JSON.parse(localStorage.getItem('savedVideos') || '[]');
    const updated = saved.filter(item => item.video_id !== videoId);
    localStorage.setItem('savedVideos', JSON.stringify(updated));
    setSavedVideos(updated);
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved videos?')) {
      localStorage.removeItem('savedVideos');
      setSavedVideos([]);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Saved Videos</h1>
        {savedVideos.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {savedVideos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <h3>No saved videos yet</h3>
          <p>Videos you save from your dashboard will appear here.</p>
          <p>Go to your <a href="/dashboard">Dashboard</a> to save videos for later.</p>
        </div>
      ) : (
        <div>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            You have {savedVideos.length} saved video{savedVideos.length !== 1 ? 's' : ''}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {savedVideos.map((video) => (
              <div
                key={video.video_id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                    {video.title}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                    <span><strong>Channel:</strong> {video.channel_name}</span>
                    {video.saved_at && (
                      <span style={{ marginLeft: '1rem' }}>
                        <strong>Saved:</strong> {new Date(video.saved_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {video.summary && (
                  <div style={{ lineHeight: '1.6', color: '#444', marginBottom: '1rem' }}>
                    {video.summary}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {video.thumbnail && (
                    <img
                      src={video.thumbnail}
                      alt="Video thumbnail"
                      style={{
                        maxWidth: '120px',
                        height: 'auto',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                  )}
                  
                  <button
                    onClick={() => handleRemove(video.video_id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Remove from Saved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Saved;