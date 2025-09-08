# **Epic 3: Digest & Organization**

**Expanded Goal:** To enhance the user experience by delivering the generated summaries via a scheduled email digest and providing a simple yet effective playlist system for organizing saved content for future reference.

---

### **Story 3.1: Save to "Watch Later" Playlist**

*   **As a** user,
*   **I want** to save a video summary to a default "Watch Later" list,
*   **so that** I can easily find interesting videos later.

**Acceptance Criteria:**

1.  Each video card on the dashboard has a "Save to Watch Later" button.
2.  Clicking the button adds the video to the user's "Watch Later" playlist.
3.  The button provides clear visual feedback (e.g., changes state) to confirm the video has been saved.
4.  The "Watch Later" playlist is accessible from the main navigation.
5.  The "Watch Later" page displays a list of all videos the user has saved.

---

### **Story 3.2: Create and Manage Custom Playlists**

*   **As a** user,
*   **I want** to create my own playlists with custom names,
*   **so that** I can organize saved videos by topic or project.

**Acceptance Criteria:**

1.  The user can create new playlists with custom names (e.g., "Business", "Learning").
2.  The user can add any video from the dashboard to one or more of their custom playlists.
3.  The user can view the videos within each custom playlist.
4.  The user can remove videos from a playlist.
5.  The user can rename or delete their custom playlists.

---

### **Story 3.3: Configure Email Digest Settings**

*   **As a** user,
*   **I want** to configure the settings for my email digest,
*   **so that** I can receive it when it's most convenient for me.

**Acceptance Criteria:**

1.  A settings page allows the user to enable or disable the email digest feature.
2.  The user can choose the frequency of the digest (e.g., daily or weekly).
3.  The user can set the time of day for the digest to be sent.
4.  The user can confirm or change the email address where the digest should be sent.

---

### **Story 3.4: Send Email Digest**

*   **As a** user,
*   **I want** to receive a digest of new video summaries in my email,
*   **so that** I can stay up-to-date without having to visit the app.

**Acceptance Criteria:**

1.  A scheduled task runs at the user-defined time to generate and send the email digest.
2.  The email contains the summaries of all new videos published since the last digest was sent.
3.  The email is well-formatted and easy to read on both desktop and mobile devices.
4.  Each summary in the email includes a direct link to the original YouTube video.

---
