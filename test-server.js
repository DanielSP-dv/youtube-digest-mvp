const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5100'],
  credentials: true
}));
app.use(express.json());

// Demo mode middleware
app.use((req, res, next) => {
  req.user = {
    id: 1,
    google_id: 'demo_user',
    email: 'demo@example.com',
    name: 'Demo User'
  };
  next();
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test server is working!', user: req.user });
});

// Auth status route
app.get('/auth/status', (req, res) => {
  res.json({
    authenticated: true,
    user: req.user,
    sessionId: 'demo_session'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🔗 Auth status: http://localhost:${PORT}/auth/status`);
});
