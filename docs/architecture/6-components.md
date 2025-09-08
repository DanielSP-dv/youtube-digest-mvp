# **6. Components**

We will organize our application into logical components, each with a clear responsibility, to ensure modularity and maintainability.

**Frontend Components (React):**

*   **Auth Module:**
    *   **Responsibility:** Manages user authentication flow (Google OAuth login, session handling, logout).
    *   **Key Interfaces:** Login/Logout UI, session context.
    *   **Dependencies:** Backend Auth Service.
*   **Channel Management Module:**
    *   **Responsibility:** Displays user's YouTube subscriptions, allows selection/deselection of channels to monitor.
    *   **Key Interfaces:** Channel list UI, channel selection toggles.
    *   **Dependencies:** Backend Channel Service.
*   **Dashboard Module:**
    *   **Responsibility:** Displays the feed of video summary cards, handles refresh functionality.
    *   **Key Interfaces:** Video card UI, refresh button.
    *   **Dependencies:** Backend Video Processing Service.
*   **Playlist Module:**
    *   **Responsibility:** Manages "Watch Later" and custom playlists (create, add/remove videos, view content).
    *   **Key Interfaces:** Playlist list UI, video save buttons, playlist management UI.
    *   **Dependencies:** Backend Playlist Service.
*   **Settings Module:**
    *   **Responsibility:** Manages user preferences, including email digest settings.
    *   **Key Interfaces:** Settings forms.
    *   **Dependencies:** Backend Digest Service.
*   **Shared UI Components:**
    *   **Responsibility:** Provides reusable UI elements (buttons, input fields, navigation elements, layout components) for consistency across the application.
    *   **Key Interfaces:** Component props.
    *   **Dependencies:** None (foundational).

**Backend Components (Next.js API Routes / Services):**

*   **Auth Service:**
    *   **Responsibility:** Handles user authentication, Google OAuth callbacks, session creation and management.
    *   **Key Interfaces:** `/api/auth/google`, `/api/auth/logout`.
    *   **Dependencies:** Database Service, NextAuth.js.
*   **YouTube Integration Service:**
    *   **Responsibility:** Manages all interactions with the YouTube Data API (fetching subscriptions, video metadata, transcripts).
    *   **Key Interfaces:** Internal methods for YouTube API calls.
    *   **Dependencies:** YouTube Data API.
*   **LLM Summarization Service:**
    *   **Responsibility:** Manages calls to the LLM (OpenAI GPT) for generating video summaries and chapters.
    *   **Key Interfaces:** Internal methods for LLM API calls.
    *   **Dependencies:** LLM API.
*   **Video Processing Service:**
    *   **Responsibility:** Orchestrates the process of fetching new videos, retrieving transcripts, triggering summarization, and storing results.
    *   **Key Interfaces:** Internal methods for video processing.
    *   **Dependencies:** YouTube Integration Service, LLM Summarization Service, Database Service.
*   **Playlist Service:**
    *   **Responsibility:** Manages CRUD operations for user playlists and adding/removing videos from them.
    *   **Key Interfaces:** tRPC procedures for playlist management.
    *   **Dependencies:** Database Service.
*   **Digest Service:**
    *   **Responsibility:** Manages email digest generation, scheduling, and sending.
    *   **Key Interfaces:** Internal methods for digest creation and email sending.
    *   **Dependencies:** Database Service, Email Sending Service.
*   **Database Service:**
    *   **Responsibility:** Provides an abstraction layer for all interactions with the PostgreSQL database (Supabase).
    *   **Key Interfaces:** ORM/Query builder methods.
    *   **Dependencies:** PostgreSQL Database (Supabase).

**Component Diagram:**

```mermaid
graph TD
    subgraph Frontend
        A[Auth Module]
        B[Channel Management Module]
        C[Dashboard Module]
        D[Playlist Module]
        E[Settings Module]
        F[Shared UI Components]
    end

    subgraph Backend (Next.js API Routes)
        G[Auth Service]
        H[YouTube Integration Service]
        I[LLM Summarization Service]
        J[Video Processing Service]
        K[Playlist Service]
        L[Digest Service]
        M[Database Service]
    end

    A -- uses --> G
    B -- uses --> H, M
    C -- uses --> J, M
    D -- uses --> K, M
    E -- uses --> L, M

    J -- uses --> H
    J -- uses --> I
    J -- uses --> M

    L -- uses --> M

    G -- uses --> M
    K -- uses --> M

    H -- calls --> YouTubeAPI[YouTube Data API]
    I -- calls --> LLMAPI[LLM API]
    M -- interacts with --> PostgreSQL[PostgreSQL Database (Supabase)]

    YouTubeAPI -- provides data to --> H
    LLMAPI -- provides data to --> I
    PostgreSQL -- provides data to --> M
```

---
