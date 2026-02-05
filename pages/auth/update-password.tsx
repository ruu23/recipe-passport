import { useState } from 'react';
import { useRouter } from 'next/router';
import { updatePassword } from '@/lib/supabase/auth';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await updatePassword(formData.newPassword);

      if (updateError) {
        setError(updateError.message);
      } else {
        // Redirect to login after successful password update
        router.push('/auth/login?message=Password updated successfully');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-[#E8B44F] to-[#D4A439] h-16 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#6B4423] rounded-full"></div>
          <div className="w-2 h-2 bg-[#6B4423] rounded-full"></div>
          <div className="w-2 h-2 bg-[#6B4423] rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#6B4423] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              UPDATE PASSWORD
            </h1>
            <p className="text-sm text-[#6B4423] mt-4 uppercase tracking-wide">
              Enter your new password
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password Input */}
            <div>
              <label className="block text-xs font-semibold text-[#6B4423] mb-1 uppercase tracking-wide">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••"
                required
                className="w-full px-4 py-3 bg-white border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423] text-gray-800"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-xs font-semibold text-[#6B4423] mb-1 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••"
                required
                className="w-full px-4 py-3 bg-white border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423] text-gray-800"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6B4423] text-white font-bold py-3 px-6 rounded hover:bg-[#8B5A2B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}