# YouTube Digest MVP

This project is a simplified MVP of a YouTube Digest application. It uses an Express.js backend and a React frontend.

## Prerequisites

- Node.js (v18.x or later)
- npm

## Setup and Run

Follow these steps to get the application running locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FINALMVP
```

### 2. Environment Variables

Create a `.env` file in the root of the project and add the following variables. You will need to get your own credentials from the Google Cloud Console and OpenAI.

```
DATABASE_URL=your_database_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
OPENAI_API_KEY=your_openai_api_key
SEARCHAPI_KEY=your_searchapi_key
SESSION_SECRET=a_long_random_string_for_sessions
NODE_ENV=development
CLIENT_URL=http://localhost:3000
CALLBACK_URL=http://localhost:5001/auth/google/callback
```

### 3. Install Dependencies

This project has dependencies in both the root directory (for the server) and the `client` directory.

**Install Root Dependencies:**

From the project root directory (`/Users/D/FINALMVP/`):
```bash
npm install
```

**Install Client Dependencies:**

Navigate into the `client` directory and install its dependencies:
```bash
cd client
npm install
cd ..
```

### 4. Start the Backend Server

From the project root directory:
```bash
npm start
```
or
```bash
node server.js
```
The backend server will run on port **5001**.

### 5. Start the Frontend Client

In a separate terminal, navigate to the `client` directory and start the React development server:
```bash
cd client
npm start
```
The frontend will run on port **3000**.

**Important:** The client's `package.json` is configured to proxy API requests to the backend at `http://localhost:5001`.

## Troubleshooting

Here are solutions for common issues:

*   **Error: `address already in use :::5001`**
    *   **Cause:** Another process is already using port 5001. This is often a previously running instance of the backend server that didn't shut down correctly.
    *   **Solution:** Find and stop the process using port 5001, or change the port in your `.env` file (and update the client proxy in `client/package.json`).

*   **Error: `JSON.parse: unexpected character at line...` in `package.json`**
    *   **Cause:** You have added comments to a `package.json` file. The JSON format does not support comments.
    *   **Solution:** Remove any comments from all `package.json` files and try again.
