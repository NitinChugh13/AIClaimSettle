# 🚗 ClaimSettle AI  
### Instant Motor Insurance Claims Powered by AI  

[![Live Demo](https://img.shields.io/badge/Live-Demo-00C853?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-claims-settle.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs)]
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)]
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20%7C%20Claude-blueviolet?style=for-the-badge)]

> **Developed by Nitin Chugh**  
> Transforming motor insurance claims using AI-driven automation.

---

## 🌐 Live Application

🔗 **Try it here:**  
👉 https://ai-claims-settle.vercel.app/

Experience real-time AI-powered motor damage assessment and instant claim simulation.

---

## 🎯 Vision

ClaimSettle AI reimagines the traditional motor insurance claim process by reducing manual intervention, eliminating delays, and providing instant AI-powered cost estimation using real-world IRDAI standards.

The platform enables:
- ⚡ 15-minute claim approvals
- 🤖 AI-based damage assessment
- 🔍 Fraud detection via metadata analysis
- 📊 Real-time dashboard for officers

---

## 🚀 Key Features

### 📸 Photo-Based AI Damage Assessment
Upload vehicle damage images and receive an instant repair cost breakdown using advanced AI vision models.

### 🧾 IRDAI-Compliant Estimation Engine
- OEM part price mapping  
- City-tier labor cost calculation  
- Depreciation logic  
- Insurance rule-based validation  

### 🛡 Fraud Detection System
- EXIF metadata extraction  
- Image tampering detection  
- AI-based damage consistency validation  
- Automatic manual review flagging  

### 👤 Secure Claimant Dashboard
Users log in using Policy Number to:
- Track claim status  
- View previous claims  
- Download assessment reports  

### 🧑‍💼 Live Officer Queue (Real-Time)
- Synced dashboard powered by Supabase  
- AI recommendations + manual override  
- Approve / Reject / Escalate workflow  

### 🎭 Demo Mode Fallback
If external AI APIs fail, the app auto-generates realistic mock responses to ensure uninterrupted demo experience.

---

## 🧠 How It Works

1. User uploads damage photos  
2. AI model (Gemini / Claude) analyzes visual damage  
3. Backend applies IRDAI logic engine  
4. Fraud detection checks image metadata  
5. Instant cost estimate generated  
6. Officer dashboard receives claim for approval  

---

## 🛠 Tech Stack

### Frontend
- Next.js 14 (App Router)
- React
- Tailwind CSS
- Material UI (MUI)
- Shadcn UI
- Framer Motion

### Backend
- Next.js Serverless API Routes
- Drizzle ORM

### Database
- PostgreSQL (Supabase)

### AI Integration
- Google Gemini 1.5 Flash
- Anthropic Claude 3

### Data Visualization
- Recharts

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- Supabase Account
- Google AI Studio API Key

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/NitinChugh13/AIClaimSettle.git
cd AIClaimSettle

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


*Built with passion to streamline the future of insurance.*


