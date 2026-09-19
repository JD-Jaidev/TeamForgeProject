# TeamForge — “Build the right team. Build the right idea.”

> **The Premier Student Collaboration & AI-Powered Team Formation Platform for Hackathons, Startups, and Academic Engineering Projects.**

---

## 🌟 Key Features

1. **AI Skill-Gap & Teammate Matching Studio**:
   - Natural language requirement extraction via OpenRouter API / LLMs.
   - Deterministic weighted scoring matching skills, experience, reviews, and credits.
   - **Transparent Explainability**: Clear rationale displayed for every recommendation (e.g. *"Recommended because this member has PyTorch & NLP experience and fills the team's ML skill gap"*).
2. **Reputation & Specialist Search**:
   - Filter peer builders by verified star ratings (4.8+), reputation credits, and completed hackathons.
3. **Guest Contributor & Specialist Request System**:
   - Request temporary domain specialists for high-intensity hackathon sprints without surrendering team ownership.
4. **Real-Time Team Chat & Integrated `@ForgeAI`**:
   - Live WebSocket communication powered by Supabase Realtime.
   - Embedded **AI Idea Generator** with 1-click prompts: *"Generate Hackathon Ideas"*, *"Suggest Tech Stack & Architecture"*, *"Diagnose Skill Gaps"*, *"Improve Idea"*.
5. **Interactive Team Workspace & Kanban Board**:
   - Live drag-and-drop task tracking (`To Do`, `In Progress`, `Completed`).
   - Member and guest contributor access management.
6. **Peer Reviews, Ratings & Reputation Credits**:
   - Post-collaboration review engine with credit bonuses that elevate student rankings.
7. **Hackathons & Competitions Directory**:
   - Up-to-date events list with prizes and 1-click "Form Squad with AI" button.
8. **Platform-Wide Hiring Feed**:
   - Publish developer openings with credit bounties.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (modular component structure), Tailwind CSS via CDN, custom dark glassmorphism design system.
- **Backend / Platform**: Supabase (PostgreSQL Database, Supabase Auth, Supabase Realtime, Supabase Storage, Edge Functions).
- **AI Layer**: OpenRouter API (`google/gemini-2.0-flash-001`) with Supabase Edge Functions proxy and local heuristic NLP fallback.
- **Deployment**:
  - **Frontend**: Vercel
  - **Backend & Realtime**: Supabase
  - **AI Proxy**: Supabase Edge Functions

---

## 📁 Project Structure

```
teamforge/
├── index.html                  # Landing Page (Hero, Live Demo Analyzer, Stats, CTA)
├── login.html                  # Authentication & 1-Click Fast Persona Switcher
├── signup.html                 # Registration & Student Onboarding (Skills, College, Links)
├── dashboard.html              # Main User Command Center (Active Teams, AI Matches, Hackathons)
├── discover.html               # Discover Peers (Multi-filter, Search, Skill Badges, 1-Click Invite)
├── profile.html                # Public & Personal Profile (Tech Stack, Verified Reviews, Credits)
├── ai-match.html               # AI Matching Studio (NLP Analysis, Gaps, Explainable Rankings)
├── teams.html                  # Discover Teams (Browse open roles, Request to Join)
├── create-team.html            # Team Creation Wizard (Skills needed, Roles, Guest Policy)
├── team.html                   # Team Workspace (Roster, Guest Badges, Live Kanban Task Board)
├── chat.html                   # Real-Time Team Chat with @ForgeAI & Idea Generator
├── opportunities.html          # Hiring & Specialist Opportunities Feed
├── events.html                 # Hackathons & Competitions Directory
├── notifications.html          # Real-Time Notification Center
├── settings.html               # API Credentials Configurator & Demo Utilities
├── css/
│   └── styles.css              # Dark glassmorphic design system, animations & glow tokens
├── js/
│   ├── config.js               # Supabase & OpenRouter configuration
│   ├── supabase.js             # Data store & initial realistic seed dataset
│   ├── auth.js                 # Authentication, personas & session management
│   ├── state.js                # Reactivity, modals & toast notifications
│   ├── ui.js                   # Shared layout (Navbar, Sidebar, Footer, Badges)
│   ├── matching.js             # AI NLP skill extraction & weighted candidate matching engine
│   ├── ai-service.js           # OpenRouter AI client & prompt templates
│   ├── chat.js                 # Team chat & AI bot (@ForgeAI) logic
│   ├── teams.js                # Team creation, invitations & join requests
│   ├── tasks.js                # Kanban task drag/drop and state transitions
│   ├── reviews.js              # Reviews, star ratings & credit calculation
│   └── events.js               # Hackathon & Opportunity feed management
├── supabase/
│   ├── migrations/
│   │   └── 20260917000001_initial_schema.sql  # Full PostgreSQL tables & RLS policies
│   ├── functions/
│   │   └── ai-assistant/
│   │       └── index.ts        # Supabase Edge Function for secure OpenRouter proxy
│   └── seed.sql                # Production seed SQL dataset
├── vercel.json                 # Vercel deployment routing configuration
└── README.md                   # Full documentation & setup guide
```

---

## 🚀 Getting Started Locally

1. Open the project folder in any web browser or local static server (e.g. VS Code Live Server, `npx serve`, or `python -m http.server 3000`).
2. Navigate to `index.html` or `signup.html`.
3. Create a student account on `signup.html` to start building teams and discovering peers.
4. (Optional) Configure your API keys in `settings.html` or copy `js/env.example.js` to `js/env.js` (untracked by Git).

---

## ☁️ Production Deployment

### 1. Supabase Backend Setup
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase and run `supabase/migrations/20260917000001_initial_schema.sql`.
3. (Optional) Run `supabase/seed.sql` to populate initial skills and hackathon challenges.
4. Copy your **Project URL** and **Anon Public Key** from `Project Settings > API`.
5. Enter these keys in `settings.html` (stored in your browser) or via Supabase Edge Functions.

### 2. Supabase Edge Function Deployment (Optional AI Proxy)
Deploy the secure OpenRouter proxy function to keep your OpenRouter key 100% secret on the server:
```bash
supabase functions deploy ai-assistant --no-verify-jwt
supabase secrets set OPENROUTER_API_KEY=sk-or-v1-...
```

### 3. Vercel Frontend Deployment
1. Push the codebase to a GitHub repository.
2. Import the repository in [Vercel](https://vercel.com).
3. The included `vercel.json` will automatically configure routing.
4. Deploy!

---

## 🔒 Security & Row Level Security (RLS)

- **User Profiles**: Viewable publicly; editable strictly by the owning user (`auth.uid() = id`).
- **Team Isolation**: Chat messages and private workspace tasks are protected via RLS to team members and authorized guest contributors only.
- **AI Key Security**: OpenRouter API keys are processed server-side via Supabase Edge Functions.

---

© 2026 TeamForge. Built for ambitious student teams.
