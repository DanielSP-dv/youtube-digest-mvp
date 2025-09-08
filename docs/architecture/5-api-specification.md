# **5. API Specification**

### **tRPC Router Definitions**

Our internal API will be built using tRPC, providing end-to-end type safety between our React frontend and Next.js API routes.

**High-Level Routers:**

*   **`authRouter`**: Handles all user authentication-related procedures.
    *   **Procedures:**
        *   `login.query()`: Initiates Google OAuth login.
        *   `logout.mutation()`: Ends user session.
        *   `getSession.query()`: Retrieves current user session details.
*   **`channelRouter`**: Manages user's YouTube channel selections.
    *   **Procedures:**
        *   `getSubscriptions.query()`: Fetches user's YouTube channel subscriptions.
        *   `getSelectedChannels.query()`: Retrieves channels the user has selected to monitor.
        *   `updateSelectedChannels.mutation()`: Saves/updates user's selected channels.
*   **`videoRouter`**: Handles fetching, processing, and displaying video summaries.
    *   **Procedures:**
        *   `getLatestVideos.query()`: Fetches latest videos from selected channels (triggers transcript retrieval and summarization if needed).
        *   `getVideoSummary.query()`: Retrieves a specific video's summary and details.
        *   `refreshDashboard.mutation()`: Triggers a manual refresh of the dashboard content.
*   **`playlistRouter`**: Manages user's playlists and saved videos.
    *   **Procedures:**
        *   `createPlaylist.mutation()`: Creates a new custom playlist.
        *   `getPlaylists.query()`: Retrieves all user's playlists (including "Watch Later").
        *   `addVideoToPlaylist.mutation()`: Adds a video to a specified playlist.
        *   `removeVideoFromPlaylist.mutation()`: Removes a video from a playlist.
        *   `renamePlaylist.mutation()`: Renames a custom playlist.
        *   `deletePlaylist.mutation()`: Deletes a custom playlist.
*   **`digestRouter`**: Manages email digest settings and sending.
    *   **Procedures:**
        *   `getDigestSettings.query()`: Retrieves user's email digest preferences.
        *   `updateDigestSettings.mutation()`: Saves user's email digest preferences (frequency, time, email).
        *   `sendDigestNow.mutation()`: (Admin/Test) Triggers an immediate digest send.

---
