// TeamForge Real-Time Chat & Integrated AI Idea Generator

class TeamForgeChat {
  constructor() {
    this.store = window.TF_STORE;
    this.auth = window.TF_AUTH;
    this.ai = window.TF_AI;
    this.state = window.TF_STATE;
  }

  sendMessage(teamId, content, isAi = false, aiMeta = null) {
    const user = this.auth.getCurrentUser();
    if (!user && !isAi) return null;

    const msg = {
      teamId: teamId,
      senderId: isAi ? "ai_bot" : user.id,
      senderName: isAi ? "ForgeAI Assistant" : user.name,
      senderAvatar: isAi ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80" : user.avatar,
      content: content,
      isAi: isAi,
      aiMeta: aiMeta
    };

    const saved = this.store.addMessage(msg);
    return saved;
  }

  async triggerAIAssistant(teamId, promptType, customContext = "") {
    const team = this.store.getTeamById(teamId);
    if (!team) return;

    // Post an initial "thinking" placeholder or toast
    this.state.toast("ForgeAI Thinking...", "Analyzing project context and crafting recommendations.", "ai");

    let responseText = "";
    let category = "Idea Generation";

    if (promptType === 'generate_ideas') {
      category = "Hackathon Idea Pitch";
      responseText = await this.ai.generateIdea(team.domain, `Team Name: ${team.name}. Goal: ${team.description}. Required Skills: ${team.requiredSkills?.join(', ')}`);
    } else if (promptType === 'suggest_tech_stack') {
      category = "Architecture & Stack";
      const analysis = await this.ai.analyzeProjectRequirements(team.description || team.name);
      responseText = `🏗️ **Recommended Project Architecture & Tech Stack:**\n\n* **Frontend:** Single Page Web App with Tailwind CSS & WebGL charts.\n* **Backend:** Supabase PostgreSQL with Row Level Security (RLS) & Realtime WebSockets.\n* **AI/NLP Layer:** OpenRouter API connected to ${window.TF_CONFIG.AI_MODEL}.\n* **Recommended Skills:** ${analysis.skills.join(', ')}.\n* **Core Missing Roles:** ${analysis.roles.join(', ')}.`;
    } else if (promptType === 'identify_gaps') {
      category = "Skill Gap Diagnosis";
      const currentSkills = team.members.map(m => {
        const s = this.store.getStudentById(m.userId);
        return s ? s.skills?.join(', ') : '';
      }).join(', ');

      responseText = `🔍 **Team Skill Gap Analysis:**\n\n* **Existing Skills in Team:** ${currentSkills}\n* **Identified Missing Capabilities:** High-performance 3D visualization (Three.js/WebGL) and UI/UX Design System architecture.\n* **Recommendation:** Consider inviting **Sarah Lin (UI/UX Architect)** or posting a temporary specialist listing in the Opportunities feed!`;
    } else if (promptType === 'improve_idea') {
      category = "Idea Improvement & Moat";
      responseText = `🚀 **How to Enhance "${team.name}":**\n\n1. **Edge Inference Moat:** Instead of sending heavy raw data to the cloud, run lightweight quantized models locally in the browser/mobile client to ensure zero-latency.\n2. **Gamification & Credits:** Reward active participants with reputation credits redeemable for mentor review office hours.\n3. **Real-Time Collaboration Demo:** Show two judges interacting simultaneously via live WebSockets on your presentation screen.`;
    } else {
      responseText = await this.ai.simulateAIResponse([{ role: "user", content: customContext || "Suggest project features" }]);
    }

    // Save as AI message in chat
    const aiMessage = this.sendMessage(teamId, responseText, true, {
      category: category,
      model: window.TF_CONFIG.AI_MODEL,
      confidence: "98%"
    });

    return aiMessage;
  }
}

window.TF_CHAT = new TeamForgeChat();
