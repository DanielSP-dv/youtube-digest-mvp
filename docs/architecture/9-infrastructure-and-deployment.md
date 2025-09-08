# **9. Infrastructure and Deployment**

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

*   The Express server will listen on `process.env.PORT`, which is automatically provided and managed by the hosting platform.

**Domain & SSL:**

*   The hosting platform will provide a default domain with HTTPS/SSL automatically enabled. Custom domains can be configured later as needed.

---
