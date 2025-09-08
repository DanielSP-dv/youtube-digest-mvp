# **11. Backend Architecture**

Our backend will be built using Next.js API Routes, which function as serverless endpoints. This approach aligns with our choice of a monolithic service architecture for the MVP, simplifying deployment and management.

### **Service Architecture**

Our backend logic will be organized as serverless functions within the Next.js framework.

*   **Function Organization:**
    Next.js API Routes are organized by the file system within the `pages/api` or `app/api` directory. Each file or folder within this structure defines an API endpoint. tRPC procedures will be defined within these routes, typically in a `server/api` directory.

```text
src/
    ├── pages/api/
    │   ├── auth/             # NextAuth.js authentication routes
    │   │   └── [...nextauth].ts
    │   └── trpc/             # tRPC API endpoint
    │       └── [trpc].ts
    ├── server/
    │   ├── api/
    │   │   ├── routers/        # Individual tRPC routers (auth, channel, video, playlist, digest)
    │   │   │   ├── auth.ts
    │   │   │   ├── channel.ts
    │   │   │   ├── video.ts
    │   │   │   ├── playlist.ts
    │   │   │   └── digest.ts
    │   │   └── root.ts       # Combines all routers
    │   │   └── trpc.ts         # tRPC context and setup
    │   ├── db.ts             # Database client setup (Prisma)
    │   ├── services/         # Business logic services (e.g., YouTube, LLM integration)
    │   │   ├── youtube.ts
    │   │   └── llm.ts
    │   └── utils/            # Backend utilities
```

*   **Function Template (tRPC Procedure Example):**
    A basic tRPC procedure within a router:

```typescript
// server/api/routers/channel.ts
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const channelRouter = router({
  getSubscriptions: publicProcedure
    .query(async ({ ctx }) => {
      // Logic to fetch YouTube subscriptions using ctx.youtubeService
      // This would call the YouTube Integration Service
      return [{ id: "channel1", name: "My Channel" }]; // Placeholder
    }),
  updateSelectedChannels: publicProcedure
    .input(z.array(z.string())) // Expects an array of channel IDs
    .mutation(async ({ ctx, input }) => {
      // Logic to save selected channels to database using ctx.db
      // This would interact with the Database Service
      return { success: true, selectedCount: input.length };
    }),
});
```

### **Database Architecture**

We will use Prisma as our ORM to interact with the PostgreSQL database hosted on Supabase.

*   **Schema Design:**
    The detailed SQL DDL for our database schema has been defined in Section 9. This schema will be managed by Prisma migrations.

*   **Data Access Layer:**
    Prisma Client will provide a type-safe and efficient way to interact with our PostgreSQL database.

```typescript
// server/db.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = 
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = db;
```

### **Authentication and Authorization**

NextAuth.js will handle our Google OAuth authentication flow and session management.

*   **Auth Flow:**
    The authentication flow follows the sequence diagram defined in Section 8 ("User Onboarding & Channel Selection"), leveraging NextAuth.js for Google OAuth.

*   **Auth Middleware/Guards:**
    NextAuth.js provides middleware and session helpers to protect API routes and pages. Procedures in tRPC can be protected by checking the session context.

```typescript
// server/api/trpc.ts (simplified context creation)
import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust path

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const session = await getServerSession(req, res, authOptions);
  return {
    session,
    db, // Our Prisma client
    // ... other services like youtubeService, llmService
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});
```

---
