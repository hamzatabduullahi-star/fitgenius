/* =========================================
   FITGENIUS — SUPABASE CONNECTION
========================================= */

const SUPABASE_URL = "https://ozdltishoxofahpqllna.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_TXLAcHOPJIn8JsahTmfupw_ZYBk5V6p";

if (!window.supabase) {
    console.error("Supabase library has not been loaded.");
} else {
    window.fitgeniusSupabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

    console.log("FitGenius Supabase connected successfully.");
}
