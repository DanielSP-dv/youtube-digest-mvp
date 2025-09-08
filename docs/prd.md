# YouTube Digest Product Requirements Document (PRD)

## **Goals and Background Context**

**Goals:**

*   Rapidly deploy a functional MVP to a public server (e.g., Railway or Render) for testing with an initial user base.
*   Strictly manage and minimize operational costs, particularly for the YouTube API and OpenAI services.
*   Validate the core value proposition with a simplified, reliable application before investing in a more complex architecture.

**Background Context:**

This document outlines a strategic pivot for the YouTube Digest project. The initial architecture (T3 Stack, Vercel, tRPC) was determined to be too complex and potentially costly for the immediate goal of a public demo. This revised PRD defines a leaner MVP with a simplified technology stack (e.g., Express, plain JavaScript, simple REST APIs) to accelerate deployment, control costs, and gather user feedback efficiently.

**Change Log:**

| Date       | Version | Description                                        | Author      |
| :--------- | :------ | :------------------------------------------------- | :---------- |
| 2025-09-02 | 2.0     | Strategic pivot to simplified stack and MVP scope. | BMad Master |

---

## **Requirements**

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

## **User Interface Design Goals**

**Overall UX Vision:**
The user experience will be purely functional and lightweight. The design should prioritize speed and ease of use over aesthetics. The goal is a simple interface that works reliably without adding development complexity.

**Key Interaction Paradigms:**

*   The application will be a standard multi-page application with simple navigation.
*   Interactions will be based on standard HTML forms and buttons.
*   No complex state management or real-time updates are required. A full page refresh on action is acceptable.

**Core Screens and Views:**

*   **Login Page:** A page with a single "Login with Google" button.
*   **Channels Page:** A list of the user's YouTube subscriptions with checkboxes for selection and a "Save" button.
*   **Dashboard Page:** A simple, reverse-chronological list of video summaries.
*   **Saved Page:** A list of links to saved summaries, managed via `localStorage`.

**Target Device and Platforms:**
The application will be **Web Responsive**, functional on both desktop and mobile browsers, but without complex responsive adaptations.

**Branding:**
No specific branding is required. The UI will use default browser styles or a minimal, utility-first CSS approach to ensure fast implementation.

---

## **Technical Assumptions**

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

## **Epic List**

*   **Epic 1: Foundation & Deployment Skeleton**
    *   **Goal:** To set up and deploy a minimal, working application skeleton with Google OAuth functioning, establishing the complete development-to-deployment loop on Railway or Render.

*   **Epic 2: Core Feature Implementation**
    *   **Goal:** To implement the primary value proposition: fetching channels, retrieving video data, generating summaries, and displaying them on a dashboard with a basic caching layer.

*   **Epic 3: Polish & User Experience**
    *   **Goal:** To add essential user experience features like a "Save for later" list, loading states, and basic error handling.

---

## **Epic 1: Foundation & Deployment Skeleton**

**Goal:** To set up and deploy a minimal, working application skeleton with Google OAuth functioning, establishing the complete development-to-deployment loop on Railway or Render.

#### **Story 1.1: Backend & Authentication Setup**

*   **As a** developer,
*   **I want** to set up a basic Express server and configure Google OAuth using Passport.js,
*   **so that** the application has a secure authentication entry point.

**Acceptance Criteria:**

1.  An Express server is running and listening for requests.
2.  Passport.js is configured with the Google OAuth2 strategy using credentials from environment variables.
3.  The `/auth/google` route successfully initiates the Google login flow.
4.  The `/auth/google/callback` route correctly handles the OAuth callback, creating a user session.
5.  Upon successful authentication, the user's Google ID and email are saved to the `users` table in the database.

#### **Story 1.2: Frontend Application Shell**

*   **As a** developer,
*   **I want** to create a basic React application with placeholder pages and routing,
*   **so that** we have a navigable frontend structure.

**Acceptance Criteria:**

1.  A `create-react-app` project is initialized within the `client` directory.
2.  Basic client-side routing is set up for the routes: `/` (Login), `/dashboard`, and `/channels`.
3.  A persistent header component is created.
4.  The header displays a "Login" button if no user is authenticated.
5.  The header displays the user's email and a "Logout" button if a user is authenticated.

#### **Story 1.3: Database Setup**

*   **As a** developer,
*   **I want** to set up the initial database schema and connect it to the backend,
*   **so that** the application has a persistent data layer.

**Acceptance Criteria:**

1.  A SQL script exists that creates the `users`, `selected_channels`, and `video_summaries` tables as specified in the new plan.
2.  The Express server successfully connects to the database (e.g., SQLite for local development).
3.  The database connection string is managed via the `DATABASE_URL` environment variable.

#### **Story 1.4: Initial Deployment & Verification**

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

## **Epic 2: Core Feature Implementation**

**Goal:** To implement the primary value proposition: fetching channels, retrieving video data, generating summaries, and displaying them on a dashboard with a basic caching layer.

#### **Story 2.1: Fetch and Save User's Channel Selections**

*   **As a** logged-in user,
*   **I want** to view my YouTube subscriptions and save up to 10 channels,
*   **so that** I can specify which channels to get digests for.

**Acceptance Criteria:**

1.  On the `/channels` page, an API call is made to fetch the user's YouTube subscriptions using their stored OAuth token.
2.  The list of channels is displayed with checkboxes.
3.  The user can select up to 10 channels.
4.  Clicking a "Save" button sends the selected channel IDs to the backend.
5.  The backend saves the `user_id` and `channel_id` pairs into the `selected_channels` table, replacing any previous selections for that user.
6.  Previously saved selections are pre-filled when the user revisits the page.

#### **Story 2.2: Fetch and Store Video Data**

*   **As a** developer,
*   **I want** to create a backend process that fetches video metadata and transcripts for user-selected channels,
*   **so that** the data is available for summarization.

**Acceptance Criteria:**

1.  A backend endpoint (e.g., `/api/refresh-videos`) is created to trigger the process for the logged-in user.
2.  The process iterates through the user's `selected_channels` from the database.
3.  For each channel, it fetches the latest videos (e.g., the 5 most recent).
4.  For each new video, it fetches the transcript.
5.  The video's `video_id`, `channel_id`, and `title` are saved to the `video_summaries` table, but only if the `video_id` doesn't already exist. This acts as a basic cache to prevent re-processing.

#### **Story 2.3: Generate and Cache Summaries**

*   **As a** developer,
*   **I want** to generate an AI summary for each new video and cache it in the database,
*   **so that** we can display it to the user and minimize API costs.

**Acceptance Criteria:**

1.  After a new video record is created (from Story 2.2), the system sends its transcript to the OpenAI API.
2.  The prompt limits the context size and requests a short summary to manage cost, as per the defined strategy.
3.  The returned summary is saved to the `summary` column in the `video_summaries` table for the corresponding `video_id`.
4.  This process only runs for videos that have a `NULL` summary, ensuring we don't re-summarize content.

#### **Story 2.4: Display Summaries on Dashboard**

*   **As a** logged-in user,
*   **I want** to see the latest video summaries on my dashboard,
*   **so that** I can quickly consume the content.

**Acceptance Criteria:**

1.  The `/dashboard` page fetches all records from the `video_summaries` table that belong to the user's selected channels.
2.  The summaries are displayed in a simple list, ordered by creation date (newest first).
3.  Each item in the list shows the video title and the summary text.
4.  A manual "Refresh" button on the dashboard triggers the `/api/refresh-videos` endpoint to fetch new content.

---

## **Epic 3: Polish & User Experience**

**Goal:** To add essential user experience features like a "Save for later" list, loading states, and basic error handling.

#### **Story 3.1: "Save for Later" Functionality**

*   **As a** user,
*   **I want** a way to save interesting summaries,
*   **so that** I can easily find them again later.

**Acceptance Criteria:**

1.  Each summary card on the dashboard has a "Save" button.
2.  Clicking "Save" stores the video's ID and title in the browser's `localStorage`.
3.  A "Saved Items" link is available in the main navigation.
4.  The "Saved Items" page retrieves the list from `localStorage` and displays the saved video titles.
5.  The user can remove items from their saved list, which updates `localStorage`.

#### **Story 3.2: Add Basic Loading States**

*   **As a** user,
*   **I want** to see loading indicators when the application is fetching data,
*   **so that** I know the system is working and I'm not looking at a frozen page.

**Acceptance Criteria:**

1.  A loading message or spinner is displayed on the `/channels` page while subscriptions are being fetched.
2.  A loading message or spinner is displayed on the `/dashboard` page while summaries are being fetched.
3.  The "Refresh" button on the dashboard is disabled and shows a "Refreshing..." state while the backend is processing new videos.

#### **Story 3.3: Add Basic Error Handling**

*   **As a** user,
*   **I want** to see a clear message if something goes wrong,
*   **so that** I am not left with a blank or broken page.

**Acceptance Criteria:**

1.  If an API call to the backend fails, a user-friendly error message (e.g., "Could not load data. Please try again later.") is displayed on the relevant page.
2.  Sensitive error details are not exposed to the user in the UI.
3.  The application does not crash on a failed API call.

#### **Story 3.4: Apply Basic Styling**

*   **As a** developer,
*   **I want** to apply minimal, clean styling to the application,
*   **so that** it is presentable and usable for the demo.

**Acceptance Criteria:**

1.  A simple, consistent layout is applied to all pages (Login, Channels, Dashboard, Saved).
2.  Buttons, lists, and text are styled for readability using basic CSS.
3.  The application has a clean and professional, yet minimal, look, avoiding unpolished default browser styles.

---

## **Next Steps**

**Architect Prompt:**
The revised PRD is complete. The next step is to create a new, simplified Architecture Document that reflects the updated technical assumptions (Express, JS, raw SQL, Railway/Render) and supports the epics and stories defined herein.