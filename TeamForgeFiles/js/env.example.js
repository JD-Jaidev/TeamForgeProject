// ==============================================================================
// TeamForge Local Development Environment Example
// If you wish to set keys via file locally:
// 1. Copy this file to "js/env.js" (which is git-ignored).
// 2. Add your keys in "js/env.js".
// 3. DO NOT commit "js/env.js" to GitHub!
// ==============================================================================

window.__ENV__ = {
  SUPABASE_URL: "https://your-project.supabase.co",
  SUPABASE_ANON_KEY: "your-supabase-anon-key",
  OPENROUTER_API_KEY: "sk-or-v1-your-openrouter-key", // optional if using client-side AI direct calls
  AI_MODEL: "meta-llama/llama-3.3-70b-instruct:free",
  EDGE_FUNCTION_URL: ""
};
