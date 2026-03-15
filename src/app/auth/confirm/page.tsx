import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; error?: string; error_description?: string }>;
}) {
  const params = await searchParams;

  // Ошибка от Supabase
  if (params.error) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-12 h-12 border-2 border-red-500 rounded-full flex items-center justify-center mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Verification Failed</p>
        <h1 className="text-2xl font-black uppercase tracking-tight mb-3">Link Expired</h1>
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-8">
          This confirmation link has expired or already been used. Please register again.
        </p>
        <Link href="/register"
          className="bg-black text-white px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors">
          Register Again
        </Link>
      </main>
    );
  }

  // Подтверждаем токен
  if (params.token_hash && params.type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: params.token_hash,
      type: params.type as any,
    });

    if (error) {
      return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
          <div className="w-12 h-12 border-2 border-red-500 rounded-full flex items-center justify-center mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Error</p>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-3">Something went wrong</h1>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-8">{error.message}</p>
          <Link href="/register"
            className="bg-black text-white px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors">
            Try Again
          </Link>
        </main>
      );
    }

    // Успех — редирект на account
    redirect("/account");
  }

  // SUCCESS страница (если уже авторизован)
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mb-8">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Welcome to VEH</p>
      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
        Email Confirmed
      </h1>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-10">
        Your account is now active. You're part of VEH — for those who understand.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/account"
          className="bg-black text-white px-10 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors">
          My Account
        </Link>
        <Link href="/shop"
          className="border border-black px-10 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-black hover:text-white transition-colors">
          Start Shopping
        </Link>
      </div>

      <p className="mt-10 text-[9px] uppercase tracking-widest text-gray-200">
        VEH · Silent Streetwear · Yerevan, Armenia
      </p>
    </main>
  );
}