# **9. Database Schema**

Here is the SQL Data Definition Language (DDL) for our PostgreSQL database, based on the data models we defined earlier. This schema is designed for clarity, data integrity, and to support the application's core functionalities.

```sql
-- User Table
CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY,
    "googleId" TEXT UNIQUE NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- YouTubeChannel Table
CREATE TABLE "YouTubeChannel" (
    "id" TEXT PRIMARY KEY,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "customUrl" TEXT,
    "description" TEXT,
    "publishedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    UNIQUE ("channelId", "userId") -- Ensures a user cannot add the same channel twice
);

-- Video Table
CREATE TABLE "Video" (
    "id" TEXT PRIMARY KEY,
    "videoId" TEXT UNIQUE NOT NULL, -- Unique across all videos in the system
    "channelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "publishedAt" TIMESTAMP WITH TIME ZONE,
    "duration" INTEGER,
    "numberOfViews" BIGINT,
    "transcript" TEXT, -- Consider storing as TEXT or a separate file/object storage reference for very large transcripts
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("channelId") REFERENCES "YouTubeChannel"("channelId") ON DELETE CASCADE -- Note: referencing channelId, not id, for simplicity in this context
);

-- VideoSummary Table
CREATE TABLE "VideoSummary" (
    "id" TEXT PRIMARY KEY,
    "videoId" TEXT UNIQUE NOT NULL, -- One summary per video
    "summaryText" TEXT NOT NULL,
    "chapters" JSONB, -- Store as JSONB for flexible querying
    "readingTimeMinutes" INTEGER,
    "generatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("videoId") REFERENCES "Video"("videoId") ON DELETE CASCADE
);

-- Playlist Table
CREATE TABLE "Playlist" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    UNIQUE ("userId", "name") -- Ensures a user cannot have two playlists with the same name
);

-- PlaylistVideo (Join Table)
CREATE TABLE "PlaylistVideo" (
    "id" TEXT PRIMARY KEY,
    "playlistId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "addedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE,
    FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE,
    UNIQUE ("playlistId", "videoId") -- Ensures a video is not added to the same playlist twice
);
```

---
