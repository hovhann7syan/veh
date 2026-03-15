"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "@/lib/auth/actions";

export default function LoginPage() {
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result   = await signIn(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
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
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">

          <h1 className="text-3xl font-bold uppercase tracking-tight mb-1">Sign In</h1>
          <p className="text-sm text-gray-400 mb-8">
            New here?{" "}
            <Link href="/register" className="text-black underline underline-offset-2">
              Create account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

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
                placeholder="••••••••"
                className="border border-gray-200 focus:border-black px-4 py-3 text-sm outline-none transition-colors bg-white placeholder:text-gray-300"
              />
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-[10px] text-gray-400 hover:text-black transition-colors uppercase tracking-widest">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* ОШИБКА */}
            {error && (
              <div className="bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
                {error === "Invalid login credentials"
                  ? "Wrong email or password. Try again."
                  : error}
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
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-100"/>
            <span className="text-[10px] uppercase tracking-widest text-gray-300">or</span>
            <div className="flex-1 h-px bg-gray-100"/>
          </div>

          {/* ПРОДОЛЖИТЬ КАК ГОСТЬ */}
          <Link
            href="/shop"
            className="block text-center border border-gray-200 py-4 text-xs uppercase font-bold tracking-widest hover:border-black transition-colors"
          >
            Continue as Guest
          </Link>

        </div>
      </div>

      {/* ФУТЕР */}
      <div className="text-center py-8 text-[10px] uppercase tracking-widest text-gray-300">
        © 2026 VEH. Yerevan, Armenia
      </div>

    </main>
  );
}