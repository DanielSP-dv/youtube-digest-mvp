# **Project Brief: YouTube Digest**

**Executive Summary**

This project will create a web application that helps users efficiently consume content from their favorite YouTube channels. The application will allow users to connect their YouTube account, select up to 10 subscribed channels, and receive AI-generated summaries of the latest videos from those channels. These summaries will be delivered as a digest to their email, allowing them to save time and stay up-to-date. The core value proposition is to provide a time-saving and efficient way for users to manage their YouTube subscriptions and discover content without having to spend hours on the platform.

**Problem Statement**

Users want to stay up-to-date on the creators they chose while spending less time sifting through noise. The current YouTube experience pushes an algorithmic feed that buries subscriptions, creates endless scroll, and wastes time. Users need a fast way to see what truly matters from the channels they follow, decide in seconds, save or act, and build lasting knowledge from the best content.

*   **Core Pains Today:** Devalued subscriptions, addictive discovery loops, slow triage due to clickbait, noisy notifications, manual curation, shallow saving options, and the inability to easily reuse knowledge trapped in videos.
*   **Jobs to Be Done:** Users want a single, clean queue of their selected channels with glanceable summaries, easy organization tools, scheduled email digests, and exportable transcripts.
*   **Why the Current Platform Fails:** It optimizes for session length, not user intent, and lacks tools for converting video content into structured knowledge.
*   **Consequences for Users:** Time loss, missed content, low signal-to-noise ratio, and valuable insights remaining trapped in video format.

**Proposed Solution**

We will build a web application that provides a streamlined and efficient way for users to consume content from their YouTube subscriptions. The core of the solution is a user-centric dashboard that replaces YouTube's algorithmic feed with a curated queue of the latest videos from channels the user explicitly selects. The application will be built on the core principle of **Reliability**, ensuring a consistent and trustworthy experience.

*   **Core Concept:** Users will authenticate via Google, select up to 10 channels, and receive AI-powered summaries and chapters on a clean dashboard.
*   **Key Differentiators:** Curation over algorithm, at-a-glance triage with AI summaries, actionable knowledge through transcript saving, and a focus on productivity with email digests.
*   **High-Level Vision:** To create an indispensable tool for intentional YouTube consumption, empowering users to reclaim their time and attention for focused learning and efficient knowledge capture.

**Target Users**

*   **Primary User Segment: The Focused Achiever**
    *   **Profile:** Tech-savvy professionals, entrepreneurs, and lifelong learners who are highly conscious of their time and personal well-being. They actively work to minimize digital distractions and adopt AI-powered productivity tools to gain an edge.
    *   **Goals:** To leverage high-quality video content for professional and personal growth without sacrificing productivity or well-being, and to do so in the most time-efficient and distraction-free way possible.

**Goals & Success Metrics**

*   **Business Objectives:**
    1.  Successfully deploy a stable and functional MVP to a public server for a test base of 50 users.
    2.  Gather qualitative feedback from at least 50 active users within the first three months to validate the core value proposition.
    3.  Achieve a 20% week-one user retention rate, demonstrating that the basic features are valuable.
*   **User Success Metrics:**
    *   Users feel they are back in control of their YouTube consumption.
    *   Users can get the key insights from their subscriptions in less than 15 minutes per week.
    *   Users feel confident that they are no longer missing important videos.
*   **Key Performance Indicators (KPIs):**
    *   **Weekly Active Users:** Target: 50 weekly active users within 3 months.
    *   **User Retention Rate:** Target: 20% week-2 retention.
    *   **Digest Engagement Rate:** Target: 25% click-through rate on digest emails.
    *   **User Satisfaction Score (USS):** Target: Average score of 4.0/5.0 or higher.

**MVP Scope**

*   **Core Features (Must-Have):**
    1.  Google Account Authentication
    2.  Channel Onboarding & Management (up to 10)
    3.  AI-Powered Video Summarization
    4.  Digest Dashboard
    5.  Email Digest Delivery
    6.  Simple Playlist System (Watch Later, custom folders)
    7.  Logout Functionality
*   **Out of Scope for MVP:**
    *   Advanced search and filtering.
    *   Social sharing features.
    *   Support for video platforms other than YouTube.
    *   Team or collaboration features.
    *   Support for more than 10 channels.

**Technical Considerations**

*   **Development Philosophy:** The code must be simple, effective, and concise.
*   **Frontend:** React
*   **Backend:** Node.js with Express
*   **Database:** PostgreSQL
*   **Deployment:** A simple, quick, and preferably free method (e.g., Railway, Docker).
*   **AI Summarization:** LLM API calls (e.g., GPT).
*   **Data Integrity:** Must maintain a single source of truth for all data and ensure state is consistent and persistent.

**Constraints & Assumptions**

*   **Constraints:**
    *   **Budget:** Extremely limited; must prioritize free-tier services.
    *   **Timeline:** Rapid development to get feedback from 50 test users quickly.
    *   **Resources:** The project team consists of the product visionary and an AI development agent.
*   **Key Assumptions:**
    *   We can reliably access YouTube video transcripts (potentially via SearchAPI).
    *   An LLM can consistently generate high-quality summaries.
    *   Users will grant the necessary Google/YouTube API permissions.
    *   Our target users are actively seeking a solution like this.

**Risks & Open Questions**

*   **Key Risks:**
    *   YouTube API limitations may impact scalability.
    *   Post-MVP, the cost of LLM calls will need to be managed.
    *   The quality of AI summaries needs to be validated with users.
    *   External dependency risk: dependence on Google/YouTube APIs and policies.
*   **Open Questions:**
    *   What is the most effective format for the email digest?
    *   What is the optimal number of videos to include in a digest?
    *   How will we measure user satisfaction with summary quality?

---
