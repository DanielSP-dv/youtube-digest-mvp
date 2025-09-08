# **3. Tech Stack**

This table defines the definitive technology choices for the project, based on the new strategy.

| Category             | Technology                     | Version      | Purpose                           | Rationale                                                  |
| :------------------- | :----------------------------- | :----------- | :-------------------------------- | :--------------------------------------------------------- |
| **Language**         | JavaScript (ES6+)              | Node.js 18.x | Primary development language      | Simplicity and speed of development.                       |
| **Backend Framework**| Express.js                     | ~4.18.2      | Building the REST API             | Minimal, fast, and unopinionated.                          |
| **Frontend Library** | React                          | ~18.2.0      | Building the user interface       | Industry standard, bootstrapped with `create-react-app`.   |
| **Database**         | PostgreSQL / SQLite            | Latest       | Storing application data          | Reliable, free tiers available. SQLite for simple local dev. |
| **Database Interaction**| Raw SQL (`pg` or `sqlite3`) | Latest       | Direct database communication     | Simplicity, avoids ORM overhead.                           |
| **Authentication**   | Passport.js                    | ~0.6.0       | Handling Google OAuth             | Standard, flexible authentication middleware for Node.js.  |
| **Package Manager**  | npm                            | Latest       | Managing project dependencies     | Standard Node.js package manager, avoiding pnpm issues.    |
| **Deployment**       | Railway / Render               | N/A          | Hosting and deployment            | Simple Git-based deployment with integrated databases.     |
| **External APIs**    | YouTube Data API, OpenAI API, Supadata | N/A          | Core application functionality    | As defined in the PRD.                                     |

---
