# **Epic 1: Foundation & Deployment Skeleton**

**Goal:** To set up and deploy a minimal, working application skeleton with Google OAuth functioning, establishing the complete development-to-deployment loop on Railway or Render.

### **Story 1.1: Backend & Authentication Setup**

*   **As a** developer,
*   **I want** to set up a basic Express server and configure Google OAuth using Passport.js,
*   **so that** the application has a secure authentication entry point.

**Acceptance Criteria:**

1.  An Express server is running and listening for requests.
2.  Passport.js is configured with the Google OAuth2 strategy using credentials from environment variables.
3.  The `/auth/google` route successfully initiates the Google login flow.
4.  The `/auth/google/callback` route correctly handles the OAuth callback, creating a user session.
5.  Upon successful authentication, the user's Google ID and email are saved to the `users` table in the database.

### **Story 1.2: Frontend Application Shell**

*   **As a** developer,
*   **I want** to create a basic React application with placeholder pages and routing,
*   **so that** we have a navigable frontend structure.

**Acceptance Criteria:**

1.  A `create-react-app` project is initialized within the `client` directory.
2.  Basic client-side routing is set up for the routes: `/` (Login), `/dashboard`, and `/channels`.
3.  A persistent header component is created.
4.  The header displays a "Login" button if no user is authenticated.
5.  The header displays the user's email and a "Logout" button if a user is authenticated.

### **Story 1.3: Database Setup**

*   **As a** developer,
*   **I want** to set up the initial database schema and connect it to the backend,
*   **so that** the application has a persistent data layer.

**Acceptance Criteria:**

1.  A SQL script exists that creates the `users`, `selected_channels`, and `video_summaries` tables as specified in the new plan.
2.  The Express server successfully connects to the database (e.g., SQLite for local development).
3.  The database connection string is managed via the `DATABASE_URL` environment variable.

### **Story 1.4: Initial Deployment & Verification**

*   **As a** developer,
*   **I want** to deploy the complete application skeleton to a public hosting provider,
*   **so that** we can verify the end-to-end deployment process and authentication flow.

**Acceptance Criteria:**

1.  The project is successfully deployed to Railway or Render.
2.  The deployed application serves the React frontend.
3.  The deployed backend API is reachable.
4.  The Google OAuth flow, including the callback URL, works correctly in the deployed environment.
5.  A user can successfully log in and log out on the live application.

---
