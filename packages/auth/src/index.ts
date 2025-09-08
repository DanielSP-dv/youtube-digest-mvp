// CHANGED: Updated imports from Auth.js v5 to NextAuth v4
// OLD: import type { NextAuthConfig } from "@auth/core/types";
// OLD: import Google from "@auth/core/providers/google";
// OLD: import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from '@prisma/client'; // CHANGED: Import PrismaClient directly to avoid circular dependency

// CHANGED: Create db instance directly to avoid circular dependency with API package
const db = new PrismaClient();

// CHANGED: Updated configuration object from NextAuthConfig to NextAuthOptions
// CHANGED: Added named export for authOptions to fix import issues
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt", // CHANGED: Added JWT strategy to enable access token storage
  },
  providers: [
    // CHANGED: Updated Google provider import and configuration
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // CHANGED: Added session callback to include user ID and access token in session
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        accessToken: token.accessToken,
      },
    }),
    // CHANGED: Added JWT callback to store access token from OAuth provider
    jwt: ({ token, account }) => {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};

import { getServerSession } from "next-auth";
import type { IncomingMessage, ServerResponse } from "http";
import type { TRPCUser } from "@repo/types";

export async function getUserFromRequest(req: IncomingMessage, res: ServerResponse): Promise<TRPCUser> {
  const session = await getServerSession(req as any, res as any, authOptions);
  return { id: session?.user?.id || null };
}

export default authOptions;