import React, { useState, useEffect } from 'react';

function Saved() {
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(new Set());
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    loadSavedVideos();
  }, []);

  const loadSavedVideos = () => {
    setLoading(true);
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem('savedVideos') || '[]');
      saved.sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at));
      setSavedVideos(saved);
      setLoading(false);
    }, 300);
  };

  const handleRemove = (videoId) => {
    setRemoving(prev => new Set([...prev, videoId]));
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem('savedVideos') || '[]');
      const updated = saved.filter(item => item.video_id !== videoId);
      localStorage.setItem('savedVideos', JSON.stringify(updated));
      setSavedVideos(updated);
      setRemoving(prev => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });
    }, 200);
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved videos?')) {
      setClearing(true);
      setTimeout(() => {
        localStorage.removeItem('savedVideos');
        setSavedVideos([]);
        setClearing(false);
      }, 300);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading your saved videos...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Saved Videos</h1>
        {savedVideos.length > 0 && (
          <button
            onClick={clearAll}
            disabled={clearing}
            className="btn btn-danger"
            style={{ opacity: clearing ? 0.6 : 1 }}
          >
            {clearing ? 'Clearing...' : 'Clear All'}
          </button>
        )}
      </div>

      {savedVideos.length === 0 ? (
        <div className="empty-state">
          <h3>No saved videos yet</h3>
          <p>Videos you save from your dashboard will appear here.</p>
          <p>Go to your <a href="/dashboard">Dashboard</a> to save videos for later.</p>
        </div>
      ) : (
        <div>
          <p className="text-muted mb-3">
            You have {savedVideos.length} saved video{savedVideos.length !== 1 ? 's' : ''}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {savedVideos.map((video) => (
              <div key={video.video_id} className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    {video.title}
                  </h3>
                  <div className="card-meta">
                    <span><strong>Channel:</strong> {video.channel_name}</span>
                    {video.saved_at && (
                      <span style={{ marginLeft: '1rem' }}>
                        <strong>Saved:</strong> {new Date(video.saved_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {video.summary && (
                  <div className="card-content">
                    {video.summary}
                  </div>
                )}

                <div className="card-footer">
                  {video.thumbnail && (
                    <img
                      src={video.thumbnail}
                      alt="Video thumbnail"
                      className="video-thumbnail"
                    />
                  )}
                  
                  <button
                    onClick={() => handleRemove(video.video_id)}
                    disabled={removing.has(video.video_id)}
                    className="btn btn-danger"
                    style={{ opacity: removing.has(video.video_id) ? 0.6 : 1 }}
                  >
                    {removing.has(video.video_id) ? 'Removing...' : 'Remove from Saved'}
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
