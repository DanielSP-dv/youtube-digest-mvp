import React, { useState, useEffect } from 'react';
import api from '../api';

function Dashboard() {
  const [summaries, setSummaries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
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

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setMessage('');
      setError(null);
      
      const response = await api.get('/api/refresh-videos');
      setMessage(response.message || 'Videos refreshed successfully!');
      
      // Re-fetch dashboard data to show new summaries
      await fetchDashboardData();
    } catch (err) {
      setError('Failed to refresh videos. Please try again.');
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading your video summaries...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Your Video Dashboard</h1>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: refreshing ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: refreshing ? 'not-allowed' : 'pointer'
          }}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Videos'}
        </button>
      </div>

      {/* Stats display */}
      {stats && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginBottom: '1rem',
          display: 'flex',
          gap: '2rem'
        }}>
          <span><strong>Total Videos:</strong> {stats.total_videos || 0}</span>
          <span><strong>With Summaries:</strong> {stats.summarized_videos || 0}</span>
          <span><strong>Channels:</strong> {stats.unique_channels || 0}</span>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          padding: '0.75rem', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '0.75rem', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}

      {/* Summaries list */}
      {summaries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <h3>No video summaries yet</h3>
          <p>Click "Refresh Videos" to fetch summaries from your selected channels.</p>
          <p>Make sure you have selected channels on the <a href="/channels">Channels page</a>.</p>
        </div>
      ) : (
        <div>
          <h2>Latest Video Summaries ({summaries.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {summaries.map((summary, index) => (
              <div 
                key={summary.id || index}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                    {summary.title}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                    <span><strong>Channel:</strong> {summary.channel_name}</span>
                    {summary.created_at && (
                      <span style={{ marginLeft: '1rem' }}>
                        <strong>Added:</strong> {new Date(summary.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={{ lineHeight: '1.6', color: '#444' }}>
                  {summary.summary || 'Summary not available'}
                </div>
                
                {summary.thumbnail && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img 
                      src={summary.thumbnail} 
                      alt="Video thumbnail"
                      style={{ 
                        maxWidth: '120px', 
                        height: 'auto', 
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;