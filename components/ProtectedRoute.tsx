import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E8B44F] border-t-[#6B4423] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#6B4423] font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing if no user (will redirect)
  if (!user) {
    return null;
  }

  return <>{children}</>;
}