'use client';

/**
 * Channels Page Component
 * 
 * PURPOSE: This page allows authenticated users to view and select their YouTube channel subscriptions.
 * 
 * CURRENT IMPLEMENTATION STATUS:
 * - ✅ Authentication protection (redirects unauthenticated users)
 * - ✅ Mock data display for channels
 * - ✅ Channel selection UI with toggle functionality
 * - ✅ 10-channel limit enforcement
 * - ✅ Save button (currently shows mock success message)
 * - ❌ Real tRPC integration (using mock data instead)
 * - ❌ Database persistence (mock implementation)
 * 
 * FIXES APPLIED:
 * - Fixed React setState in render error by moving router.push() to useEffect
 * - Removed references to undefined 'api' object that was causing TypeScript errors
 * - Added proper loading and redirect states for better UX
 * - Fixed infinite loop in useEffect by using empty dependency array
 * 2. Implement real save functionality using tRPC mutation
 * 3. Add proper error handling for API calls
 * 4. Implement loading states for async operations
 * 5. Add proper TypeScript types for API responses
 */

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { YouTubeChannel } from '@repo/types';

export default function ChannelsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([]);

  // FIXED: Moved redirect logic to useEffect to prevent React render errors
  // REASONING: Calling router.push() during render causes React to throw:
  // "Cannot update a component while rendering a different component"
  // This happens because router.push() triggers a state update during the render phase
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // TODO: Replace with actual tRPC call when backend is implemented
  // CURRENT: Using mock data to demonstrate UI functionality
  // NEXT: Replace this with: const { data: channels, isLoading, error } = api.channel.getSubscriptions.useQuery();
  const channels: YouTubeChannel[] = [
    {
      id: '1',
      channelId: 'UC123456789',
      name: 'Mock Channel 1',
      thumbnailUrl: 'https://via.placeholder.com/48x48',
      description: 'A mock YouTube channel for testing'
    },
    {
      id: '2',
      channelId: 'UC987654321',
      name: 'Mock Channel 2',
      thumbnailUrl: 'https://via.placeholder.com/48x48',
      description: 'Another mock YouTube channel for testing'
    }
  ];

  // FIXED: Initialize selected channels only once on component mount
  // REASONING: The previous useEffect was causing infinite loops because the channels array
  // was being recreated on every render, triggering the effect repeatedly
  useEffect(() => {
    // Initialize selectedChannelIds with previously saved channels (AC: 5)
    // For now, this is a placeholder as saving functionality is not yet implemented
    // Once saving is implemented, this will fetch the user's saved channels from the backend
    // and set them as initial selectedChannelIds.
    // For demonstration, let's assume some channels are pre-selected if they exist
    const preSelected = channels.filter((channel: YouTubeChannel) => channel.name.includes('Mock Channel 1')).map((channel: YouTubeChannel) => channel.id);
    setSelectedChannelIds(preSelected);
  }, []); // FIXED: Empty dependency array to prevent infinite loop

  // Handle channel selection/deselection with 10-channel limit enforcement (AC: 3)
  const handleToggleChannel = (channelId: string, isSelected: boolean) => {
    setSelectedChannelIds(prevSelected => {
      if (isSelected) {
        if (prevSelected.length < 10) {
          return [...prevSelected, channelId];
        } else {
          alert('You can select up to 10 channels only.');
          return prevSelected; // Do not update if limit reached
        }
      } else {
        return prevSelected.filter(id => id !== channelId);
      }
    });
  };

  // Handle saving selected channels (AC: 4)
  const handleSaveChannels = () => {
    // TODO: Replace with actual tRPC mutation when backend is implemented
    // CURRENT: Mock implementation that shows success message
    // NEXT: Replace with: api.channel.saveSelectedChannels.mutate(selectedChannelIds);
    console.log('Saving channels:', selectedChannelIds);
    alert(`Successfully saved ${selectedChannelIds.length} channels!`);
  };

  // Show loading state while NextAuth is determining authentication status
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // FIXED: Return loading message instead of null during redirect
  // REASONING: Returning null during redirect can cause layout shifts
  // and doesn't provide user feedback about what's happening
  if (!session) {
    return <p>Redirecting...</p>;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Channels Page</h1>
      <p className="text-lg">Manage your channels here.</p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Your YouTube Subscriptions</h2>
        {channels && channels.length > 0 ? (
          <ul>
            {channels.map((channel: YouTubeChannel) => (
              <li key={channel.id} className="flex items-center space-x-4 mb-2">
                <img src={channel.thumbnailUrl} alt={channel.name} className="w-12 h-12 rounded-full" />
                <span>{channel.name}</span>
                <button
                  onClick={() => handleToggleChannel(channel.id, !selectedChannelIds.includes(channel.id))}
                  className={`px-4 py-2 rounded ${
                    selectedChannelIds.includes(channel.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {selectedChannelIds.includes(channel.id) ? 'Selected' : 'Select'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No channels found.</p>
        )}
        
        {selectedChannelIds.length > 0 && (
          <div className="mt-6">
            <p className="mb-2">Selected channels: {selectedChannelIds.length}/10</p>
            <button
              onClick={handleSaveChannels}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Save Selected Channels
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
