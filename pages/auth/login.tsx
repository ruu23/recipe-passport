import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from '@/lib/supabase/auth';

export default function LoginIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setLoading(true);

    try {
      const { data, error: signInError } = await signIn(
        formData.email,
        formData.password
      );

      if (signInError) {
        setError(signInError.message);
      } else {
        // Redirect to home after successful login
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
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
            <h1 className="title text-5xl md:text-6xl font-bold mb-2 tracking-wider">
              LOGIN
            </h1>
            <p className="subtitle text-sm mt-4 uppercase tracking-wide">
              Sign in to continue
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
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
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@realgreatsite.com"
                required
                className="w-full px-4 py-3 bg-white border-2 rounded focus:outline-none focus:border-[#6B4423] text-gray-800"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••"
                required
                className="w-full px-4 py-3 bg-white border-2 rounded focus:outline-none focus:border-[#6B4423] text-gray-800"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
              type="submit"
              disabled={loading}
              className="bg-cocoa text-white font-bold py-3 px-6 rounded hover:cursor-pointer uppercase tracking-wide"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            </div>
            
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-6">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-cocoa hover:cursor-pointer underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-cocoa">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="underline hover:cursor-pointer font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}