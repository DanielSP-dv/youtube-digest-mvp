'use client';

/**
 * Playlists Page Component
 * 
 * PURPOSE: This page allows users to view and manage their saved video playlists.
 * 
 * CURRENT IMPLEMENTATION STATUS:
 * - ✅ Authentication protection (redirects unauthenticated users)
 * - ✅ Basic page structure and layout
 * - ❌ Real playlist data display (placeholder content)
 * - ❌ tRPC integration for fetching playlists
 * - ❌ Playlist management functionality
 * 
 * FIXES APPLIED:
 * - Fixed React setState in render error by moving router.push() to useEffect
 * - Added proper loading and redirect states for better UX
 * 
 * NEXT STEPS FOR NEXT CODING AGENT:
 * 1. Implement tRPC query to fetch user's playlists (including "Watch Later")
 * 2. Create playlist display components
 * 3. Add functionality to create custom playlists
 * 4. Implement video management within playlists
 * 5. Add proper loading states and error handling
 */

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PlaylistsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // FIXED: Moved redirect logic to useEffect to prevent React render errors
  // REASONING: Calling router.push() during render causes React to throw:
  // "Cannot update a component while rendering a different component"
  // This happens because router.push() triggers a state update during the render phase
  useEffect(() => {
    // Only redirect when we're certain the user is not authenticated
    // Using 'unauthenticated' status is more precise than checking !session
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]); // Dependencies ensure effect runs when auth status changes

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
      <h1 className="text-4xl font-bold">Playlists Page</h1>
      <p className="text-lg">Manage your saved videos here.</p>
      {/* TODO: Replace with actual playlist management UI */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">Playlist management coming soon...</p>
        <p className="text-sm text-gray-500 mt-2">
          This will allow you to view and manage your "Watch Later" and custom playlists.
        </p>
      </div>
    </main>
  );
}
