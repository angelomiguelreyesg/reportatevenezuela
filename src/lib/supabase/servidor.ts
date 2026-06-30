import { createClient } from "@supabase/supabase-js";

const urlSupabase = process.env.SUPABASE_URL!;
const claveServicio = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(urlSupabase, claveServicio, {
  auth: {
    persistSession: false,
  },
});
