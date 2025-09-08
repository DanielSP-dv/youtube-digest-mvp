import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { db } from './db';

// Simple context function - using function declaration instead of const
export function createTRPCContext(opts: { headers: Headers }) {
  return {
    db,
    session: null,
    ...opts,
  };
}

// Create tRPC instance
export const t = initTRPC.context<{
  db: typeof db;
  session: null;
  headers: Headers;
}>().create({
  transformer: superjson,
});

// Export router and procedures
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;