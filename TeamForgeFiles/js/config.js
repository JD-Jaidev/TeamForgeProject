// TeamForge Configuration
// Supports direct Supabase and OpenRouter credentials via UI localStorage or untracked js/env.js.
// SECURITY NOTE: Never hardcode private API keys directly into this file!

const env = window.__ENV__ || {};

const TF_CONFIG = {
  SUPABASE_URL: localStorage.getItem('tf_supabase_url') || env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: localStorage.getItem('tf_supabase_anon_key') || env.SUPABASE_ANON_KEY || '',
  OPENROUTER_API_KEY: localStorage.getItem('tf_openrouter_key') || env.OPENROUTER_API_KEY || '',
  AI_MODEL: env.AI_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
  EDGE_FUNCTION_URL: localStorage.getItem('tf_edge_function_url') || env.EDGE_FUNCTION_URL || '',
  
  isSupabaseConfigured() {
    return Boolean(this.SUPABASE_URL && this.SUPABASE_ANON_KEY);
  },
  
  isOpenRouterConfigured() {
    return Boolean(this.OPENROUTER_API_KEY);
  },
  
  saveCredentials(supabaseUrl, supabaseKey, openrouterKey, edgeFunctionUrl) {
    if (supabaseUrl !== undefined) {
      this.SUPABASE_URL = supabaseUrl;
      localStorage.setItem('tf_supabase_url', supabaseUrl);
    }
    if (supabaseKey !== undefined) {
      this.SUPABASE_ANON_KEY = supabaseKey;
      localStorage.setItem('tf_supabase_anon_key', supabaseKey);
    }
    if (openrouterKey !== undefined) {
      this.OPENROUTER_API_KEY = openrouterKey;
      localStorage.setItem('tf_openrouter_key', openrouterKey);
    }
    if (edgeFunctionUrl !== undefined) {
      this.EDGE_FUNCTION_URL = edgeFunctionUrl;
      localStorage.setItem('tf_edge_function_url', edgeFunctionUrl);
    }
  }
};

window.TF_CONFIG = TF_CONFIG;