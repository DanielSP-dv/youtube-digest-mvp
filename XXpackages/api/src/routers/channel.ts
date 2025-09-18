import { publicProcedure, createTRPCRouter } from '../trpc';
import { getSubscriptions } from '../services/youtube';
import { saveUserChannels, getSavedUserChannels } from '../services/channel';
import { z } from 'zod';

export const channelRouter = createTRPCRouter({
  getSubscriptions: publicProcedure
    .query(async () => {
      // For now, return mock data since we don't have proper session handling
      // This can be updated when authentication is properly integrated
      return [
        {
          channelId: 'mock-channel-1',
          title: 'Mock Channel 1',
          description: 'This is a mock channel for testing',
          thumbnailUrl: 'https://via.placeholder.com/150',
          isSelected: false
        },
        {
          channelId: 'mock-channel-2',
          title: 'Mock Channel 2',
          description: 'Another mock channel for testing',
          thumbnailUrl: 'https://via.placeholder.com/150',
          isSelected: true
        }
      ];
    }),

  saveSelectedChannels: publicProcedure
    .input(z.array(z.string())) // Expects an array of channel IDs
    .mutation(async ({ input }) => {
      // For now, just return success since we don't have proper database integration
      // This can be updated when the database is properly set up
      console.log('Saving selected channels:', input);
      return { success: true };
    }),
});
