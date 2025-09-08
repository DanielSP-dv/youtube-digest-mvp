# **8. Source Tree**

This is the definitive, flat file structure for the project, optimized for rapid MVP development.

```plaintext
youtube-digest/
├── client/
│   ├── public/
│   │   └── index.html      # React app HTML template
│   ├── src/
│   │   ├── App.js          # Main React component, routing and nav
│   │   ├── index.js        # React entry point
│   │   ├── api.js          # Backend API helper functions
│   │   └── pages/
│   │       ├── Landing.js
│   │       ├── Channels.js
│   │       ├── Dashboard.js
│   │       └── Saved.js
│   └── package.json        # Client dependencies
├── services/               # Server-side services
│   ├── openai.js
│   ├── transcript.js
│   └── youtube.js
├── server.js               # Main backend file
├── db.js                   # Database helpers
├── .env                    # Environment variables
├── .gitignore
├── package.json            # Root dependencies
└── database.sqlite         # SQLite file (if using)
```

---
