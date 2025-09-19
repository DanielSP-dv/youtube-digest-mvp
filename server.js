const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');
const youtubeService = require('./services/youtube');
const db = require('./db');

const app = express();

app.set('trust proxy', 1); // required on Railway behind TLS
app.use(express.json());

const DEMO_MODE = process.env.DEMO_MODE === 'true';

if (DEMO_MODE) {
  app.use((req, _res, next) => {
    req.user = { id: 1, email: 'demo@demo', name: 'Demo User' };
    next();
  });
} else {
  // Real auth middleware
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }));

  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
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
        } else {
          await db.updateUserTokens(profile.id, accessToken, refreshToken);
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));
}

// --- API & AUTH ROUTES ---

app.get('/auth/status', (req, res) => {
  res.type('application/json').json({
    authenticated: !!req.user,
    user: req.user || null
  });
});

app.get('/auth/google', passport.authenticate('google', { 
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly'],
  accessType: 'offline',
  prompt: 'consent'
}));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL || '/' }), (req, res) => {
  res.redirect(process.env.CLIENT_URL || '/');
});

app.get('/api/channels', async (req, res) => {
  try {
    if (DEMO_MODE) {
      return res.json([
        { channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw', channelName: 'Google Developers', channelThumbnail: '' },
        { channelId: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw', channelName: 'Facebook Developers', channelThumbnail: '' },
        { channelId: 'UClb90NQQcskPUGDIXsQEz5Q', channelName: 'Amazon Web Services', channelThumbnail: '' },
      ]);
    }
    if (!req.user?.access_token && !process.env.YOUTUBE_API_KEY) {
      return res.json([]);
    }
    const items = await youtubeService.getSubscriptions(
      req.user?.access_token,
      req.user?.refresh_token
    );
    return res.json(items || []);
  } catch (err) {
    console.error('GET /api/channels failed:', err);
    return res.status(500).type('application/json').json({ error: 'Failed to load channels' });
  }
});

// --- STATIC ASSET SERVING & SPA FALLBACK ---

const buildDir = path.join(__dirname, 'client', 'dist');
app.use(express.static(buildDir));

// SPA fallback, must be the last route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/auth/')) {
    return next();
  }
  res.sendFile(path.join(buildDir, 'index.html'));
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log('Server listening on', port));