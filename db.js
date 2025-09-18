const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), 'database.sqlite'); // use /data in Railway
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id TEXT UNIQUE,
      email TEXT,
      name TEXT,
      access_token TEXT,
      refresh_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS selected_channels (
      user_id INTEGER NOT NULL,
      channel_id TEXT NOT NULL,
      channel_name TEXT NOT NULL,
      channel_thumbnail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, channel_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // add user_id and drop the UNIQUE on video_id alone
  db.run(`
    CREATE TABLE IF NOT EXISTS video_summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      video_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      title TEXT NOT NULL,
      thumbnail TEXT,
      published_at DATETIME,
      summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_vs_user_video ON video_summaries(user_id, video_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_vs_user ON video_summaries(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_vs_channel ON video_summaries(channel_id)');
});

// Convert callback-based sqlite3 to Promise-based functions
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function findUserByGoogleId(googleId) {
  const rows = await query('SELECT * FROM users WHERE google_id = ?', [googleId]);
  return rows[0];
}

async function createUser(googleId, email, name, accessToken, refreshToken) {
  const sql = 'INSERT INTO users (google_id, email, name, access_token, refresh_token) VALUES (?, ?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.run(sql, [googleId, email, name, accessToken, refreshToken], function(err) {
      if (err) reject(err);
      else {
        // Return the created user
        query('SELECT * FROM users WHERE id = ?', [this.lastID]).then(rows => {
          resolve(rows[0]);
        });
      } 
    });
  });
}

async function updateUserTokens(googleId, accessToken, refreshToken) {
  let sql = 'UPDATE users SET access_token = ?, refresh_token = ? WHERE google_id = ?';
  let params = [accessToken, refreshToken, googleId];
  // Handle case where refreshToken might be null (not always provided by Google)
  if (refreshToken === null) {
    sql = 'UPDATE users SET access_token = ? WHERE google_id = ?';
    params = [accessToken, googleId];
  }
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

async function updateSummary(videoId, summary) {
  const sql = 'UPDATE video_summaries SET summary = ? WHERE video_id = ?';
  return new Promise((resolve, reject) => {
    db.run(sql, [summary, videoId], function(err) {
      if (err) reject(err);
      else resolve({ changes: this.changes });
    });
  });
}

async function getUserVideoSummaries(userId, limit = 20) {
  const sql = `
    SELECT vs.*, sc.channel_name, sc.channel_thumbnail
    FROM video_summaries vs
    JOIN selected_channels sc ON vs.channel_id = sc.channel_id AND vs.user_id = sc.user_id
    WHERE vs.user_id = ? AND vs.summary IS NOT NULL AND vs.summary != ''
    ORDER BY vs.created_at DESC
    LIMIT ?
  `;
  return await query(sql, [userId, limit]);
}

async function getUserVideoStats(userId) {
  const sql = `
    SELECT 
      COUNT(*) as total_videos,
      COUNT(CASE WHEN summary IS NOT NULL AND summary != '' THEN 1 END) as summarized_videos,
      COUNT(DISTINCT channel_id) as unique_channels
    FROM video_summaries 
    WHERE user_id = ?
  `;
  const result = await query(sql, [userId]);
  return result[0];
}

module.exports = {
  query,
  findUserByGoogleId,
  createUser,
  updateUserTokens,
  updateSummary,
  getUserVideoSummaries,
  getUserVideoStats,
};