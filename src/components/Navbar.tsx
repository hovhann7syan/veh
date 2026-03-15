"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MenuSidebar from "./MenuSidebar";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [isMenuOpen,    setIsMenuOpen]    = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    async function loadWishlist() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { count } = await supabase
        .from("wishlist")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setWishlistCount(count || 0);
    }
    loadWishlist();
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadWishlist();
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex justify-between items-center px-4 md:px-8 h-16 transition-all">

        {/* ЛОГОТИП */}
        <Link href="/" className="hover:opacity-70 transition-opacity">
          <Image
            src="/logo.svg"
            alt="VEH"
            width={120}
            height={40}
            className="h-16 md:h-20 w-auto object-contain"
            priority
          />
        </Link>

        {/* ИКОНКИ */}
        <div className="flex items-center gap-5 md:gap-6">

          {/* Поиск */}
          <button className="hover:opacity-60 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          {/* Вишлист */}
          <Link href="/account/wishlist" className="hover:opacity-60 transition-opacity relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Корзина */}
          <button onClick={openCart} className="hover:opacity-60 transition-opacity relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Бургер */}
          <button onClick={() => setIsMenuOpen(true)} className="hover:opacity-60 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

        </div>
      </nav>

      <MenuSidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}