'use client';

import { useSession, signIn } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-lg">Loading...</div>
      </main>
    );
  }

  if (session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold">Welcome back, {session.user?.name}!</h1>
        <p className="text-lg">You are signed in with Google.</p>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">YouTube Digest MVP</h2>
          <p className="text-gray-700 mb-4">This is a working version of the YouTube Digest application.</p>
          <div className="space-y-2 mb-6">
            <p>✅ Authentication: Working with Google OAuth</p>
            <p>✅ Basic UI: Working</p>
            <p>✅ Prisma Database: Connected</p>
            <p>✅ tRPC API: Available</p>
            <p>⏳ YouTube Integration: Mock data ready</p>
            <p>⏳ Channel Management: UI ready</p>
          </div>
          <div className="space-x-4">
            <a
              href="/channels"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Manage Channels
            </a>
            <a
              href="/dashboard"
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-blue-700"
            >
              View Dashboard
            </a>
            <a
              href="/playlists"
              className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-blue-700"
            >
              Manage Playlists
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to YouTube Digest</h1>
        <p className="text-lg mt-4">Get summaries of your favorite YouTube channels delivered to your inbox.</p>
        <button
          onClick={() => signIn('google')}
          className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign In with Google to Create Your Digest
        </button>
      </div>
    </main>
  );
}
