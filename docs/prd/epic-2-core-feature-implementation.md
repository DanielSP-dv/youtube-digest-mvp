# **Epic 2: Core Feature Implementation**

**Goal:** To implement the primary value proposition: fetching channels, retrieving video data, generating summaries, and displaying them on a dashboard with a basic caching layer.

### **Story 2.1: Fetch and Save User's Channel Selections**

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

### **Story 2.2: Fetch and Store Video Data**

*   **As a** developer,
*   **I want** to create a backend process that fetches video metadata and transcripts for user-selected channels,
*   **so that** the data is available for summarization.

**Acceptance Criteria:**

1.  A backend endpoint (e.g., `/api/refresh-videos`) is created to trigger the process for the logged-in user.
2.  The process iterates through the user's `selected_channels` from the database.
3.  For each channel, it fetches the latest videos (e.g., the 5 most recent).
4.  For each new video, it fetches the transcript.
5.  The video's `video_id`, `channel_id`, and `title` are saved to the `video_summaries` table, but only if the `video_id` doesn't already exist. This acts as a basic cache to prevent re-processing.

### **Story 2.3: Generate and Cache Summaries**

*   **As a** developer,
*   **I want** to generate an AI summary for each new video and cache it in the database,
*   **so that** we can display it to the user and minimize API costs.

**Acceptance Criteria:**

1.  After a new video record is created (from Story 2.2), the system sends its transcript to the OpenAI API.
2.  The prompt limits the context size and requests a short summary to manage cost, as per the defined strategy.
3.  The returned summary is saved to the `summary` column in the `video_summaries` table for the corresponding `video_id`.
4.  This process only runs for videos that have a `NULL` summary, ensuring we don't re-summarize content.

### **Story 2.4: Display Summaries on Dashboard**

*   **As a** logged-in user,
*   **I want** to see the latest video summaries on my dashboard,
*   **so that** I can quickly consume the content.

**Acceptance Criteria:**

1.  The `/dashboard` page fetches all records from the `video_summaries` table that belong to the user's selected channels.
2.  The summaries are displayed in a simple list, ordered by creation date (newest first).
3.  Each item in the list shows the video title and the summary text.
4.  A manual "Refresh" button on the dashboard triggers the `/api/refresh-videos` endpoint to fetch new content.

---
