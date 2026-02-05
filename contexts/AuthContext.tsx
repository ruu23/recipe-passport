import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { getCurrentUser, onAuthStateChange } from '@/lib/supabase/auth';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    getCurrentUser().then(({ user }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: listener } = onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Redirect to login if user signs out
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    const { signOut } = await import('@/lib/supabase/auth');
    await signOut();
    setUser(null);
    router.push('/auth/login');
  };

  const value = {
    user,
    loading,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}