# **Epic 3: Polish & User Experience**

**Goal:** To add essential user experience features like a "Save for later" list, loading states, and basic error handling.

### **Story 3.1: "Save for Later" Functionality**

*   **As a** user,
*   **I want** a way to save interesting summaries,
*   **so that** I can easily find them again later.

**Acceptance Criteria:**

1.  Each summary card on the dashboard has a "Save" button.
2.  Clicking "Save" stores the video's ID and title in the browser's `localStorage`.
3.  A "Saved Items" link is available in the main navigation.
4.  The "Saved Items" page retrieves the list from `localStorage` and displays the saved video titles.
5.  The user can remove items from their saved list, which updates `localStorage`.

### **Story 3.2: Add Basic Loading States**

*   **As a** user,
*   **I want** to see loading indicators when the application is fetching data,
*   **so that** I know the system is working and I'm not looking at a frozen page.

**Acceptance Criteria:**

1.  A loading message or spinner is displayed on the `/channels` page while subscriptions are being fetched.
2.  A loading message or spinner is displayed on the `/dashboard` page while summaries are being fetched.
3.  The "Refresh" button on the dashboard is disabled and shows a "Refreshing..." state while the backend is processing new videos.

### **Story 3.3: Add Basic Error Handling**

*   **As a** user,
*   **I want** to see a clear message if something goes wrong,
*   **so that** I am not left with a blank or broken page.

**Acceptance Criteria:**

1.  If an API call to the backend fails, a user-friendly error message (e.g., "Could not load data. Please try again later.") is displayed on the relevant page.
2.  Sensitive error details are not exposed to the user in the UI.
3.  The application does not crash on a failed API call.

### **Story 3.4: Apply Basic Styling**

*   **As a** developer,
*   **I want** to apply minimal, clean styling to the application,
*   **so that** it is presentable and usable for the demo.

**Acceptance Criteria:**

1.  A simple, consistent layout is applied to all pages (Login, Channels, Dashboard, Saved).
2.  Buttons, lists, and text are styled for readability using basic CSS.
3.  The application has a clean and professional, yet minimal, look, avoiding unpolished default browser styles.

---
