# YouTube Digest MVP Architecture Document

## **1. Introduction**

This document outlines the simplified project architecture for the YouTube Digest MVP. It is designed to be implemented with an Express.js backend and a static React frontend, deployed on Railway or Render. Its primary goal is to provide a clear, minimal, and cost-effective technical blueprint that directly supports the revised PRD.

**Change Log:**

| Date       | Version | Description                               | Author            |
| :--------- | :------ | :---------------------------------------- | :---------------- |
| 2025-09-02 | 2.0     | New architecture based on strategic pivot | Winston (Architect) |
| 2025-09-04 | 2.1     | Implemented real auth check, fixed backend logout, added API error handling, updated client proxy, and resolved syntax errors. | AI Agent          |

---

## **2. High Level Architecture**

This section outlines the overall structure and patterns for our simplified application.

**Technical Summary:**

The application will be a traditional monolithic web application. The backend is a Node.js server using the **Express** framework, which exposes a simple REST API. The frontend is a standard **React** single-page application (SPA) that will be built into static files and served by the Express server. Data will be stored in a PostgreSQL (or SQLite for local development) database, and authentication will be handled using Passport.js with Google OAuth.

**High Level Overview:**

The architecture is intentionally straightforward. The user's browser will load the React application. All interactions that require data or business logic (like fetching channels, saving selections, or getting summaries) will make REST API calls to the Express backend. Notably, the frontend now explicitly relies on server-side sessions and status checks for authentication. The backend will handle all logic, including user sessions, database queries, and secure communication with external services like the YouTube and OpenAI APIs.

**High Level Project Diagram:**

```mermaid
graph TD
    A[User's Browser] --> B[React Static Files];
    B --> C{Express Server on Railway/Render};
    C --> D[REST API Endpoints];
    D --> E[Passport.js for Auth];
    D --> F[Database (PostgreSQL/SQLite)];
    D --> G[YouTube Data API];
    D --> H[OpenAI API];

    subgraph "Client"
        B
    end

    subgraph "Server"
        C
    end
```

**Architectural and Design Patterns:**

*   **Monolithic Architecture:** A single, unified codebase for the entire application (backend and frontend client code). This is the simplest pattern, reducing deployment and development complexity.
*   **RESTful API:** The backend will expose API endpoints following REST principles for clear, standard communication with the frontend.
*   **Client-Side Rendering:** The React app will be a client-side rendered application (SPA). The Express server's primary role is to serve the static React files and provide the API, not to render pages on the server.

---

## **3. Tech Stack**

This table defines the definitive technology choices for the project, based on the new strategy.

| Category             | Technology                     | Version      | Purpose                           | Rationale                                                  |
| :------------------- | :----------------------------- | :----------- | :-------------------------------- | :--------------------------------------------------------- |
| **Language**         | JavaScript (ES6+)              | Node.js 18.x | Primary development language      | Simplicity and speed of development.                       |
| **Backend Framework**| Express.js                     | ~4.18.2      | Building the REST API             | Minimal, fast, and unopinionated.                          |
| **Frontend Library** | React                          | ~18.2.0      | Building the user interface       | Industry standard, bootstrapped with `create-react-app`.   |
| **Database**         | SQLite                         | Latest       | Storing application data          | Reliable, free tiers available. Chosen for simplicity and local development. |
| **Database Interaction**| Raw SQL (`pg` or `sqlite3`) | Latest       | Direct database communication     | Simplicity, avoids ORM overhead.                           |
| **Authentication**   | Passport.js                    | ~0.6.0       | Handling Google OAuth             | Standard, flexible authentication middleware for Node.js.  |
| **Package Manager**  | npm                            | Latest       | Managing project dependencies     | Standard Node.js package manager, avoiding pnpm issues.    |
| **Deployment**       | Railway / Render               | N/A          | Hosting and deployment            | Simple Git-based deployment with integrated databases.     |
| **External APIs**    | YouTube Data API, OpenAI API   | N/A          | Core application functionality    | As defined in the PRD.                                     |

---

## **4. Data Models**

The data model is intentionally flat and simple to support the MVP's core functionality while minimizing complexity. It consists of three tables.

#### **1. users**

*   **Purpose:** Stores essential authentication and identity data for each user from their Google login.
*   **Attributes:** `id`, `google_id`, `email`, `name`, `access_token`, `refresh_token`, `created_at`.
*   **Relationships:** A `user` has a one-to-many relationship with `selected_channels`.

#### **2. selected_channels**

*   **Purpose:** Links users to the specific YouTube channels they choose to monitor.
*   **Attributes:** `user_id` (FK), `channel_id`, `channel_name`, `channel_thumbnail`, `created_at`.
*   **Relationships:** This table joins `users` to the concept of a channel.

#### **3. video_summaries**

*   **Purpose:** Serves as a cache for generated summaries to avoid costly re-processing of videos.
*   **Attributes:** `id`, `video_id`, `channel_id`, `title`, `thumbnail`, `published_at`, `summary`, `created_at`.
*   **Relationships:** This table is keyed by the unique `video_id`.

---

## **5. Components**

This section reflects the updated, simpler component structure.

**Backend Components (Express Server):**

*   **`server.js`:** A single file containing the Express server setup, Passport.js configuration, all authentication routes (`/auth/...`), and all API routes (`/api/...`). Error handling has been added to API routes for robustness.
*   **`db.js`:** Manages the database connection and exports helper functions for raw SQL queries.
*   **`services/youtube.js`:** Encapsulates all direct interactions with the YouTube Data API.
*   **`services/openai.js`:** Encapsulates all interactions with the OpenAI API for summarization.
*   **`services/transcript.js`:** A dedicated service to fetch video transcripts, with a fallback mechanism (tries YouTube first, then a service like SearchAPI).

**Frontend Components (React Client):**

*   **`client/src/App.js`:** The root component responsible for client-side routing (`react-router-dom`) and rendering the main navigation header.
*   **`client/src/api.js`:** A utility module for centralizing `fetch` calls to the backend REST API.
*   **`client/src/pages/` (Directory):** Contains the main page components: `Landing.js`, `Channels.js`, `Dashboard.js`, and `Saved.js`.

---

## **6. External APIs**

*   **Google OAuth API:** For user authentication.
*   **YouTube Data API:** For fetching channel and video data.
*   **OpenAI API:** For generating summaries.
*   **SearchAPI (or similar transcript service):** To provide a reliable fallback for fetching video transcripts.

---

## **7. Database Schema**

This section contains the definitive SQL Data Definition Language (DDL) for the project's database.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE selected_channels (
  user_id INTEGER NOT NULL,
  channel_id VARCHAR(255) NOT NULL,
  channel_name VARCHAR(255) NOT NULL,
  channel_thumbnail TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, channel_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE video_summaries (
  id SERIAL PRIMARY KEY,
  video_id VARCHAR(255) UNIQUE NOT NULL,
  channel_id VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  thumbnail TEXT,
  published_at TIMESTAMP,
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## **8. Source Tree**

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

## **9. Infrastructure and Deployment**

This section describes the simple, Git-based deployment workflow for the application.

**Deployment Platform:**

*   The application will be deployed on **Railway** or **Render**.
*   These platforms are chosen for their generous free tiers, integrated PostgreSQL databases, and simple deployment from a GitHub repository.

**Deployment Strategy:**

*   **Method:** Continuous Deployment via a connected GitHub repository. Every push to the `main` branch will trigger a new production deployment.
*   **Build & Start Scripts:** The platform will use the scripts defined in the root `package.json`:
    ```json
    "scripts": {
      "build": "cd client && npm install && npm run build && cd ..",
      "start": "node server.js"
    }
    ```
*   **CI/CD:** The entire build and deployment pipeline is managed automatically by the chosen hosting platform.

**Environment Variables Management:**

*   The following environment variables must be configured in the platform's dashboard before the first deployment:
    ```
    DATABASE_URL (auto-provided by platform)
    GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET
    YOUTUBE_API_KEY
    OPENAI_API_KEY
    SEARCHAPI_KEY
    SESSION_SECRET
    NODE_ENV=production
    CLIENT_URL (your production URL)
    ```

**Port Configuration:**

*   The Express server will listen on `process.env.PORT`, which is automatically provided and managed by the hosting platform. For local development, the backend runs on port `5001`.
*   The React frontend runs on port `3000`.
*   The client's proxy is configured to `http://localhost:5001` to route API requests to the backend.

**Domain & SSL:**

*   The hosting platform will provide a default domain with HTTPS/SSL automatically enabled. Custom domains can be configured later as needed.

---

## **10. Coding Standards**

**Code Style:**

*   **JavaScript Standard:** Use consistent formatting (2 spaces for indentation).
*   **No Semicolons:** Follow modern JS convention of omitting semicolons.
*   **Async/Await:** Prefer async/await over callbacks for cleaner code.
*   **Error Handling:** Every async function must have try/catch blocks.

**Naming Conventions:**

*   Variables and functions: `camelCase`
*   Constants: `UPPER_SNAKE_CASE`
*   React components: `PascalCase`
*   Files: `lowercase-with-dashes` or `camelCase`

**Comment Requirements:**

*   Every non-obvious function needs a comment explaining its purpose.

---

## **11. Testing Strategy**

**MVP Testing Approach:**

*   **Manual Testing Only:** No automated tests are required for the MVP.
*   Validation will be performed by testing each feature locally before committing and after deployment.

**Testing Checklist:**

- [ ] User can log in with Google.
- [ ] Channels load and can be selected/saved.
- [ ] Dashboard shows summaries.
- [ ] Save for Later (`localStorage`) works.
- [ ] User can log out.
- [ ] Sessions persist on refresh.

---

## **12. Security Considerations**

**Essential Security Measures:**

1.  **Environment Variables:** The `.env` file must never be committed to version control.
2.  **Session Secret:** Use a long, random string (32+ characters) for the session secret.
3.  **Token Storage:** User access tokens must only be stored and used on the backend, never exposed to the frontend.
4.  **Input Validation:** Sanitize all user input, especially the channel selections (e.g., limit to 10).
5.  **HTTPS Only:** The production deployment must enforce HTTPS.
6.  **CORS:** The Express server should be configured to only allow requests from the frontend domain.

---

### **Next Steps**

The planning phase is complete. This PRD and Architecture document provide the full blueprint for the MVP. The next step is to begin development, starting with Story 1.1 from the PRD.
