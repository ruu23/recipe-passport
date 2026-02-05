import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FFF8E7] p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-[#6B4423] mb-6">My Profile</h1>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#6B4423] mb-1">
                Email
              </label>
              <p className="text-gray-800">{user?.email}</p>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => router.push("/favorites")}
                className="bg-[#6B4423] text-white px-6 py-2 rounded hover:bg-[#8B5A2B]"
              >
                My Favorites
              </button>
              
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}