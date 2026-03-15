"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  sizes: string[];
  tag: string | null;
  stock_count: number;
}

interface WishlistItem {
  id: number;
  product_id: number;
  products: Product;
}

function WishlistCard({ item, onRemove }: { item: WishlistItem; onRemove: (id: number) => void }) {
  const { addItem } = useCart();
  const [showSizes, setShowSizes] = useState(false);
  const [added,     setAdded]     = useState(false);
  const product = item.products;

function handleAdd(e: React.MouseEvent) {
  e.preventDefault();
  if (product.sizes.length === 1) {
    addItem({ id: product.id, name: product.name, price: product.price, size: product.sizes[0] });
    setAdded(true);
    setTimeout(() => { setAdded(false); openCart(); }, 600);
  } else { setShowSizes(true); }
}

  return (
    <div className="group relative border border-gray-100 hover:border-black transition-colors">

      {/* ФОТО */}
      <Link href={`/shop/${product.id}`}>
        <div className="relative aspect-[3/4] bg-[#EBEBEB] flex items-center justify-center overflow-hidden">
          <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Photo coming</span>

          {product.tag && (
            <span className="absolute top-3 left-3 bg-black text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1">
              {product.tag}
            </span>
          )}

          {/* REMOVE */}
          <button
            onClick={(e) => { e.preventDefault(); onRemove(item.id); }}
            className="absolute top-3 right-3 w-7 h-7 bg-white border border-gray-200 hover:border-black flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* SIZE SELECT */}
          {showSizes && (
            <div className="absolute inset-0 bg-white/96 flex flex-col items-center justify-center gap-3 z-20 p-5"
              onClick={e => e.preventDefault()}>
              <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Select Size</p>
              <div className="grid grid-cols-3 gap-1.5 w-full">
                {product.sizes.map(s => (
                  <button key={s}
                    onClick={e => {
                      e.preventDefault();
                      addItem({ id: product.id, name: product.name, price: product.price, size: s });
                      setShowSizes(false); setAdded(true); setTimeout(() => setAdded(false), 1500);
                    }}
                    className="border border-black text-[10px] uppercase font-bold py-2 hover:bg-black hover:text-white transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ADD TO BAG */}
          {!showSizes && (
            <div className={`absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center transition-transform duration-300 ${
              "translate-y-full group-hover:translate-y-0"
            }`}>
              <button onClick={handleAdd} className="flex items-center gap-2 w-full justify-center">
                {added
                  ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Added</>
                  : <>+ Add to Bag</>}
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* INFO */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xs font-bold uppercase tracking-tight">{product.name}</h3>
          <span className="text-xs font-bold">${product.price}</span>
        </div>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{product.category}</p>

        {/* STOCK */}
        {product.stock_count <= 10 && product.stock_count > 0 && (
          <p className="text-[9px] uppercase tracking-widest text-red-500 font-bold">
            Only {product.stock_count} left!
          </p>
        )}
        {product.stock_count === 0 && (
          <p className="text-[9px] uppercase tracking-widest text-gray-300 font-bold">Sold Out</p>
        )}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const [items,   setItems]   = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId,  setUserId]  = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("wishlist")
        .select("id, product_id, products(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setItems((data as any) || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleRemove(wishlistId: number) {
    const supabase = createClient();
    await supabase.from("wishlist").delete().eq("id", wishlistId);
    setItems(prev => prev.filter(i => i.id !== wishlistId));
  }

  return (
    <main className="min-h-screen bg-white text-black pt-16">

      {/* ШАПКА */}
      <div className="border-b border-black px-6 md:px-12 py-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/account"
            className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-1 mb-3">
            ← Back to Account
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">VEH / Account</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none">Wishlist</h1>
        </div>
        {items.length > 0 && (
          <span className="text-sm text-gray-400 font-mono">{items.length} saved</span>
        )}
      </div>

      <div className="px-6 md:px-12 py-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100"/>
                <div className="mt-3 h-3 bg-gray-100 rounded w-3/4"/>
                <div className="mt-2 h-3 bg-gray-100 rounded w-1/3"/>
              </div>
            ))}
          </div>
        ) : !userId ? (
          /* НЕ АВТОРИЗОВАН */
          <div className="border border-dashed border-gray-200 py-24 flex flex-col items-center justify-center text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200 mb-4">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <p className="text-xs text-gray-300 uppercase tracking-widest mb-6">Sign in to save items</p>
            <Link href="/login"
              className="bg-black text-white px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors">
              Sign In
            </Link>
          </div>
        ) : items.length === 0 ? (
          /* ПУСТОЙ */
          <div className="border border-dashed border-gray-200 py-24 flex flex-col items-center justify-center text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200 mb-4">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <p className="text-xs text-gray-300 uppercase tracking-widest mb-6">Nothing saved yet</p>
            <Link href="/shop"
              className="bg-black text-white px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors">
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {items.map(item => (
              <WishlistCard key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>

    </main>
  );
}