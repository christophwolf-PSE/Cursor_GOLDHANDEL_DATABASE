// Wrapper around existing supabase client (no side effects)
import { supabase } from '../../supabase.js';

export function getSupabaseClient() {
    return supabase;
}
