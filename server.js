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

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');
const youtubeService = require('./services/youtube');
const transcriptService = require('./services/transcript');
const openaiService = require('./services/openai');
const db = require('./db');

const app = express();
app.set('trust proxy', 1); // Mandatory for Railway proxy

const DEMO_MODE = process.env.DEMO_MODE === 'true';

app.use(express.json()); // Middleware to parse JSON bodies

// Demo mode middleware
if (DEMO_MODE) {
  app.use((req, res, next) => {
    req.user = { id: 1, email: 'demo@demo.com', name: 'Demo User', access_token: null, refresh_token: null };
    next();
  });
} else {
  // Session and Passport setup for real auth
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }));

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

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
          await db.updateUserTokens(profile.id, accessToken, refreshToken);
          user.access_token = accessToken;
          user.refresh_token = refreshToken;
          console.log('Found existing user, updated tokens:', user);
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));
}

// --- API ROUTES ---

// Auth routes
app.get('/auth/google', passport.authenticate('google', { 
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly'],
  accessType: 'offline',
  prompt: 'consent'
}));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL }), (req, res) => {
  res.redirect(process.env.CLIENT_URL);
});

app.get('/auth/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect(process.env.CLIENT_URL || 'http://localhost:3000/');
  });
});

app.get('/auth/status', (req, res) => {
  res.json({
    authenticated: !!req.user, 
    user: req.user || null,
    sessionId: req.sessionID 
  });
});

// App API routes
app.get('/api/subscriptions', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!req.user.access_token && !process.env.YOUTUBE_API_KEY) {
      console.log('Skipping subscriptions fetch in demo mode without API key.');
      return res.json([]);
    }
    const subscriptions = await youtubeService.getSubscriptions(req.user.access_token, req.user.refresh_token);
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const videoSummaries = await db.getUserVideoSummaries(req.user.id, 20);
    const userStats = await db.getUserVideoStats(req.user.id);
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

// ... other api routes ...

// --- STATIC FILE SERVING ---
// This must be after all API routes

const buildDir = path.join(__dirname, 'client/dist');
app.use(express.static(buildDir));

// The "catchall" handler for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
