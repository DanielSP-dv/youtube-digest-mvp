# **17. Coding Standards**

These standards define the critical conventions and practices that all development, particularly by AI agents, must adhere to. They are designed to ensure code quality, consistency, and clarity for future revisions and human developers.

### **Critical Fullstack Rules**

*   **Detailed Code Comments:** All complex logic, non-obvious decisions, and critical sections of code *must* be accompanied by clear, concise comments explaining *why* something is done, not just *what*. This is crucial for future agents and human understanding.
*   **Type Sharing:** Always define shared TypeScript types and interfaces in `packages/types` and import them from there to ensure end-to-end type safety.
*   **API Calls:** All frontend-to-backend communication must exclusively use tRPC procedures. All external API calls (e.g., to YouTube, LLM) must be encapsulated within dedicated backend services (e.g., `packages/api/src/services`).
*   **Environment Variables:** Access environment variables only through a centralized, type-safe configuration object. Never access `process.env` directly in application code.
*   **Error Handling:** Implement consistent error handling across frontend and backend, ensuring meaningful error messages are returned to the client without exposing sensitive information.
*   **Data Integrity:** All data modifications must adhere to the defined database schema and data integrity rules (e.g., unique constraints).
*   **State Updates:** In React components, never mutate state directly. Always use the appropriate state update functions (e.g., `setState`, `dispatch`) or immutability patterns.

### **Naming Conventions**

Consistent naming conventions improve code readability and navigability.

| Element | Frontend | Backend | Example |
| :--- | :--- | :--- | :--- |
| **Components** | `PascalCase` | - | `UserProfile.tsx` |
| **Hooks** | `camelCase` with `use` prefix | - | `useAuth.ts` |
| **API Routes** | - | `kebab-case` | `/api/user-profile` |
| **Database Tables** | - | `snake_case` | `user_profiles` |
| **Database Columns** | - | `snake_case` | `created_at` |
| **Functions/Methods** | `camelCase` | `camelCase` | `fetchUserData()` |
| **Variables/Constants** | `camelCase` / `SCREAMING_SNAKE_CASE` | `camelCase` / `SCREAMING_SNAKE_CASE` | `userName`, `API_BASE_URL` |

---
