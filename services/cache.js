const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class ChannelCache {
  constructor() {
    this.db = new sqlite3.Database('./database.sqlite');
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // Store channels in cache
  async cacheChannels(userId, channels) {
    const timestamp = Date.now();
    
    for (const channel of channels) {
      await new Promise((resolve, reject) => {
        this.db.run(
          `INSERT OR REPLACE INTO channel_cache 
           (user_id, channel_id, channel_name, channel_thumbnail, cached_at) 
           VALUES (?, ?, ?, ?, ?)`,
          [userId, channel.channelId, channel.channelName, channel.channelThumbnail, timestamp],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
    
    console.log(`✅ Cached ${channels.length} channels for user ${userId}`);
  }

  // Get cached channels (if not expired)
  async getCachedChannels(userId) {
    const cutoffTime = Date.now() - this.cacheExpiry;
    
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT channel_id, channel_name, channel_thumbnail, cached_at 
         FROM channel_cache 
         WHERE user_id = ? AND cached_at > ? 
         ORDER BY cached_at DESC`,
        [userId, cutoffTime],
        (err, rows) => {
          if (err) reject(err);
          else {
            const channels = rows.map(row => ({
              channelId: row.channel_id,
              channelName: row.channel_name,
              channelThumbnail: row.channel_thumbnail,
              cached: true,
              cachedAt: new Date(row.cached_at).toLocaleString()
            }));
            resolve(channels);
          }
        }
      );
    });
  }

  // Check if cache is valid
  async isCacheValid(userId) {
    const cutoffTime = Date.now() - this.cacheExpiry;
    
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT COUNT(*) as count FROM channel_cache WHERE user_id = ? AND cached_at > ?',
        [userId, cutoffTime],
        (err, row) => {
          if (err) reject(err);
          else resolve(row.count > 0);
        }
      );
    });
  }

  // Clear expired cache
  async clearExpiredCache() {
    const cutoffTime = Date.now() - this.cacheExpiry;
    
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM channel_cache WHERE cached_at < ?',
        [cutoffTime],
        function(err) {
          if (err) reject(err);
          else {
            console.log(`🗑️  Cleared ${this.changes} expired cache entries`);
            resolve(this.changes);
          }
        }
      );
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = ChannelCache;
