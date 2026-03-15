"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signUp } from "@/lib/auth/actions";

export default function RegisterPage() {
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const pass     = formData.get('password') as string;
    const confirm  = formData.get('confirmPassword') as string;

    if (pass !== confirm) {
      setError("Passwords don't match.");
      setLoading(false);
      return;
    }

    if (pass.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold uppercase tracking-tight mb-2">Check your email</h1>
        <p className="text-sm text-gray-400 max-w-xs">
          We sent a confirmation link to your email. Click it to activate your VEH account.
        </p>
        <Link href="/login" className="mt-8 text-[10px] uppercase tracking-widest font-bold border-b border-black pb-0.5 hover:opacity-60 transition-opacity">
          Back to Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black flex flex-col">

      {/* ЛОГО */}
      <div className="flex justify-center pt-10 pb-4">
        <Link href="/">
          <Image src="/logo.svg" alt="VEH" width={80} height={28} className="h-8 w-auto" />
        </Link>
      </div>

      {/* ФОРМА */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">

          <h1 className="text-3xl font-bold uppercase tracking-tight mb-1">Create Account</h1>
          <p className="text-sm text-gray-400 mb-8">
            Already have one?{" "}
            <Link href="/login" className="text-black underline underline-offset-2">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* ИМЯ */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                required
                placeholder="Armen Petrosyan"
                className="border border-gray-200 focus:border-black px-4 py-3 text-sm outline-none transition-colors bg-white placeholder:text-gray-300"
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="border border-gray-200 focus:border-black px-4 py-3 text-sm outline-none transition-colors bg-white placeholder:text-gray-300"
              />
            </div>

            {/* ПАРОЛЬ */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="Min. 8 characters"
                className="border border-gray-200 focus:border-black px-4 py-3 text-sm outline-none transition-colors bg-white placeholder:text-gray-300"
              />
            </div>

            {/* ПОДТВЕРЖДЕНИЕ */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                className="border border-gray-200 focus:border-black px-4 py-3 text-sm outline-none transition-colors bg-white placeholder:text-gray-300"
              />
            </div>

            {/* ОШИБКА */}
            {error && (
              <div className="bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
                {error}
              </div>
            )}

            {/* КНОПКА */}
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white py-4 uppercase font-bold text-xs tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating...
                </span>
              ) : "Create Account"}
            </button>

            <p className="text-[10px] text-gray-300 text-center leading-relaxed">
              By creating an account you agree to our{" "}
              <Link href="#" className="underline">Terms</Link> and{" "}
              <Link href="#" className="underline">Privacy Policy</Link>.
            </p>

          </form>
        </div>
      </div>

      <div className="text-center py-8 text-[10px] uppercase tracking-widest text-gray-300">
        © 2026 VEH. Yerevan, Armenia
      </div>

    </main>
  );
}