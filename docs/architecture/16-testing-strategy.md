# **16. Testing Strategy**

Our testing strategy will follow a comprehensive approach, utilizing a testing pyramid model adapted for our fullstack application, with a strong emphasis on end-to-end validation.

### **Testing Pyramid**

We will aim for a balanced testing pyramid, with a broad base of fast, isolated tests and a narrower top of slower, integrated tests.

```text
          E2E Tests (Playwright)
          /        \
    Integration Tests (Backend & Frontend)
    /            \
Frontend Unit Tests  Backend Unit Tests
```

### **Test Organization**

Tests will be organized alongside the code they test, following standard conventions for each layer.

*   **Frontend Tests:**
    *   **Unit Tests:** Located in `apps/web/src/**/*.test.ts(x)` or `apps/web/src/**/*.spec.ts(x)`. Focus on individual React components, hooks, and utility functions in isolation.
    *   **Integration Tests:** Located in `apps/web/src/**/*.integration.test.ts(x)`. Focus on how frontend components interact with each other and with the tRPC client.
*   **Backend Tests:**
    *   **Unit Tests:** Located in `packages/api/src/**/*.test.ts`. Focus on individual functions, services, and tRPC procedures in isolation.
    *   **Integration Tests:** Located in `packages/api/src/**/*.integration.test.ts`. Focus on how backend services interact with the database, external APIs (YouTube, LLM), and other internal services.
*   **E2E Tests:**
    *   **Location:** `e2e/` directory at the monorepo root.
    *   **Purpose:** Simulate real user journeys through the entire application, from login to digest delivery and playlist management.

### **Test Examples (Conceptual)**

*   **Frontend Component Test (Unit):**
    ```typescript
    // apps/web/src/components/custom/Button.test.tsx
    import { render, screen } from '@testing-library/react';
    import Button from './Button';

    test('renders button with correct text', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });
    ```
*   **Backend API Test (Integration):**
    ```typescript
    // packages/api/src/routers/channel.integration.test.ts
    import { appRouter } from '@/server/api/root';
    import { createContextInner } from '@/server/api/trpc';

    test('should fetch user subscriptions', async () => {
      const ctx = await createContextInner({}); // Mock session/user for testing
      const caller = appRouter.createCaller(ctx);
      const subscriptions = await caller.channel.getSubscriptions();
      expect(subscriptions).toBeInstanceOf(Array);
      expect(subscriptions.length).toBeGreaterThan(0);
    });
    ```
*   **E2E Test (Playwright):**
    ```typescript
    // e2e/auth.spec.ts
    import { test, expect } from '@playwright/test';

    test('user can log in and see dashboard', async ({ page }) => {
      await page.goto('/');
      await page.click('text="Create Your Digest"');
      // Simulate Google OAuth flow (e.g., mock successful login)
      // For actual E2E, this would involve real Google login or test accounts
      await page.waitForURL('/channels');
      await expect(page.locator('text="Select Your Channels"')).toBeVisible();
      // Take screenshot to verify UI state
      await page.screenshot({ path: 'e2e-screenshots/channels-page.png' });
      // Navigate to dashboard
      await page.click('text="Dashboard"');
      await expect(page.locator('text="Latest Video Summaries"')).toBeVisible();
      await page.screenshot({ path: 'e2e-screenshots/dashboard-page.png' });
    });
    ```

**Critical E2E Testing Requirement for AI Agent:**

As per your explicit request, the **development agent will be required to execute E2E tests using Playwright**. These tests will simulate user interactions in a real browser environment, including taking screenshots at key steps. This is to ensure that the agent's test results accurately reflect the user's experience and to prevent discrepancies between automated test reports and the actual application behavior.

---
