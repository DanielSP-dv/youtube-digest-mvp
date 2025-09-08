# **14. Deployment Architecture**

Our deployment strategy is designed for simplicity and efficiency, leveraging Vercel's integrated platform for both frontend and backend (Next.js API Routes).

### **Deployment Strategy**

*   **Frontend Deployment:**
    *   **Platform:** Vercel
    *   **Build Command:** `pnpm build` (executed by Vercel)
    *   **Output Directory:** `.next` (handled automatically by Vercel)
    *   **CDN/Edge:** Vercel's global Edge Network for fast content delivery.

*   **Backend Deployment:**
    *   **Platform:** Vercel (as Next.js API Routes / Serverless Functions)
    *   **Build Command:** Integrated with the frontend build.
    *   **Deployment Method:** Serverless functions, automatically scaled by Vercel based on demand.

### **CI/CD Pipeline**

Our Continuous Integration/Continuous Deployment (CI/CD) pipeline will be handled automatically by Vercel's Git integration.

```yaml