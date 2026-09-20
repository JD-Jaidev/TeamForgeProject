// TeamForge AI Service (OpenRouter API Integration & Intelligent Fallback Engine)
// Handles Project Requirement Analysis, Skill Extraction, Architecture Suggestions, and Idea Generation.

class TeamForgeAIService {
  constructor() {
    this.model = window.TF_CONFIG.AI_MODEL || 'google/gemini-2.0-flash-001';
  }

  async callOpenRouter(messages, temperature = 0.7) {
    const edgeUrl = window.TF_CONFIG.EDGE_FUNCTION_URL;
    const apiKey = window.TF_CONFIG.OPENROUTER_API_KEY;
    
    // 1. If Edge Function URL is configured, call the secure backend proxy
    if (edgeUrl) {
      try {
        const response = await fetch(edgeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(window.TF_CONFIG.SUPABASE_ANON_KEY ? { 'Authorization': `Bearer ${window.TF_CONFIG.SUPABASE_ANON_KEY}` } : {})
          },
          body: JSON.stringify({
            messages: messages,
            model: this.model,
            temperature: temperature
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && (data.reply || data.content || data.choices?.[0]?.message?.content)) {
            return data.reply || data.content || data.choices[0].message.content;
          }
        }
      } catch (err) {
        console.warn("Edge Function proxy call failed, falling back to direct API or local NLP heuristics:", err);
      }
    }

    // 2. If user provided OpenRouter key, make direct request
    if (apiKey) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'TeamForge AI Platform',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: this.model,
            messages: messages,
            temperature: temperature
          })
        });

        if (!response.ok) {
          throw new Error(`OpenRouter HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "";
      } catch (err) {
        console.warn("OpenRouter direct API call failed or rate-limited. Using intelligent built-in AI engine:", err);
      }
    }

    // 3. High quality intelligent simulated responses tailored to student hackathons & project formation
    return this.simulateAIResponse(messages);
  }

  async analyzeProjectRequirements(projectPrompt) {
    const promptLower = projectPrompt.toLowerCase();
    
    // Attempt OpenRouter structured response if configured
    if (window.TF_CONFIG.isOpenRouterConfigured()) {
      const messages = [
        {
          role: "system",
          content: `You are TeamForge AI, an expert technical lead and hackathon mentor. Analyze the project description and extract:
1. Key Technical Skills required (JSON array of strings, e.g. ["Python", "PyTorch", "FastAPI", "React"])
2. Missing Core Roles needed (JSON array of strings, e.g. ["ML Engineer", "Frontend Lead", "UI/UX Designer"])
3. Recommended System Architecture summary (1-2 sentences)
4. Recommended Database & Infrastructure (e.g. Supabase, PostgreSQL, Vector DB, WebSockets)
Output MUST be raw valid JSON matching this schema:
{
  "skills": ["..."],
  "roles": ["..."],
  "architecture": "...",
  "stackRecommendation": "..."
}`
        },
        { role: "user", content: projectPrompt }
      ];

      try {
        const raw = await this.callOpenRouter(messages, 0.2);
        const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (e) {
        console.warn("Parsing AI JSON failed, falling back to local NLP heuristics", e);
      }
    }

    // Heuristic NLP Skill & Role Extractor
    const skillDictionary = [
      { trigger: ["python", "machine learning", "ml", "nlp", "llm", "ai", "model", "deep learning", "neural"], skills: ["Python", "PyTorch", "NLP", "FastAPI"], roles: ["AI/ML Lead", "NLP Specialist"] },
      { trigger: ["react", "vue", "frontend", "ui", "ux", "interface", "design", "tailwind", "figma", "web"], skills: ["React", "Tailwind CSS", "UI/UX Design", "TypeScript"], roles: ["Frontend Architect", "UI/UX Designer"] },
      { trigger: ["backend", "api", "database", "sql", "postgres", "distributed", "server", "microservice"], skills: ["PostgreSQL", "Supabase", "Node.js", "Docker"], roles: ["Backend Lead", "DevOps Engineer"] },
      { trigger: ["mobile", "ios", "android", "flutter", "react native", "app"], skills: ["Flutter", "React Native", "TypeScript"], roles: ["Mobile Developer"] },
      { trigger: ["blockchain", "web3", "crypto", "smart contract", "solidity", "defi"], skills: ["Solidity", "Hardhat", "Ethers.js", "Rust"], roles: ["Smart Contract Dev", "Web3 Architect"] },
      { trigger: ["computer vision", "vision", "opencv", "camera", "drone", "robotics", "yolo"], skills: ["Computer Vision", "OpenCV", "PyTorch", "C++"], roles: ["Computer Vision Specialist", "Embedded Robotics Dev"] }
    ];

    const detectedSkills = new Set();
    const detectedRoles = new Set();

    skillDictionary.forEach(entry => {
      if (entry.trigger.some(term => promptLower.includes(term))) {
        entry.skills.forEach(s => detectedSkills.add(s));
        entry.roles.forEach(r => detectedRoles.add(r));
      }
    });

    if (detectedSkills.size === 0) {
      detectedSkills.add("JavaScript");
      detectedSkills.add("Python");
      detectedSkills.add("UI/UX Design");
      detectedRoles.add("Full Stack Developer");
      detectedRoles.add("UI/UX Designer");
    }

    return {
      skills: Array.from(detectedSkills),
      roles: Array.from(detectedRoles),
      architecture: `Modern full-stack architecture with a decoupled client, PostgreSQL/Supabase real-time sync, and microservices for computationally intensive tasks.`,
      stackRecommendation: `Supabase (Auth + DB + Realtime) + Vercel Frontend + OpenRouter AI backend.`
    };
  }

  async generateIdea(category = 'hackathon', context = '') {
    const messages = [
      {
        role: "system",
        content: `You are ForgeAI, an elite innovation hackathon mentor. Generate a unique, groundbreaking project idea with high winning potential.`
      },
      {
        role: "user",
        content: `Category: ${category}. Additional Context: ${context || 'General futuristic hackathon project'}. Provide:
1. Title
2. Tagline
3. Problem Statement
4. Unique Solution
5. Recommended Tech Stack
6. Ideal Team Composition`
      }
    ];

    return await this.callOpenRouter(messages);
  }

  async askHackathonQuery(hackathon, userQuery, chatHistory = []) {
    const allEvents = window.TF_STORE ? window.TF_STORE.getEvents() : [];
    
    // Construct rich context about the specific hackathon or all posted hackathons
    let contextDescription = "";
    if (hackathon && hackathon.title) {
      contextDescription = `
Target Hackathon: "${hackathon.title}"
Organizer: ${hackathon.organizer || 'Student Committee / Tech Host'}
Dates: ${hackathon.dates || 'Upcoming 2026'}
Registration Deadline: ${hackathon.deadline || 'TBA'}
Prizes & Bounty: ${hackathon.prize || 'Cash Prize & Swag'}
Format / Mode: ${hackathon.mode || 'Online'} (${hackathon.location || 'Global'})
Key Tracks & Tags: ${(hackathon.tags || []).join(', ') || 'AI, Web3, Full Stack, Innovation'}
Description & Problem Statement: ${hackathon.description || 'Global student hackathon challenge.'}
`;
    } else {
      contextDescription = `
All Currently Posted Hackathons on TeamForge:
${allEvents.map((e, idx) => `${idx + 1}. "${e.title}" | Dates: ${e.dates} | Prize: ${e.prize} | Mode: ${e.mode} | Tags: ${(e.tags || []).join(', ')} | Overview: ${e.description}`).join('\n')}
`;
    }

    const systemPrompt = `You are ForgeAI, the official TeamForge Hackathon Mentor, Technical Lead, and Competition Strategist.
You assist students and developer teams with winning strategies, high-impact project brainstorming, technical architecture, team role requirements, time management, and pitch advice.

Current Hackathon Context:
${contextDescription}

Guidelines:
- Deliver sharp, highly actionable answers tailored to the hackathon's specific theme, rules, and timeline.
- Format responses cleanly with bold text, headings, and clear bullet points.
- If brainstorming ideas, suggest feasible, demo-ready concepts suitable for a 24-48 hour hackathon build.
- Suggest modern tech stacks for rapid prototyping (e.g. Supabase, FastAPI/Node, Next.js/React, TailwindCSS, OpenRouter/LLM APIs, Vercel).
- Keep your tone encouraging, ambitious, and direct.`;

    const messages = [
      { role: "system", content: systemPrompt }
    ];

    // Append recent history for multi-turn dialogue
    if (Array.isArray(chatHistory)) {
      chatHistory.slice(-6).forEach(msg => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    messages.push({ role: "user", content: userQuery });

    if (window.TF_CONFIG.isOpenRouterConfigured() || window.TF_CONFIG.EDGE_FUNCTION_URL) {
      try {
        const reply = await this.callOpenRouter(messages, 0.7);
        if (reply && reply.trim()) {
          return reply;
        }
      } catch (err) {
        console.warn("AI API call failed or rate-limited. Falling back to local heuristic response:", err);
      }
    }

    return this.simulateHackathonResponse(hackathon, userQuery);
  }

  simulateHackathonResponse(hackathon, userQuery) {
    const q = (userQuery || '').toLowerCase();
    const eventName = hackathon?.title || 'this Hackathon';
    const tags = (hackathon?.tags || ['AI', 'Web Development']).join(', ');
    const prize = hackathon?.prize || 'Cash Prizes & Certificates';
    const dates = hackathon?.dates || 'Upcoming Sprint';
    const mode = hackathon?.mode || 'Online';

    if (q.includes('idea') || q.includes('brainstorm') || q.includes('project') || q.includes('build')) {
      return `💡 **Top 2 Winning Project Ideas for ${eventName}**

### Option 1: AI-Powered Adaptive Assistant (*Highest Scoring*)
* **Concept:** A real-time intelligent workspace tool integrating LLMs with low-latency streaming to automate complex workflows.
* **Why it wins:** Judges love working demos that solve clear productivity bottlenecks within 30 seconds of presentation.
* **Key Tech:** Next.js, Supabase Realtime, FastAPI, Vector Search.

### Option 2: Collaborative Hub with Live Edge Sync
* **Concept:** A multi-tenant platform focusing on real-time peer interactions, live telemetry, and automated role discovery.
* **Why it wins:** Demonstrates high technical complexity and seamless multiplayer collaboration.
* **Key Tech:** Tailwind CSS, WebSockets / Supabase RLS, Node.js / Python.

👉 **Next Step:** Head to **AI Match** to assemble teammates with complementary skills in **${tags}**!`;
    }

    if (q.includes('stack') || q.includes('tech') || q.includes('architecture') || q.includes('tools')) {
      return `🛠️ **Recommended Tech Stack & Architecture for ${eventName}**

* **Frontend:** React / Vite or Next.js + Tailwind CSS *(for rapid, beautiful UI prototyping)*
* **Backend & Database:** Supabase (PostgreSQL + Auth + Realtime Database) *(saves 10+ hours of backend setup)*
* **AI & Intelligence:** OpenRouter API / Gemini Flash API *(high speed, cost-effective inference)*
* **Deployment & CI/CD:** Vercel / Railway *(1-click zero-downtime deploy for live judging)*

⚡ **Pro Tip:** Don't build custom auth or complex server management from scratch. Use managed backends so you can spend 90% of your time on the core user experience.`;
    }

    if (q.includes('role') || q.includes('team') || q.includes('members') || q.includes('squad') || q.includes('skill')) {
      return `👥 **Ideal Team Composition for ${eventName}**

To maximize your chances of winning the **${prize}**, recruit this balanced 3-4 member squad:

1. **Lead Full Stack / System Architect:** Handles API integrations, database schemas, and state management.
2. **AI / ML / Backend Specialist:** Implements core domain logic, prompt pipelines, and embeddings.
3. **Frontend & UI/UX Designer:** Creates polished glassmorphic UI, responsive layouts, and the pitch presentation.
4. **Product Lead & Pitch Presenter:** Refines the narrative, ensures MVP scope fits the deadline, and leads the judge Q&A.

🎯 *You can 1-click invite peers matching these exact skills right here on TeamForge!*`;
    }

    if (q.includes('roadmap') || q.includes('timeline') || q.includes('schedule') || q.includes('time') || q.includes('plan')) {
      return `⏱️ **Winning 48-Hour Hackathon Execution Plan**

* **Hours 0–4 (Foundation):** Lock down the MVP scope, initialize GitHub repo, Supabase database, and assign team roles.
* **Hours 5–20 (Core Build):** Implement the primary feature that makes your project stand out. Keep it functioning end-to-end.
* **Hours 21–36 (Polish & Sync):** Connect the frontend to live APIs, add animations, and eliminate blocker bugs.
* **Hours 37–44 (Pitch & Demo Prep):** Record a 2-minute backup demo video, write the README, and prepare the slide deck.
* **Hours 45–48 (Final Submission):** Deploy live link, test from mobile & incognito browsers, and submit ahead of the deadline!`;
    }

    if (q.includes('judge') || q.includes('pitch') || q.includes('win') || q.includes('presentation') || q.includes('criteria')) {
      return `🏆 **Pitch & Judging Strategy for ${eventName}**

Judges evaluate hackathons across 4 core pillars:
1. **Innovation & Originality (30%):** Solve a real, recognizable problem in a novel way.
2. **Technical Execution & Polish (30%):** A working, beautiful prototype beats 10 half-finished complex features.
3. **Business & Real-World Impact (20%):** Explain who benefits and why this can become a real product.
4. **Presentation & Live Demo (20%):**
   * Start with a 15-second hook (the pain point).
   * Show the live working product immediately (avoid 5 minutes of theory slides).
   * Finish with a crisp summary of next steps.`;
    }

    return `✨ **ForgeAI Hackathon Strategy for ${eventName}**

* **Event Timeline:** ${dates} (${mode})
* **Target Prize:** ${prize}
* **Focus Tracks:** ${tags}

I can help you brainstorm winning ideas, suggest technical architectures, map out team roles, or prepare your pitch. What specific aspect of **${eventName}** would you like guidance on?`;
  }

  simulateAIResponse(messages) {
    const userMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';

    if (userMsg.includes('generate project idea') || userMsg.includes('suggest ideas') || userMsg.includes('idea')) {
      return `🚀 **Hackathon Project Idea: Omnisight Health AI**
**Tagline:** Real-time multimodal ER triage and clinician voice copilot.

* **Problem Statement:** Emergency rooms suffer from severe documentation lag, leading to delayed patient evaluations and burnt-out nursing staff.
* **Innovative Solution:** An ambient edge microphone system that listens to patient intake dialogues, extracts vital symptoms using Whisper & fine-tuned medical LLMs, and updates FHIR-compliant medical charts in real time.
* **Key Tech Stack:** Python, PyTorch, FastAPI, Supabase Realtime, WebRTC, Tailwind CSS, TypeScript.
* **Ideal Team Composition:**
  - 1 AI/NLP Researcher (Model fine-tuning & prompt pipeline)
  - 1 Full Stack Engineer (Supabase & Realtime synchronization)
  - 1 Healthcare UI/UX Designer (High-contrast, high-stress visual dashboard)
  - 1 Systems/Security Specialist (HIPAA compliance & local edge inference)`;
    }

    if (userMsg.includes('architecture') || userMsg.includes('tech stack')) {
      return `🏗️ **Recommended System Architecture:**
* **Frontend:** Single Page Application deployed to Vercel with Tailwind CSS and glassmorphic micro-interactions for snappy responsiveness.
* **Backend Platform:** Supabase PostgreSQL with Row Level Security (RLS), Supabase Auth, and Realtime WebSockets for sub-50ms sync.
* **AI Engine:** OpenRouter API proxying high-speed LLMs (e.g. Gemini 2.0 Flash / LLaMA 3.3 70B) via secure serverless Edge Functions.
* **Storage & Assets:** Supabase Storage buckets with fine-grained presigned upload URLs.`;
    }

    if (userMsg.includes('missing') || userMsg.includes('skill gap')) {
      return `🔍 **Identified Team Skill Gaps:**
Based on your current roster, your team is heavily weighted towards backend infrastructure, but lacks:
1. **Interactive Frontend / 3D Visualization Lead** (Needed for WebGL/Three.js charts).
2. **Product Designer / Figma Specialist** (Needed for polished slide deck & demo UI).
*Recommendation:* Post an open guest specialist role or invite **Sarah Lin (UI/UX Architect)**!`;
    }

    return `💡 **ForgeAI Assistant Insight:**
I analyzed your project parameters. To maximize your team's hackathon evaluation score:
1. Ensure your core demo has a clear 30-second "Aha!" moment.
2. Leverage Supabase Realtime for live collaborative interactions during your pitch.
3. Quantify impact (e.g., *"Reduces latency by 74%"* or *"Saves 4 hours per clinic shift"*).`;
  }
}

window.TF_AI = new TeamForgeAIService();
