import prisma from '../db';
import { YouTubeChannel } from '@repo/types';

export async function saveUserChannels(userId: string, channelIds: string[]) {
  // Delete existing channels for the user to handle deselection
  await prisma.youTubeChannel.deleteMany({
    where: {
      userId: userId,
    },
  });

  // Create new channel entries for the selected channels
  const createManyData = channelIds.map(channelId => ({
    userId: userId,
    channelId: channelId,
    name: `Channel ${channelId}`, // Placeholder, ideally fetch actual name
    thumbnailUrl: `https://via.placeholder.com/48?text=${channelId}` // Placeholder
  }));

  await prisma.youTubeChannel.createMany({
    data: createManyData,
    skipDuplicates: true, // In case of any unexpected duplicates
  });

  return { success: true };
}

export async function getSavedUserChannels(userId: string): Promise<YouTubeChannel[]> {
  const savedChannels = await prisma.youTubeChannel.findMany({
    where: {
      userId: userId,
    },
  });
  return savedChannels.map(channel => ({
    id: channel.id,
    channelId: channel.channelId,
    userId: channel.userId,
    name: channel.name,
    thumbnailUrl: channel.thumbnailUrl,
    customUrl: channel.customUrl || undefined,
    description: channel.description || undefined,
    publishedAt: channel.publishedAt || undefined,
    createdAt: channel.createdAt,
    updatedAt: channel.updatedAt,
  }));
}
