import { appRouter } from '../src/root';
import { createContextInner } from '../src/context'; // Assuming a context file
import prisma from '../src/db';
import * as youtubeService from '../src/services/youtube';

// Mock googleapis for getSubscriptions
jest.mock('../src/services/youtube', () => ({
  getSubscriptions: jest.fn(() => [
    { id: 'mock-id-1', channelId: 'UC1', name: 'Mock Channel 1', thumbnailUrl: 'url1' },
    { id: 'mock-id-2', channelId: 'UC2', name: 'Mock Channel 2', thumbnailUrl: 'url2' },
  ]),
}));

describe('channelRouter', () => {
  let caller: any;
  let mockContext: any;

  beforeAll(async () => {
    // Clear the database before tests
    await prisma.youTubeChannel.deleteMany();
  });

  beforeEach(() => {
    // Mock context with a user ID
    mockContext = {
      session: {
        user: {
          id: 'test-user-id',
          accessToken: 'mock-access-token',
        },
      },
    };
    // Assuming createContextInner can take a mock context
    caller = appRouter.createCaller(mockContext);
  });

  afterEach(async () => {
    // Clean up after each test if necessary
    await prisma.youTubeChannel.deleteMany({ where: { userId: 'test-user-id' } });
  });

  it('should fetch YouTube subscriptions', async () => {
    const subscriptions = await caller.channel.getSubscriptions();
    expect(subscriptions).toHaveLength(2);
    expect(subscriptions[0].name).toBe('Mock Channel 1');
    expect(youtubeService.getSubscriptions).toHaveBeenCalledWith('mock-access-token');
  });

  it('should save selected channels', async () => {
    const selectedChannelIds = ['UC1', 'UC2'];
    await caller.channel.saveSelectedChannels(selectedChannelIds);

    const savedChannels = await prisma.youTubeChannel.findMany({
      where: { userId: 'test-user-id' },
    });
    expect(savedChannels).toHaveLength(2);
    expect(savedChannels[0].channelId).toBe('UC1');
    expect(savedChannels[1].channelId).toBe('UC2');
  });

  it('should update selected channels', async () => {
    // Save initial channels
    await caller.channel.saveSelectedChannels(['UC1']);

    // Update with new selection
    await caller.channel.saveSelectedChannels(['UC2', 'UC3']);

    const savedChannels = await prisma.youTubeChannel.findMany({
      where: { userId: 'test-user-id' },
    });
    expect(savedChannels).toHaveLength(2);
    expect(savedChannels.map(c => c.channelId)).toEqual(expect.arrayContaining(['UC2', 'UC3']));
  });
});
