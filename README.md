# ClaimSettle AI – Instant Motor Insurance Claims

> **Developed by NITIN CHUGH**

ClaimSettle AI is a next-generation motor insurance claims platform designed to revolutionize the settlement process. By leveraging advanced AI vision models (Google Gemini / Anthropic Claude), the platform can ingest damage photos, instantly assess repair costs using Indian IRDAI market standards, and approve eligible settlements within 15 minutes.

## 🚀 Key Features

*   **Photo-Based AI Assessment:** Upload images of vehicle damage to receive an instant, highly-accurate repair estimate.
*   **IRDAI Compliant Engine:** Calculates OEM part prices, labor costs by city tier, and mandatory depreciation rates automatically.
*   **Fraud Detection:** Built-in EXIF metadata extraction and AI heuristics flag tampered images and inconsistent damage for manual review.
*   **Persistent User Dashboard:** Claimants can securely log in using their Policy Number to view their entire claim history and track real-time status.
*   **Live Officer Queue:** A real-time synchronized dashboard (powered by Supabase) for human adjusters to confidently review, approve, or escalate AI-processed claims.
*   **Demo Mode Fallback:** Automatically intercepts failed LLM API calls to provide a hyper-realistic mock assessment so the application never breaks during demonstrations.

## 🛠 Tech Stack

*   **Frontend:** Next.js 14, React, Tailwind CSS, Material UI (MUI), Shadcn UI, Framer Motion
*   **Backend:** Next.js Serverless API Routes
*   **Database:** PostgreSQL (Supabase), Drizzle ORM
*   **AI Integrations:** Google Generative AI (Gemini 1.5 Flash), Anthropic Claude 3
*   **Data Visualization:** Recharts

## 📦 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Supabase Account
*   Google AI Studio API Key (Free)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/NitinChugh13/AIClaimSettle.git
    cd AIClaimSettle
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**
    Rename `.env.example` (or configure a new `.env.local` file) with your credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    DATABASE_URL=your_supabase_postgres_string
    GEMINI_API_KEY=your_google_ai_key
    ```

4.  **Run Database Migrations**
    ```bash
    npx drizzle-kit push
    ```

5.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🚢 Deployment (Vercel)

This application is ready to be deployed on Vercel. Because the frontend and backend are tightly integrated within Next.js, Vercel will automatically configure the serverless functions.

To deploy User and Admin panels separately as requested, you can launch the exact same repository into **Two Distinct Vercel Projects**. Then, use Vercel's **Edge Middleware** or **Redirects** to restrict access:
*   **Project 1 (User Portal):** Redirects `/admin/*` and `/officer/*` to a 404.
*   **Project 2 (Admin Portal):** Redirects `/claim/*` and `/dashboard` to a 404, acting purely as the internal network tool.

---
*Built with passion to streamline the future of insurance.*
