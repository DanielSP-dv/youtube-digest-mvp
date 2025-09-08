# **Requirements**

**Functional Requirements:**

1.  **FR1:** Users must be able to authenticate using their Google Account (e.g., via Passport.js).
2.  **FR2:** Authenticated users must be able to select up to 10 of their YouTube channels to monitor.
3.  **FR3:** The system must save the user's channel selections to the database.
4.  **FR4:** A dashboard must display AI-generated summaries for videos from the selected channels.
5.  **FR5:** Users must be able to save summaries to a simple "Saved for later" list, which can be implemented using browser `localStorage`.
6.  **FR6:** The system must provide a clear logout mechanism.

**Non-Functional Requirements:**

1.  **NFR1 (Cost):** The system must aggressively cache all external API calls (YouTube, OpenAI) and limit processing (e.g., max 5 new videos per refresh, limited prompt context) to stay within free or low-cost tiers.
2.  **NFR2 (Simplicity):** The codebase must be plain JavaScript. TypeScript, tRPC, Prisma, and a monorepo structure are explicitly forbidden for this phase.
3.  **NFR3 (Stack):** The backend will be a simple Express server with REST endpoints. The frontend will be a standard `create-react-app` build.
4.  **NFR4 (Deployment):** The application must be deployable on Railway or Render.
5.  **NFR5 (Testing):** No automated tests are required. All validation will be done via manual testing.
6.  **NFR6 (UX):** Features like email digests and complex, database-backed playlists are out of scope. UI placeholders may be used for these deferred features.

---
