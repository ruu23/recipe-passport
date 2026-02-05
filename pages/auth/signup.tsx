import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signUp } from "@/lib/supabase/auth";
import { supabase } from "@/lib/supabase/client";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const sendWelcomeEmail = async (email: string, name?: string) => {
    // fire-and-forget (we don't block signup on email delivery)
    try {
      await fetch("/api/welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
    } catch {
      // silent: signup should still succeed even if email fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.dateOfBirth
      );

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // ✅ get the signed up user email safely
      const signedEmail =
        data?.user?.email ||
        (await supabase.auth.getUser()).data.user?.email ||
        formData.email;

      // ✅ send welcome email
      if (signedEmail) {
        void sendWelcomeEmail(signedEmail, formData.fullName);
      }

      // Redirect to login or home after successful signup
      router.push("/auth/login");
    } catch (err: any) {
      setError(err?.message || "An error occurred during signup");
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
            <h1
              className="text-4xl md:text-5xl font-bold text-[#6B4423] mb-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              BE PART OF OUR
            </h1>
            <h1
              className="text-4xl md:text-5xl font-bold text-[#6B4423] flex items-center justify-center gap-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              FAMILY <span className="text-5xl">❤️</span>
            </h1>
            <p className="text-sm text-[#6B4423] mt-4 uppercase tracking-wide">
              Already registered?{" "}
              <Link href="/auth/login" className="underline hover:text-[#8B5A2B]">
                Login
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-[#6B4423] mb-1 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Sara Martins"
                required
                className="w-full px-4 py-3 bg-white border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423] text-gray-800"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-[#6B4423] mb-1 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@sarasmasterclass.com"
                required
                className="w-full px-4 py-3 bg-white border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423] text-gray-800"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-[#6B4423] mb-1 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••"
                required
                className="w-full px-4 py-3 bg-white border-2 border-[#D4A439] rounded focus:outline-none focus:border-[#6B4423] text-gray-800"
              />
            </div>

            {/* Date of Birth Input */}
            <div>
              <label className="block text-xs font-semibold text-[#6B4423] mb-1 uppercase tracking-wide">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
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
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
