import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * True only when real Supabase credentials are present.
 * When false, the store automatically falls back to local demo mode
 * so the app is fully functional without a database connection.
 */
export const isConfigured =
  supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 20;

if (!isConfigured) {
  console.warn(
    '[HindTrade] Supabase credentials missing or invalid. ' +
    'Running in DEMO MODE — data is stored in-memory only. ' +
    'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to connect to a real database.'
  );
}

// Always create the client (it will be a no-op client in demo mode)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
