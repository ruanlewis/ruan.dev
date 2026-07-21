import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xdwbdkotxwzmumyjvpwa.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkd2Jka290eHd6bXVteWp2cHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0Nzk1NDIsImV4cCI6MjEwMDA1NTU0Mn0.D92zKFXaG_fQafCgk9tFdi12oHJT82xJ1hcWoj1Bh4Y";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
