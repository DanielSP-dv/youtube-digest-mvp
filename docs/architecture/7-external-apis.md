# **7. External APIs**

Our application will integrate with several external services to deliver its core functionality. Each integration will be documented here, including its purpose, authentication methods, and key endpoints used.

### **Google OAuth API**

*   **Purpose:** To securely authenticate users and obtain their consent to access their YouTube data.
*   **Documentation:** [Google Identity Platform - OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
*   **Base URL(s):** `https://accounts.google.com/o/oauth2/v2/auth`, `https://oauth2.googleapis.com/token`
*   **Authentication:** OAuth 2.0 (Authorization Code Flow)
*   **Rate Limits:** Standard Google API quotas apply.
*   **Key Endpoints Used:**
    *   `GET /oauth2/v2/auth` - User authorization endpoint.
    *   `POST /token` - Exchange authorization code for access and refresh tokens.
    *   `GET /oauth2/v3/userinfo` - Retrieve user profile information.
*   **Integration Notes:** Handled primarily by NextAuth.js. Access and refresh tokens will be securely stored and managed.

### **YouTube Data API**

*   **Purpose:** To fetch user's subscribed channels, retrieve video metadata (title, thumbnail, duration, views), and obtain video transcripts.
*   **Documentation:** [YouTube Data API v3](https://developers.google.com/youtube/v3)
*   **Base URL(s):** `https://www.googleapis.com/youtube/v3/`
*   **Authentication:** OAuth 2.0 (using user's access token).
*   **Rate Limits:** Quota-based system (measured in "units" per API call). Needs careful management to avoid hitting limits.
*   **Key Endpoints Used:**
    *   `GET /subscriptions` - Retrieve a user's channel subscriptions.
    *   `GET /search` - Search for videos by channel ID (e.g., latest uploads).
    *   `GET /videos` - Retrieve video details (duration, views, etc.).
    *   `GET /captions` - Retrieve video captions/transcripts (if available).
*   **Integration Notes:** Will require careful quota management and error handling for rate limits. Transcript retrieval might involve alternative methods if `captions` API is insufficient.

### **LLM API (e.g., OpenAI GPT)**

*   **Purpose:** To generate concise two-paragraph summaries and chapter timestamps from video transcripts.
*   **Documentation:** [OpenAI API Documentation](https://platform.openai.com/docs/api-reference) (or similar for chosen LLM)
*   **Base URL(s):** `https://api.openai.com/v1/` (or similar)
*   **Authentication:** API Key (securely stored on the backend).
*   **Rate Limits:** Per-minute and per-day token/request limits apply.
*   **Key Endpoints Used:**
    *   `POST /chat/completions` - For text summarization and chapter generation.
*   **Integration Notes:** Prompts will be carefully engineered for consistent summary quality. Cost management will be a consideration for future scaling.

### **Email Sending Service (e.g., SendGrid, AWS SES)**

*   **Purpose:** To reliably send scheduled email digests to users.
*   **Documentation:** (Will depend on chosen service, e.g., [SendGrid API Docs](https://docs.sendgrid.com/api-reference/mail-send/mail-send))
*   **Base URL(s):** (Service-specific)
*   **Authentication:** API Key.
*   **Rate Limits:** Per-hour/per-day email sending limits.
*   **Key Endpoints Used:**
    *   `POST /mail/send` - To send transactional emails.
*   **Integration Notes:** Will require proper domain authentication (SPF, DKIM) to ensure high deliverability and avoid spam folders.

### **Supadata API**

*   **Purpose:** To fetch video transcripts from various platforms (YouTube, TikTok, Instagram, X).
*   **Documentation:** [Supadata: Getting Started](https://docs.supadata.ai/)
*   **Base URL(s):** `https://api.supadata.ai/v1`
*   **Authentication:** API Key (included in `x-api-key` header).
*   **Rate Limits:** Subscription-based.
*   **Key Endpoints Used:**
    *   `/youtube/transcript` (or similar, based on specific needs)
*   **Integration Notes:** Will require secure storage of `SUPADATA_API_KEY` in environment variables. Consider using their JavaScript SDK for easier integration.