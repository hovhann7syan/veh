import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";
import Link from "next/link";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const fullName   = user.user_metadata?.full_name || "VEH Member";
  const initials   = fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <main className="min-h-screen bg-white text-black pt-16">

      {/* ── ШАПКА ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-black px-6 md:px-12 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-5">
          {/* АВАТАР */}
          <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold tracking-tight shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">
              Member since {memberSince}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight leading-none">
              {fullName}
            </h1>
            <p className="text-sm text-gray-400 mt-1">{user.email}</p>
          </div>
        </div>

        {/* SIGN OUT */}
        <form action={signOut}>
          <button
            type="submit"
            className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-black transition-colors border border-gray-200 hover:border-black px-5 py-2.5"
          >
            Sign Out
          </button>
        </form>

      </div>

      {/* ── КАРТОЧКИ ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-black">

        {/* ЗАКАЗЫ */}
        <Link href="/account/orders" className="group border-b md:border-b-0 md:border-r border-black p-8 md:p-10 flex flex-col gap-6 hover:bg-gray-50 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <div>
            <h2 className="font-bold uppercase tracking-tight text-base mb-1">My Orders</h2>
            <p className="text-xs text-gray-400 leading-relaxed">Track and manage your purchases</p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gray-300 group-hover:text-black transition-colors mt-auto">
            View all →
          </span>
        </Link>

        {/* ВИШЛИСТ */}
        <Link href="/account/wishlist" className="group border-b md:border-b-0 md:border-r border-black p-8 md:p-10 flex flex-col gap-6 hover:bg-gray-50 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          <div>
            <h2 className="font-bold uppercase tracking-tight text-base mb-1">Wishlist</h2>
            <p className="text-xs text-gray-400 leading-relaxed">Items you've saved for later</p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gray-300 group-hover:text-black transition-colors mt-auto">
            View saved →
          </span>
        </Link>

        {/* НАСТРОЙКИ */}
        <Link href="/account/settings" className="group p-8 md:p-10 flex flex-col gap-6 hover:bg-gray-50 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          <div>
            <h2 className="font-bold uppercase tracking-tight text-base mb-1">Settings</h2>
            <p className="text-xs text-gray-400 leading-relaxed">Profile, addresses, preferences</p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gray-300 group-hover:text-black transition-colors mt-auto">
            Edit →
          </span>
        </Link>

      </div>

      {/* ── ПОСЛЕДНИЕ ЗАКАЗЫ ──────────────────────────────────────────────── */}
      <div className="px-6 md:px-12 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs uppercase tracking-widest font-bold">Recent Orders</h2>
          <Link href="/account/orders" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            View all →
          </Link>
        </div>

        {/* ПУСТОЙ СТЕЙТ */}
        <div className="border border-dashed border-gray-200 py-20 flex flex-col items-center justify-center text-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200 mb-4">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p className="text-xs text-gray-300 uppercase tracking-widest mb-6">No orders yet</p>
          <Link
            href="/shop"
            className="bg-black text-white px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>

      {/* ── НИЖНИЙ БАННЕР ─────────────────────────────────────────────────── */}
      <div className="border-t border-black mx-6 md:mx-12 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-widest text-gray-300">VEH Worldwide</p>
        <p className="text-[10px] uppercase tracking-widest text-gray-300">Yerevan, Armenia · Est. 2024</p>
      </div>

    </main>
  );
}