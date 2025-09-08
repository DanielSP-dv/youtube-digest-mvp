# **8. Core Workflows**

### **User Onboarding & Channel Selection**

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant GoogleOAuth
    participant YouTubeAPI
    participant Database

    User->>Frontend: Clicks "Create Digest" / Login
    Frontend->>GoogleOAuth: Redirects for Authentication
    GoogleOAuth-->>User: Displays Consent Screen
    User->>GoogleOAuth: Grants Permissions
    GoogleOAuth-->>Frontend: Redirects with Auth Code
    Frontend->>Backend: Sends Auth Code (NextAuth.js)
    Backend->>GoogleOAuth: Exchanges Code for Tokens
    GoogleOAuth-->>Backend: Returns Access/Refresh Tokens
    Backend->>Database: Saves User & Tokens
    Backend-->>Frontend: Redirects to Channels Page
    Frontend->>Backend: Requests User Subscriptions
    Backend->>YouTubeAPI: Fetches Subscribed Channels
    YouTubeAPI-->>Backend: Returns Channel Data
    Backend->>Frontend: Displays Channels
    User->>Frontend: Selects up to 10 Channels
    Frontend->>Backend: Saves Selected Channels
    Backend->>Database: Stores User's Selected Channels
    Backend-->>Frontend: Confirms Selection
    Frontend->>User: Displays Channels Page with Selection
```

---

### **Video Summarization & Dashboard Display**

This workflow describes how new videos are processed, summarized, and then displayed on the user's dashboard.

```mermaid
sequenceDiagram
    participant System (Scheduler)
    participant Backend (Video Processing Service)
    participant YouTubeAPI
    participant Database
    participant LLMAPI
    participant Frontend (Dashboard Module)
    participant User

    System (Scheduler)->>Backend (Video Processing Service): Periodically triggers video fetch
    Backend (Video Processing Service)->>YouTubeAPI: Fetches latest videos for selected channels
    YouTubeAPI-->>Backend (Video Processing Service): Returns video metadata
    Backend (Video Processing Service)->>Database: Stores new video metadata
    Backend (Video Processing Service)->>YouTubeAPI: Requests video transcript
    YouTubeAPI-->>Backend (Video Processing Service): Returns transcript
    Backend (Video Processing Service)->>Database: Stores transcript
    Backend (Video Processing Service)->>LLMAPI: Sends transcript for summarization
    LLMAPI-->>Backend (Video Processing Service): Returns summary & chapters
    Backend (Video Processing Service)->>Database: Stores summary & chapters
    Backend (Video Processing Service)->>Frontend (Dashboard Module): Notifies of new content (e.g., via polling/refresh)
    Frontend (Dashboard Module)->>Backend (Video Processing Service): Requests latest video summaries
    Backend (Video Processing Service)->>Database: Retrieves video summaries
    Database-->>Backend (Video Processing Service): Returns summaries
    Backend (Video Processing Service)-->>Frontend (Dashboard Module): Sends video summaries
    Frontend (Dashboard Module)->>User: Displays video summary cards
    User->>Frontend (Dashboard Module): Clicks "Show More"
    Frontend (Dashboard Module)->>User: Displays chapters
```

---

### **Email Digest Delivery**

This workflow describes how the scheduled email digests are generated and sent to the user.

```mermaid
sequenceDiagram
    participant System (Scheduler)
    participant Backend (Digest Service)
    participant Database
    participant EmailService
    participant User (Email Client)

    System (Scheduler)->>Backend (Digest Service): Triggers daily/weekly digest generation
    Backend (Digest Service)->>Database: Fetches user's selected channels and new video summaries
    Database-->>Backend (Digest Service): Returns relevant summaries
    Backend (Digest Service)->>EmailService: Sends formatted email digest
    EmailService-->>Backend (Digest Service): Confirms email sent
    EmailService->>User (Email Client): Delivers email digest
    User (Email Client)->>User: Receives and reads digest
```

---

### **Playlist Management**

This workflow describes how users save videos to playlists and manage their custom playlists.

```mermaid
sequenceDiagram
    participant User
    participant Frontend (Playlist Module)
    participant Backend (Playlist Service)
    participant Database

    User->>Frontend: Clicks "Save to Watch Later" on video card
    Frontend->>Backend (Playlist Service): Requests to add video to "Watch Later" playlist
    Backend (Playlist Service)->>Database: Adds video to user's default "Watch Later" playlist
    Database-->>Backend (Playlist Service): Confirms addition
    Backend (Playlist Service)-->>Frontend: Confirms video added
    Frontend->>User: Provides visual feedback (e.g., button state change)

    User->>Frontend: Navigates to Playlists page
    Frontend->>Backend (Playlist Service): Requests user's playlists
    Backend (Playlist Service)->>Database: Retrieves playlists and their videos
    Database-->>Backend (Playlist Service): Returns playlists data
    Backend (Playlist Service)-->>Frontend: Displays playlists and videos
    User->>Frontend: Clicks "Create New Playlist"
    Frontend->>Backend (Playlist Service): Requests to create new playlist with name
    Backend (Playlist Service)->>Database: Creates new playlist record
    Database-->>Backend (Playlist Service): Confirms creation
    Backend (Playlist Service)-->>Frontend: Confirms playlist created
    Frontend->>User: Displays new playlist

    User->>Frontend: Adds video to custom playlist
    Frontend->>Backend (Playlist Service): Requests to add video to custom playlist
    Backend (Playlist Service)->>Database: Adds video to specified custom playlist
    Database-->>Backend (Playlist Service): Confirms addition
    Backend (Playlist Service)-->>Frontend: Confirms video added
    Frontend->>User: Provides visual feedback
```

---
