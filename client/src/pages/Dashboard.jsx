import React, { useState, useEffect } from 'react';
import api from '../api';

function Dashboard() {
  const [summaries, setSummaries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [savedItems, setSavedItems] = useState(new Set());

  useEffect(() => {
    fetchDashboardData();
    loadSavedItems();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const data = await api.get('/api/dashboard');
      setSummaries(data.summaries || []);
      setStats(data.stats || {});
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedItems = () => {
    const saved = JSON.parse(localStorage.getItem('savedVideos') || '[]');
    setSavedItems(new Set(saved.map(item => item.video_id)));
  };

  const handleSave = (summary) => {
    const saved = JSON.parse(localStorage.getItem('savedVideos') || '[]');
    const isAlreadySaved = saved.some(item => item.video_id === summary.video_id);
    
    if (isAlreadySaved) {
      const updated = saved.filter(item => item.video_id !== summary.video_id);
      localStorage.setItem('savedVideos', JSON.stringify(updated));
      setSavedItems(new Set(updated.map(item => item.video_id)));
    } else {
      const newSaved = {
        video_id: summary.video_id || summary.id,
        title: summary.title,
        channel_name: summary.channel_name,
        summary: summary.summary,
        thumbnail: summary.thumbnail,
        saved_at: new Date().toISOString()
      };
      saved.push(newSaved);
      localStorage.setItem('savedVideos', JSON.stringify(saved));
      setSavedItems(new Set(saved.map(item => item.video_id)));
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setMessage('');
      setError(null);
      
      const response = await api.get('/api/refresh-videos');
      setMessage(response.message || 'Videos refreshed successfully!');
      
      await fetchDashboardData();
    } catch (err) {
      setError('Failed to refresh videos. Please try again.');
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading your video summaries...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Your Video Dashboard</h1>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="btn btn-primary"
        >
          {refreshing ? 'Refreshing...' : 'Refresh Videos'}
        </button>
      </div>

      {stats && (
        <div className="stats-bar">
          <span className="stat-item"><strong>Total Videos:</strong> {stats.total_videos || 0}</span>
          <span className="stat-item"><strong>With Summaries:</strong> {stats.summarized_videos || 0}</span>
          <span className="stat-item"><strong>Channels:</strong> {stats.unique_channels || 0}</span>
        </div>
      )}

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {summaries.length === 0 ? (
        <div className="empty-state">
          <h3>No video summaries yet</h3>
          <p>Click "Refresh Videos" to fetch summaries from your selected channels.</p>
          <p>Make sure you have selected channels on the <a href="/channels">Channels page</a>.</p>
        </div>
      ) : (
        <div>
          <h2 className="mb-3">Latest Video Summaries ({summaries.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {summaries.map((summary, index) => {
              const videoId = summary.video_id || summary.id;
              const isSaved = savedItems.has(videoId);
              
              return (
                <div key={summary.id || index} className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      {summary.title}
                    </h3>
                    <div className="card-meta">
                      <span><strong>Channel:</strong> {summary.channel_name}</span>
                      {summary.created_at && (
                        <span style={{ marginLeft: '1rem' }}>
                          <strong>Added:</strong> {new Date(summary.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-content">
                    {summary.summary || 'Summary not available'}
                  </div>
                  
                  <div className="card-footer">
                    {summary.thumbnail && (
                      <img 
                        src={summary.thumbnail} 
                        alt="Video thumbnail"
                        className="video-thumbnail"
                      />
                    )}
                    
                    <button
                      onClick={() => handleSave(summary)}
                      className={`btn ${isSaved ? 'btn-success' : 'btn-secondary'}`}
                    >
                      {isSaved ? '✓ Saved' : 'Save for Later'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
