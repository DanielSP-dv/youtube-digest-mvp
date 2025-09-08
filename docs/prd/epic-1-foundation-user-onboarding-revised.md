# **Epic 1: Foundation & User Onboarding (Revised)**

**Expanded Goal:** To establish the project's technical foundation by creating a complete, navigable application shell with a persistent layout and working authentication. This epic will deliver the first piece of user value by allowing users to log in, log out, and see the placeholder pages for all core application areas.

---

### **Story 1.1: Project Setup & Application Shell**

*   **As a** developer,
*   **I want** to set up the initial project structure with a persistent layout and placeholder pages for all main sections,
*   **so that** we have a solid, navigable skeleton to build features upon.

**Acceptance Criteria:**

1.  A new monorepo is created and managed with `pnpm`.
2.  A simple Node.js/Express backend server is running.
3.  A simple React frontend is running with a persistent layout (e.g., a collapsible side navigation panel).
4.  The side navigation panel contains links to placeholder pages for "Dashboard", "Channels", and "Playlists".
5.  Basic routing is implemented to allow navigation between the landing page and these placeholder pages.
6.  A "Logout" button is visible in the main layout *only when a user is logged in*.

---

### **Story 1.2: User Authentication & Logout**

*   **As a** user,
*   **I want** to log in with my Google account and be able to log out,
*   **so that** I can securely manage my session.

**Acceptance Criteria:**

1.  Clicking a "Login" or "Create Your Digest" button initiates the Google OAuth flow.
2.  After successful authentication, the user is redirected to the **Channels** page (as the first step of onboarding).
3.  A user session is created and managed.
4.  Clicking the "Logout" button successfully terminates the user's session.
5.  After logging out, the user is redirected to the landing page and can no longer access protected pages (Channels, Dashboard, etc.).

---

### **Story 1.3: Fetch, Display, and Save Channel Subscriptions**

*   **As a** logged-in user,
*   **I want** to see my YouTube channel subscriptions on the "Channels" page and save my selection,
*   **so that** I can control which channels the application will monitor.

**Acceptance Criteria:**

1.  When a logged-in user navigates to the "Channels" page, their subscriptions are fetched from the YouTube Data API.
2.  The list of channels is displayed, each with a toggle.
3.  The user can select up to 10 channels.
4.  The user's selection is saved to the database.
5.  When the user revisits this page, their previously saved selection is displayed correctly.

---
