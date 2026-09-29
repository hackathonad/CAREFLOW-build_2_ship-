import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

let supabaseClient: SupabaseClient | null = null;

if (config.hasSupabase) {
  try {
    const key = config.supabaseServiceKey || config.supabaseAnonKey;
    supabaseClient = createClient(config.supabaseUrl, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('✅ Supabase client initialized with endpoint:', config.supabaseUrl);
  } catch (error) {
    console.warn('⚠️ Supabase client initialization failed, fallback active:', error);
  }
} else {
  console.log('ℹ️ Running in synthetic store mode. To connect Supabase, configure SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env');
}

export const getSupabase = (): SupabaseClient | null => supabaseClient;
