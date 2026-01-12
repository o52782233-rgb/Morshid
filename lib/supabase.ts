import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey } from '../../utils/supabase/info';

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'user' | 'editor' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'user' | 'editor' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'user' | 'editor' | 'admin';
          created_at?: string;
        };
      };
    };
  };
};
