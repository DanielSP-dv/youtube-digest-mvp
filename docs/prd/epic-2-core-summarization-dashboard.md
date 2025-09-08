# **Epic 2: Core Summarization & Dashboard**

**Expanded Goal:** To implement the main value proposition of the application by fetching the latest videos from the user's selected channels, generating high-quality AI summaries for them, and displaying these summaries on a functional and easy-to-use dashboard.

---

### **Story 2.1: Fetch Latest Videos from Selected Channels**

*   **As a** user,
*   **I want** the application to automatically find the latest videos from my selected channels,
*   **so that** I can see the most recent content.

**Acceptance Criteria:**

1.  The system periodically checks for new videos from the channels the user has saved.
2.  For each new video found, its metadata (title, thumbnail, length, channel name) is retrieved and stored in the database.
3.  The system must not create duplicate entries for the same video.

---

### **Story 2.2: Retrieve and Store Video Transcripts**

*   **As a** developer,
*   **I want** to retrieve the transcript for each new video,
*   **so that** it can be used for summarization and saved for the user.

**Acceptance Criteria:**

1.  For each new video, the system makes an API call (e.g., to SearchAPI) to retrieve its full transcript.
2.  The retrieved transcript is saved to the database and associated with the correct video.
3.  The system gracefully handles cases where a transcript is not available for a video.

---

### **Story 2.3: Generate AI Summaries & Chapters**

*   **As a** user,
*   **I want** the application to generate a concise summary and chapter timestamps for each new video,
*   **so that** I can quickly understand its content.

**Acceptance Criteria:**

1.  For each new transcript, the system calls an LLM with a prompt designed to generate a two-paragraph summary.
2.  The LLM also generates chapter timestamps for the video.
3.  The generated summary and chapters are saved to the database with the corresponding video.
4.  The summary is consistently clear, concise, and accurately reflects the video's content.

---

### **Story 2.4: Display Summaries on an Interactive Dashboard (Revised)**

*   **As a** user,
*   **I want** to see the summaries of the latest videos on my dashboard,
*   **so that** I can easily scan and decide what to watch.

**Acceptance Criteria:**

1.  The dashboard page displays a feed of video summary cards for the user's selected channels.
2.  Each card displays the video's thumbnail, title, channel name, video length, and the AI-generated summary.
3.  The cards are displayed in reverse chronological order (newest first).
4.  The dashboard has a clean and uncluttered layout, consistent with our UI goals.
5.  The dashboard automatically refreshes to show the correct videos when the user updates their channel selection on the "Channels" page.
6.  A "Refresh" button is available on the dashboard to allow the user to manually fetch the latest videos at any time.
7.  The AI-generated chapter timestamps are initially hidden on each card. A "Show More" or similar control allows the user to expand the card to view the timestamps.

---
