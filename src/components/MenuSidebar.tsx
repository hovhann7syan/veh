"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth/actions";

interface MenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuSidebar({ isOpen, onClose }: MenuSidebarProps) {
  const [user, setUser] = useState<{ fullName: string; email: string; initials: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Получаем текущего юзера
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || "VEH Member";
        const initials = fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
        setUser({ fullName, email: user.email || "", initials });
      } else {
        setUser(null);
      }
      setLoading(false);
    }

    getUser();

    // Слушаем изменения сессии — логин/логаут на любой странице
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const fullName = session.user.user_metadata?.full_name || "VEH Member";
        const initials = fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
        setUser({ fullName, email: session.user.email || "", initials });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* МЕНЮ */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-8 md:p-12 relative">

          {/* ЗАКРЫТЬ */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* ── ГОСТЬ ─────────────────────────────────────────────────────── */}
          {!loading && !user && (
            <div className="mt-10 mb-10">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Account</h2>
              <p className="text-gray-500 text-sm mb-8">Sign in to sync your bag and track orders.</p>
              <div className="flex flex-col gap-4">
                <Link href="/login" onClick={onClose}
                  className="bg-black text-white w-full py-4 uppercase font-bold text-xs tracking-widest hover:bg-gray-800 transition-colors text-center block">
                  Log In
                </Link>
                <Link href="/register" onClick={onClose}
                  className="border border-black text-black w-full py-4 uppercase font-bold text-xs tracking-widest hover:bg-gray-100 transition-colors text-center block">
                  Create Account
                </Link>
              </div>
            </div>
          )}

          {/* ── АВТОРИЗОВАН ───────────────────────────────────────────────── */}
          {!loading && user && (
            <div className="mt-10 mb-10">
              {/* ПРОФИЛЬ */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-base tracking-tight shrink-0">
                  {user.initials}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Welcome back</p>
                  <h2 className="text-xl font-bold tracking-tight">{user.fullName}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* ССЫЛКИ КАБИНЕТА */}
              <nav className="flex flex-col gap-5">
                <Link href="/account" onClick={onClose}
                  className="text-lg font-bold uppercase tracking-tight hover:text-gray-400 transition-colors flex justify-between group">
                  My Account
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
                <Link href="/account/orders" onClick={onClose}
                  className="text-lg font-bold uppercase tracking-tight hover:text-gray-400 transition-colors flex justify-between group">
                  My Orders
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
                <Link href="/account/wishlist" onClick={onClose}
                  className="text-lg font-bold uppercase tracking-tight hover:text-gray-400 transition-colors flex justify-between group">
                  Wishlist
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
                <Link href="/account/settings" onClick={onClose}
                  className="text-lg font-bold uppercase tracking-tight hover:text-gray-400 transition-colors flex justify-between group">
                  Settings
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>

                {/* SIGN OUT */}
                <form action={signOut}>
                  <button type="submit"
                    className="text-xs text-red-400 font-bold uppercase tracking-widest hover:text-red-600 transition-colors mt-2">
                    Sign Out
                  </button>
                </form>
              </nav>
            </div>
          )}

          {/* СКЕЛЕТОН пока грузится */}
          {loading && (
            <div className="mt-10 mb-10 animate-pulse">
              <div className="h-6 bg-gray-100 rounded w-1/2 mb-4"/>
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-8"/>
              <div className="h-12 bg-gray-100 rounded mb-3"/>
              <div className="h-12 bg-gray-100 rounded"/>
            </div>
          )}

          <hr className="border-gray-100 my-2" />

          {/* НАВИГАЦИЯ */}
          <nav className="flex flex-col gap-6 mt-8 text-3xl font-bold uppercase tracking-tight">
            <Link href="/shop" onClick={onClose} className="hover:text-gray-400 transition-colors">Shop</Link>
            <Link href="/archive" onClick={onClose} className="hover:text-gray-400 transition-colors">Archive</Link>
            <Link href="/about" onClick={onClose} className="hover:text-gray-400 transition-colors">About</Link>
            <Link href="/career" onClick={onClose} className="hover:text-gray-400 transition-colors">Career</Link>
          </nav>

          {/* НИЗ */}
          <div className="mt-auto pt-10 text-xs text-gray-400 flex flex-col gap-2">
            <a href="#" className="hover:text-black transition-colors">Help & Contact</a>
            <a href="#" className="hover:text-black transition-colors">Shipping & Returns</a>
          </div>

        </div>
      </div>
    </>
  );
}