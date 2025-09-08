# **4. Data Models**

The data model is intentionally flat and simple to support the MVP's core functionality while minimizing complexity. It consists of three tables.

### **1. users**

*   **Purpose:** Stores essential authentication and identity data for each user from their Google login.
*   **Attributes:** `id`, `google_id`, `email`, `name`, `access_token`, `refresh_token`, `created_at`.
*   **Relationships:** A `user` has a one-to-many relationship with `selected_channels`.

### **2. selected_channels**

*   **Purpose:** Links users to the specific YouTube channels they choose to monitor.
*   **Attributes:** `user_id` (FK), `channel_id`, `channel_name`, `channel_thumbnail`, `created_at`.
*   **Relationships:** This table joins `users` to the concept of a channel.

### **3. video_summaries**

*   **Purpose:** Serves as a cache for generated summaries to avoid costly re-processing of videos.
*   **Attributes:** `id`, `video_id`, `channel_id`, `title`, `thumbnail`, `published_at`, `summary`, `created_at`.
*   **Relationships:** This table is keyed by the unique `video_id`.

---
