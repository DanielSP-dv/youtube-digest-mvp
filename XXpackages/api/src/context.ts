import { getUserFromRequest } from "@repo/auth";
import type { TRPCContext } from "@repo/types";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { IncomingMessage, ServerResponse } from "http"; // Import these

export async function createTRPCContext(opts: CreateNextContextOptions): Promise<TRPCContext> {
  // Pass opts.req and opts.res directly
  const user = await getUserFromRequest(opts.req as IncomingMessage, opts.res as ServerResponse);
  return { user };
}