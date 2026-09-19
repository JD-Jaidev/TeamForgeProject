// Supabase Edge Function: ai-assistant
// Proxies OpenRouter API calls securely using Deno runtime.

// Type declaration for IDEs without global Deno types
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response> | Response): void;
};

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing OPENROUTER_API_KEY in Edge Function secrets." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    let payload: { action?: string; prompt?: string; teamContext?: string; model?: string };
    try {
      payload = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON request body." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const { action, prompt = "", model = "google/gemini-2.0-flash-001" } = payload;

    let systemPrompt = "You are TeamForge AI, an expert technical lead and hackathon mentor.";
    let userPrompt = prompt;

    if (action === "analyze_requirements") {
      systemPrompt = `You are TeamForge AI. Analyze the project description and extract required skills, missing roles, and system architecture. Output MUST be valid JSON:
{
  "skills": ["Skill1", "Skill2"],
  "roles": ["Role1", "Role2"],
  "architecture": "...",
  "stackRecommendation": "..."
}`;
    } else if (action === "generate_ideas") {
      systemPrompt = "You are ForgeAI, an innovation hackathon mentor. Generate a detailed, high-impact winning project idea with Title, Problem, Solution, Tech Stack, and Team Roles.";
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://teamforge.vercel.app",
        "X-Title": "TeamForge Supabase AI",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: `OpenRouter API error (${response.status}): ${errorText}` }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

