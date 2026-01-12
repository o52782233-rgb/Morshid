import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'editor' | 'admin' | 'staff';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('⚠️ Profile not found, attempting to create...');
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { error: insertError } = await supabase.from('profiles').insert([
              {
                id: user.id,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || null,
                role: 'user'
              }
            ]);
            if (!insertError) {
              console.log('✅ Profile created, retrying fetch...');
              // Retry fetching after insert
              const { data: newData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
              if (newData) {
                console.log('✅ Profile fetched after creation:', newData);
                setProfile(newData);
              }
            } else {
              console.error('❌ Error creating profile:', insertError);
      }
          }
        }
      } else if (data) {
        console.log('✅ Profile fetched successfully:', data);
        console.log('📋 Role:', data.role);
        setProfile(data);
      }
    } catch (error) {
      console.error('❌ Exception fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      setLoading(true);
      await fetchProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: 'user'
        }
      ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Note: Depending on RLS policies, the user might not be able to insert their own profile without a trigger.
        // But usually for public registration with 'authenticated' role it might be allowed if configured.
        // Best practice is a Trigger, but we'll try client-side insert for now as we can't easily add triggers without SQL access 
        // (though I can provide SQL for the user to run).
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}