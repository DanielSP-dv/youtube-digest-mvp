import { google } from 'googleapis';
import { YouTubeChannel } from '@repo/types';

export async function getSubscriptions(accessToken: string): Promise<YouTubeChannel[]> {
  // TODO: Implement actual YouTube Data API call
  // For now, return a mock response that conforms to the YouTubeChannel type
  return [
    {
      id: 'mock-id-1',
      channelId: 'mock-channel-1',
      name: 'Mock Channel 1',
      thumbnailUrl: 'https://via.placeholder.com/48',
      customUrl: '@mockchannel1',
      description: 'A mock YouTube channel for testing',
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'mock-id-2',
      channelId: 'mock-channel-2',
      name: 'Mock Channel 2',
      thumbnailUrl: 'https://via.placeholder.com/48',
      customUrl: '@mockchannel2',
      description: 'Another mock YouTube channel for testing',
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}
