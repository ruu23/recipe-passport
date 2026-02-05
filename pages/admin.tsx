import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import CountryManager from '@/components/admin/countryManager';
import RecipeManager from '@/components/admin/recipeManager';
import Loader from '@/components/layout/Loader';

type TabType = 'countries' | 'recipes';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('countries');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const checkAdminRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { supabase } = await import('@/lib/supabase/client');
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.role === 'admin');
        }
      } catch (err) {
        console.error('Error:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);
  

  if (loading) {
    return (
      <ProtectedRoute>
        <Loader />
      </ProtectedRoute>
    );
  }

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <div className="page-bg flex items-center justify-center">
          <div className="max-w-md text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-700 mb-6">
              You don't have permission to access the admin dashboard.
            </p>
            <button
              onClick={() => router.push('/home')}
              className="bg-[#6B4423] text-white px-6 py-3 rounded hover:bg-[#8B5A2B] transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="page-bg">
        {/* Header */}
        <div className="bg-card shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="title">
                  Admin Dashboard
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('countries')}
                className={`subtitle border-b-2 transition-colors hover:cursor-pointer ${
                  activeTab === 'countries'
                    ? 'border-[#6B4423] text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Countries
              </button>
              <button
                onClick={() => setActiveTab('recipes')}
                className={`subtitle border-b-2 transition-colors hover:cursor-pointer ${
                  activeTab === 'recipes'
                    ? 'border-[#6B4423] text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recipes
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'countries' ? <CountryManager /> : <RecipeManager />}
        </div>
      </div>
    </ProtectedRoute>
  );
}