import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/supabase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg flex flex-col">
      {/* Header */}
      <div className="w-full bg-card h-16 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cocoa rounded-full"></div>
          <div className="w-2 h-2 bg-cocoa rounded-full"></div>
          <div className="w-2 h-2 bg-cocoa rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="title text-4xl md:text-5xl font-bold mb-2">
              FORGOT PASSWORD
            </h1>
            <p className="subtitle text-sm mt-4 uppercase tracking-wide">
              New Password
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Password reset email sent! Please check your inbox.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@realgreatsite.com"
                required
                className="w-full px-4 py-3 bg-white border-2 rounded focus:outline-none focus:border-[#6B4423] text-gray-800"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-cocoa text-white font-bold py-3 px-6 rounded cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <Link 
              href="/auth/login" 
              className="text-sm text-cocoa hover:cursor-pointer underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}