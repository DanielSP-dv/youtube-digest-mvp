'use client';

// CHANGED: Updated import from Auth.js v5 to NextAuth v4
// OLD: import { signIn, signOut, useSession } from 'next-auth/react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button 
        onClick={() => signOut()} 
        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign Out
      </button>
    );
  }

  return (
    <button 
      onClick={() => signIn('google')} 
      className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign In
    </button>
  );
}
