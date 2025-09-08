# **5. Components**

This section reflects the updated, simpler component structure.

**Backend Components (Express Server):**

*   **`server.js`:** A single file containing the Express server setup, Passport.js configuration, all authentication routes (`/auth/...`), and all API routes (`/api/...`).
*   **`db.js`:** Manages the database connection and exports helper functions for raw SQL queries.
*   **`services/youtube.js`:** Encapsulates all direct interactions with the YouTube Data API.
*   **`services/openai.js`:** Encapsulates all interactions with the OpenAI API for summarization.
*   **`services/transcript.js`:** A dedicated service to fetch video transcripts, with a fallback mechanism (tries YouTube first, then a service like SearchAPI).

**Frontend Components (React Client):**

*   **`client/src/App.js`:** The root component responsible for client-side routing (`react-router-dom`) and rendering the main navigation header.
*   **`client/src/api.js`:** A utility module for centralizing `fetch` calls to the backend REST API.
*   **`client/src/pages/` (Directory):** Contains the main page components: `Landing.js`, `Channels.js`, `Dashboard.js`, and `Saved.js`.

---
