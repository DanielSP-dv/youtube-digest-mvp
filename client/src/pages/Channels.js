import React, { useState, useEffect } from 'react';
import api from '../api';

function Channels() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const subs = await api.get('/api/subscriptions');
        const saved = await api.get('/api/channels');
        setSubscriptions(subs);
        setSelectedChannels(new Set(saved.map(c => c.channel_id)));
      } catch (err) {
        setError('Failed to load channel data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChannelSelect = (channelId) => {
    const newSelection = new Set(selectedChannels);
    if (newSelection.has(channelId)) {
      newSelection.delete(channelId);
    } else {
      if (newSelection.size < 10) {
        newSelection.add(channelId);
      }
    }
    setSelectedChannels(newSelection);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const channelsToSave = subscriptions.filter(sub => selectedChannels.has(sub.channelId));
      await api.post('/api/channels', { channels: channelsToSave });
      alert('Your channel selections have been saved!');
    } catch (err) {
      setError('Failed to save your channels. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-container">Loading your channels...</div>;
  if (error) return <div className="page-container"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Select Channels to Monitor</h1>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          {saving ? 'Saving...' : 'Save Selections'}
        </button>
      </div>
      
      <p className="text-muted mb-3">
        You can select up to 10 channels. Selected: {selectedChannels.size}/10
      </p>
      
      <div className="channel-list">
        {subscriptions.map(sub => (
          <div key={sub.channelId} className="channel-item">
            <input
              type="checkbox"
              id={sub.channelId}
              className="channel-checkbox"
              checked={selectedChannels.has(sub.channelId)}
              onChange={() => handleChannelSelect(sub.channelId)}
              disabled={!selectedChannels.has(sub.channelId) && selectedChannels.size >= 10}
            />
            <label htmlFor={sub.channelId} className="channel-label">
              <img src={sub.channelThumbnail} alt="" className="channel-thumbnail" />
              <span>{sub.channelName}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Channels;