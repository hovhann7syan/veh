"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const shipping = totalPrice >= 100 ? 0 : 10;
  const total    = totalPrice + shipping;

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const res = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ items, userId: user?.id || null }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (totalItems === 0) {
    return (
      <main className="min-h-screen bg-white pt-16 flex flex-col items-center justify-center px-6 text-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200 mb-6">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <h1 className="text-2xl font-bold uppercase tracking-tight mb-2">Your bag is empty</h1>
        <p className="text-sm text-gray-400 mb-8">Add some items before checking out</p>
        <Link href="/shop" className="bg-black text-white px-10 py-4 text-[11px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors">
          Go to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black pt-16">

      <div className="border-b border-black px-6 md:px-12 py-8">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">VEH / Checkout</p>
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">Order Summary</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* ТОВАРЫ */}
        <div className="border-b md:border-b-0 md:border-r border-black px-6 md:px-12 py-10">
          <h2 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-gray-400">
            Items ({totalItems})
          </h2>
          <ul className="flex flex-col divide-y divide-gray-100">
            {items.map(item => (
              <li key={`${item.id}-${item.size}`} className="flex items-center gap-4 py-5">
                <div className="w-16 h-20 bg-gray-100 shrink-0 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold uppercase text-sm tracking-tight">{item.name}</h3>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">
                    Size: {item.size} · Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <Link href="/shop" className="inline-block mt-6 text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            ← Continue Shopping
          </Link>
        </div>

        {/* ОПЛАТА */}
        <div className="px-6 md:px-12 py-10 flex flex-col">
          <h2 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-gray-400">Payment</h2>

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shipping</span>
              <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-[10px] text-gray-300 uppercase tracking-wider">
                Add ${(100 - totalPrice).toFixed(2)} more for free shipping
              </p>
            )}
            <hr className="border-gray-100 my-1"/>
            <div className="flex justify-between">
              <span className="font-bold uppercase text-sm tracking-tight">Total</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-black text-white py-5 text-[11px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Redirecting to payment...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Pay with Card — ${total.toFixed(2)}
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 mt-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <p className="text-[10px] text-gray-300 uppercase tracking-widest">
              Secured by Stripe · SSL Encrypted
            </p>
          </div>

          <hr className="border-gray-100 my-8"/>

          <div className="flex flex-col gap-3 text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <span className="uppercase tracking-widest">Ships from Yerevan, Armenia</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
              </svg>
              <span className="uppercase tracking-widest">Free returns within 14 days</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}