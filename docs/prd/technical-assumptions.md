# **Technical Assumptions**

This section codifies the simplified technical strategy. All development must adhere to these constraints.

**1. Repository Structure:**

*   **Simple Monolith:** The project will be a single application with one `package.json`, not a monorepo.

**2. Service Architecture:**

*   **Backend:** A simple Node.js server using the **Express** framework.
*   **Frontend:** A standard client-side React application, likely bootstrapped with `create-react-app` and served as a static build.

**3. Testing Requirements:**

*   **Manual Testing Only:** No automated unit, integration, or E2E tests are required for this phase. All validation will be performed manually.

**4. Additional Technical Assumptions and Requests:**

*   **Language:** The entire codebase will be written in **plain JavaScript**. TypeScript is explicitly excluded.
*   **API Style:** The backend will expose simple **REST API endpoints**. tRPC is explicitly excluded.
*   **Database Interaction:** The backend will interact with the database using **raw SQL queries** (e.g., via the `pg` or `sqlite3` package). ORMs like Prisma are explicitly excluded.
*   **Authentication:** User authentication will be handled using **Passport.js** with the Google OAuth2 strategy. NextAuth.js is explicitly excluded.
*   **Deployment:** The application will be deployed on **Railway** or **Render**. Vercel is explicitly excluded.
*   **Package Manager:** The project will use **npm** for dependency management. pnpm is explicitly excluded.

---
