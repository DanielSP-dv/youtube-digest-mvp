export interface YouTubeChannel {
  id: string;
  channelId: string;
  userId?: string; // Optional as it might not be available when fetching from YouTube API
  name: string;
  thumbnailUrl: string;
  customUrl?: string;
  description?: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
