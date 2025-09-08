# **2. High Level Architecture**

This section outlines the overall structure and patterns for our simplified application.

**Technical Summary:**

The application will be a traditional monolithic web application. The backend is a Node.js server using the **Express** framework, which exposes a simple REST API. The frontend is a standard **React** single-page application (SPA) that will be built into static files and served by the Express server. Data will be stored in a PostgreSQL (or SQLite for local development) database, and authentication will be handled using Passport.js with Google OAuth.

**High Level Overview:**

The architecture is intentionally straightforward. The user's browser will load the React application. All interactions that require data or business logic (like fetching channels, saving selections, or getting summaries) will make REST API calls to the Express backend. The backend will handle all logic, including user sessions, database queries, and secure communication with external services like the YouTube and OpenAI APIs.

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
