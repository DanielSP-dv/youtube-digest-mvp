# Runbook Notes for Support

This document provides quick troubleshooting and support notes for common issues.

## Backend Issues

*   **Issue: Backend fails with `EADDRINUSE` on port `5001`**
    *   **Cause:** Another process is already using port `5001`.
    *   **Resolution:** Kill the previous backend server process. Alternatively, choose a free port, update the `PORT` variable in the `.env` file, and ensure the client's proxy setting in `client/package.json` is updated to match the new port.

## Frontend Issues

*   **Issue: Client fails to start with `JSON parse error`**
    *   **Cause:** `package.json` files (especially `client/package.json`) contain comments or invalid JSON syntax. JSON does not support comments.
    *   **Resolution:** Remove any comments or non-JSON syntax from the `package.json` file and retry starting the client.

*   **Issue: Client does not detect login (user not shown as authenticated)**
    *   **Cause:** The frontend is not correctly sending or receiving authentication credentials.
    *   **Resolution:**
        1.  Verify that the client-side `fetch` requests to authentication endpoints (e.g., `/auth/status`) include `credentials: 'include'`.
        2.  Ensure that the session cookie is being correctly sent by the backend and received by the frontend. Check browser developer tools for network requests and cookie presence.
