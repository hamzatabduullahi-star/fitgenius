// ============================================
// FITGENIUS — SUPABASE CONNECTION
// ============================================

const SUPABASE_URL = "https://ozdltishoxofahpqlina.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_TXLAcHOPJIn8JsahTmfupw_ZYBk5V6p";

// Create Supabase connection
const { createClient } = window.supabase;

window.fitgeniusSupabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("FitGenius Supabase connection initialized.");
