"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  // Очищаем корзину после успешной оплаты
  useEffect(() => { clear(); }, []);

  return (
    <main className="min-h-screen bg-white text-black pt-16 flex flex-col items-center justify-center px-6 text-center">

      {/* ГАЛОЧКА */}
      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-8">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Order confirmed</p>
      <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-4">
        Thank you!
      </h1>
      <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-10">
        Your order has been placed. You'll receive a confirmation email shortly. Handcrafted in Yerevan — with love.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/account/orders"
          className="bg-black text-white px-10 py-4 text-[11px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors">
          Track My Order
        </Link>
        <Link href="/shop"
          className="border border-black px-10 py-4 text-[11px] uppercase font-bold tracking-widest hover:bg-gray-50 transition-colors">
          Continue Shopping
        </Link>
      </div>

      <p className="mt-12 text-[10px] uppercase tracking-widest text-gray-300">
        VEH · Yerevan, Armenia · Est. 2024
      </p>

    </main>
  );
}