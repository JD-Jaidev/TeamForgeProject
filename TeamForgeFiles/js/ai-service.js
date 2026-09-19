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
