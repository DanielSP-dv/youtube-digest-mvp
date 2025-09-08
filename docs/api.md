# API Reference

This document outlines the available API endpoints for the application.

## Authentication Endpoints

### `GET /auth/status`

Checks the current authentication status of the user.

*   **Description:** This endpoint is called by the client to determine if a user is currently authenticated and to retrieve basic user information if so. It relies on session cookies for authentication.
*   **Response Fields:**
    *   `authenticated` (boolean): `true` if a user session is active, `false` otherwise.
    *   `user` (object | null): An object containing user details (e.g., `id`, `googleId`, `email`, `name`) if authenticated, otherwise `null`.
    *   `sessionId` (string): The ID of the current session.
*   **Example Response (Authenticated):**
    ```json
    {
      "authenticated": true,
      "user": {
        "id": "1234567890",
        "googleId": "someGoogleId",
        "email": "user@example.com",
        "name": "Test User"
      },
      "sessionId": "someSessionId"
    }
    ```
*   **Example Response (Not Authenticated):**
    ```json
    {
      "authenticated": false,
      "user": null,
      "sessionId": "someSessionId"
    }
    ```

### `GET /auth/logout`

Logs out the current user.

*   **Description:** This endpoint terminates the user's session on the backend.
*   **Redirects To:** `http://localhost:3000/` (the client application's root).
