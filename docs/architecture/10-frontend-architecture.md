# **10. Frontend Architecture**

This section outlines the specific architectural details for our Next.js (React) frontend, focusing on component organization, state management, routing, and how it communicates with the backend.

### **Component Architecture**

We will follow Next.js best practices for component organization, promoting reusability and maintainability.

*   **Component Organization:**

```text
src/
    ├── app/                  # Next.js App Router (or pages/ for Pages Router)
    │   ├── (auth)/           # Grouped routes for authentication
    │   ├── (dashboard)/      # Grouped routes for dashboard
    │   ├── (playlists)/      # Grouped routes for playlists
    │   └── layout.tsx        # Root layout
    ├── components/
    │   ├── ui/               # Shadcn/UI or similar base components
    │   └── custom/           # Application-specific components
    ├── hooks/                # Custom React hooks for reusable logic
    ├── lib/                  # Utility functions, API client setup (tRPC)
    ├── styles/               # Global styles, Tailwind CSS config
    ├── types/                # Shared TypeScript types (from monorepo `packages/shared`)
    └── utils/
```

*   **Component Template:**
    A basic functional component structure using TypeScript:

```typescript
// components/custom/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  // ... other props
}

const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold">{title}</h2>
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### **State Management Architecture**

We will use a combination of React's built-in state management and a lightweight global state solution.

*   **State Structure:**
    *   **Local Component State:** `useState` and `useReducer` for state confined to a single component or a small component tree.
    *   **Global Application State:** React Context API for simple global state (e.g., user authentication status, selected channels). For more complex global state, we can introduce a lightweight library like Zustand.

*   **State Management Patterns:**
    *   **Lifting State Up:** For sharing state between sibling components.
    *   **Context API:** For passing global state down the component tree without prop drilling.
    *   **Zustand (Optional):** For managing more complex global state with minimal boilerplate.

### **Routing Architecture**

Next.js provides a file-system-based router, simplifying route definition.

*   **Route Organization:**
    *   **App Router (Recommended):** Uses folders to define routes, with `page.tsx` files for UI and `layout.tsx` for shared layouts.
    *   **Pages Router (Alternative):** Uses files in the `pages/` directory to define routes.
    *   **Nested Routes:** Achieved by nesting folders/files.

*   **Protected Route Pattern:**
    Routes requiring authentication will check the user's session status. If not authenticated, the user will be redirected to the login page. NextAuth.js provides `useSession` hook and middleware for this.

```typescript
// lib/auth.ts (simplified example)
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust path

export async function isAuthenticated() {
  const session = await getServerSession(authOptions);
  return !!session;
}

// pages/protected.tsx (Pages Router example)
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/router";
// const { data: session, status } = useSession();
// if (status === "loading") return <p>Loading...</p>;
// if (!session) useRouter().push("/api/auth/signin");
// return <p>Protected Content</p>;
```

### **Frontend Services Layer**

Frontend will communicate with the backend primarily via tRPC.

*   **API Client Setup:**
    We will set up a tRPC client that connects to our backend tRPC procedures. This client will handle type-safe requests and responses.

```typescript
// lib/trpc.ts (simplified example)
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/server/api/root'; // Adjust path to your backend router

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc', // Our internal tRPC API endpoint
    }),
  ],
});
```

*   **Service Example:**
    Frontend components will use the `api` client to interact with backend procedures.

```typescript
// hooks/useChannels.ts (simplified example)
import { api } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query'; // Example query library

export const useSelectedChannels = () => {
  return useQuery({
    queryKey: ['selectedChannels'],
    queryFn: () => api.channel.getSelectedChannels.query(),
  });
};

// components/ChannelSelector.tsx (simplified example)
// import { useSelectedChannels } from '@/hooks/useChannels';
// const { data: channels, isLoading } = useSelectedChannels();
// if (isLoading) return <p>Loading channels...</p>;
// return (
//   <ul>
//     {channels?.map(channel => (
//       <li key={channel.id}>{channel.name}</li>
//     ))}
//   </ul>
// );
```

---
