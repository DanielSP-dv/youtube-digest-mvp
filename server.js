const fs = require('fs');
const path = require('path');

// --- Manual .env parsing (optional for local development) ---
try {
  const envPath = path.resolve(__dirname, '.env');
  const envFileContent = fs.readFileSync(envPath, 'utf8');
  const lines = envFileContent.split('\n');

  for (const line of lines) {
    if (line.trim() === '' || line.trim().startsWith('#')) {
      continue;
    }
    const parts = line.split('=');
    const key = parts.shift().trim();
    const value = parts.join('=').trim();
    
    process.env[key] = value;
  }
  console.log('✅ Loaded .env file for local development');
} catch (err) {
  // Silently ignore .env file not found (Railway provides env vars directly)
  if (err.code !== 'ENOENT') {
    console.error('Error manually parsing .env file:', err);
  }
}
// --- End of manual .env parsing ---

const required = ["CLIENT_URL","SESSION_SECRET","GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET","CALLBACK_URL"];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error("Missing env:", missing.join(", "));
  process.exit(1);
}

console.log('DEBUG: GOOGLE_CLIENT_ID =', process.env.GOOGLE_CLIENT_ID);
console.log('DEBUG: CLIENT_URL =', process.env.CLIENT_URL);

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');
const youtubeService = require('./services/youtube');
const transcriptService = require('./services/transcript');
const openaiService = require('./services/openai');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const port = process.env.PORT || 5001;

// CORS setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true for HTTPS in production
    httpOnly: true,
    sameSite: 'lax', // Important for cross-port
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'client/build')));

const db = require('./db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await db.findUserByGoogleId(profile.id);
      if (!user) {
        user = await db.createUser(profile.id, profile.emails[0].value, profile.displayName, accessToken, refreshToken);
        console.log('Created new user:', user);
      } else {
        // Update existing user's tokens
        await db.updateUserTokens(profile.id, accessToken, refreshToken);
        // Re-fetch user to get updated tokens, or just update the user object in memory
        user.access_token = accessToken;
        user.refresh_token = refreshToken; // Update user object in memory
        console.log('Found existing user, updated tokens:', user);
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Test route to verify server is working
app.get('/test', (req, res) => {
  const fs = require('fs');
  const buildPath = path.join(__dirname, 'client/build/index.html');
  const clientPath = path.join(__dirname, 'client');
  
  res.json({ 
    status: 'Server is working!', 
    timestamp: new Date().toISOString(),
    buildPath: buildPath,
    buildExists: fs.existsSync(buildPath),
    clientExists: fs.existsSync(clientPath),
    clientContents: fs.existsSync(clientPath) ? fs.readdirSync(clientPath) : 'client dir not found',
    appContents: fs.readdirSync(__dirname),
    deployment: 'v2.0'
  });
});

app.get('/dashboard', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.send(`<h1>Dashboard</h1><p>Welcome, ${req.user.name}!</p><p>Email: ${req.user.email}</p><a href="/auth/logout">Logout</a>`);
});

// Auth routes
app.get('/auth/google', passport.authenticate('google', { 
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/youtube'],
  accessType: 'offline',
  prompt: 'consent'
}));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL }), (req, res) => {
  // Successful authentication, redirect to React frontend
  res.redirect(`${process.env.CLIENT_URL}/dashboard`);
});

// API routes
app.get('/api/current_user', (req, res) => {
  if (!req.user) {
    return res.status(401).send('Not authenticated');
  }
  res.json(req.user);
});

// Get user's YouTube subscriptions
app.get('/api/subscriptions', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const subscriptions = await youtubeService.getSubscriptions(req.user.access_token, req.user.refresh_token);
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Get saved channel selections
app.get('/api/channels', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const channels = await db.query(
      'SELECT * FROM selected_channels WHERE user_id = ?',
      [req.user.id]
    );
    res.json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

// Save channel selections
app.post('/api/channels', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { channels } = req.body;
    if (!Array.isArray(channels) || channels.length > 10) {
      return res.status(400).json({ error: 'Invalid channel selection' });
    }
    
    // Delete existing selections
    await db.query('DELETE FROM selected_channels WHERE user_id = ?', [req.user.id]);
    
    // Insert new selections
    for (const channel of channels) {
      await db.query(
        'INSERT INTO selected_channels (user_id, channel_id, channel_name, channel_thumbnail) VALUES (?, ?, ?, ?)',
        [req.user.id, channel.channelId, channel.channelName, channel.channelThumbnail]
      );
    }
    
    res.json({ success: true, count: channels.length });
  } catch (error) {
    console.error('Error saving channels:', error);
    res.status(500).json({ error: 'Failed to save channels' });
  }
});

// New endpoint for Story 2.2: Fetch and Store Video Data
app.get('/api/refresh-videos', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // CRITICAL: Remove any hardcoded user override - use actual authenticated user
    const currentUser = req.user;
    console.log(`Refreshing videos for user ${currentUser.id} (${currentUser.email})`);
    
    // Get ONLY the channels selected by THIS specific user
    const selectedChannels = await db.query(
      'SELECT * FROM selected_channels WHERE user_id = ?',
      [currentUser.id]
    );

    if (selectedChannels.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'No channels selected for monitoring. Please select channels first.' 
      });
    }

    console.log(`User ${currentUser.id} has ${selectedChannels.length} selected channels:`, 
      selectedChannels.map(c => c.channel_name));

    const allNewVideos = [];
    for (const channel of selectedChannels) {
      try {
        console.log(`Fetching videos for channel: ${channel.channel_name} (${channel.channel_id})`);
        const latestVideos = await youtubeService.getLatestVideosByChannel(
          currentUser.access_token,
          currentUser.refresh_token,
          channel.channel_id
        );
        console.log(`Found ${latestVideos.length} videos for ${channel.channel_name}`);
        allNewVideos.push(...latestVideos);
      } catch (error) {
        console.error(`Error fetching videos for channel ${channel.channel_name}:`, error);
      }
    }

    console.log(`Total videos found across all channels: ${allNewVideos.length}`);

    let savedVideosCount = 0;
    let summarizedVideosCount = 0;

    // Process only 2 videos per call to avoid API limits (temporary)
    const videosToProcess = allNewVideos.slice(0, 2);
    console.log(`Processing ${videosToProcess.length} videos...`);

    for (const video of videosToProcess) {
      try {
        // Check if this specific user already has this video processed
        const existingVideo = await db.query(
          'SELECT video_id FROM video_summaries WHERE video_id = ? AND user_id = ?', 
          [video.videoId, currentUser.id]
        );

        if (existingVideo.length === 0) {
          console.log(`Processing new video: ${video.title} (${video.videoId})`);
          
          const transcript = await transcriptService.getVideoTranscript(video.videoId);
          
          // Insert video with user_id to ensure user isolation
          await db.query(
            'INSERT INTO video_summaries (user_id, video_id, channel_id, title, thumbnail, published_at, summary) VALUES (?, ?, ?, ?, ?, ?, NULL)',
            [currentUser.id, video.videoId, video.channelId, video.title, video.thumbnail, video.publishedAt]
          );
          savedVideosCount++;

          if (transcript) {
            console.log(`Generating summary for ${video.title}...`);
            const summary = await openaiService.generateSummary(transcript);
            if (summary) {
              await db.updateSummary(video.videoId, summary);
              summarizedVideosCount++;
              console.log(`Summary generated for ${video.title}`);
            }
          } else {
            console.log(`No transcript available for ${video.title}`);
          }
        } else {
          console.log(`Video ${video.title} already processed for this user`);
        }
      } catch (error) {
        console.error(`Error processing video ${video.videoId}:`, error);
      }
    }

    const message = `Video refresh completed. Saved ${savedVideosCount} new videos and generated ${summarizedVideosCount} new summaries from ${selectedChannels.length} selected channels.`;
    console.log(message);
    
    res.json({ 
      success: true, 
      message,
      channelsProcessed: selectedChannels.length,
      videosFound: allNewVideos.length,
      videosProcessed: videosToProcess.length,
      newVideosSaved: savedVideosCount,
      newSummariesGenerated: summarizedVideosCount
    });
  } catch (error) {
    console.error('Error in /api/refresh-videos:', error);
    res.status(500).json({ error: 'Failed to initiate video refresh process.' });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Get user-specific video summaries
    const videoSummaries = await db.getUserVideoSummaries(req.user.id, 20);
    const userStats = await db.getUserVideoStats(req.user.id);
    
    console.log(`Dashboard request for user ${req.user.id}: ${videoSummaries.length} summaries found`);
    
    res.json({
      summaries: videoSummaries,
      stats: userStats,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
      }
    });
  } catch (error) {
    console.error('Error in /api/dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

app.get('/auth/status', (req, res) => {
  res.json({
    authenticated: !!req.user, 
    user: req.user || null,
    sessionId: req.sessionID 
  });
});



app.get('/auth/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect(process.env.CLIENT_URL || 'http://localhost:3000/');
  });
});

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
