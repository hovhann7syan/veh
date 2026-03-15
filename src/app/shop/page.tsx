"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  sizes: string[];
  tag: string | null;
  in_stock: boolean;
  images: string[];
  stock_count: number;
}

const CATEGORIES   = ["All", "T-Shirts", "Hoodies", "Outerwear", "Accessories"];
const SORT_OPTIONS = ["Newest", "Price: Low–High", "Price: High–Low"];

// ─── STOCK BADGE ──────────────────────────────────────────────────────────────
function StockBadge({ count }: { count: number }) {
  const total = 75;
  const pct   = Math.max(0, Math.min(100, (count / total) * 100));

  if (count === 0) return (
    <div className="mt-2 flex items-center gap-2">
      <span className="text-[9px] uppercase tracking-widest font-bold text-red-500">Sold Out</span>
    </div>
  );

  const label = count <= 5
    ? { text: `${count} left`, color: "text-red-500" }
    : count <= 20
    ? { text: `${count} left`, color: "text-orange-500" }
    : count <= 40
    ? { text: `${count} left`, color: "text-yellow-600" }
    : { text: `${count} left`, color: "text-gray-400" };

  const barColor = count <= 5 ? "bg-red-500" : count <= 20 ? "bg-orange-400" : count <= 40 ? "bg-yellow-500" : "bg-black";

  return (
    <div className="mt-2 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className={`text-[9px] uppercase tracking-widest font-bold ${label.color}`}>{label.text}</span>
        <span className="text-[9px] text-gray-300">{total} total</span>
      </div>
      <div className="w-full h-[2px] bg-gray-100 overflow-hidden">
        <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }}/>
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const [hovered,    setHovered]    = useState(false);
  const [added,      setAdded]      = useState(false);
  const [showSizes,  setShowSizes]  = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const shades = ["#e8e8e8","#e0e0e0","#ececec","#e4e4e4","#eaeaea","#dcdcdc"];
  const isSoldOut = product.stock_count === 0;

  // Проверяем есть ли в вишлисте
  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single();
      if (data) setWishlisted(true);
    }
    check();
  }, [product.id]);

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    setWishLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    if (wishlisted) {
      await supabase.from("wishlist").delete()
        .eq("user_id", user.id).eq("product_id", product.id);
      setWishlisted(false);
    } else {
      await supabase.from("wishlist").insert({ user_id: user.id, product_id: product.id });
      setWishlisted(true);
    }
    setWishLoading(false);
  }

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (isSoldOut) return;
    if (product.sizes.length === 1) {
      addItem({ id: product.id, name: product.name, price: product.price, size: product.sizes[0] });
      setAdded(true); setTimeout(() => setAdded(false), 1500);
    } else { setShowSizes(true); }
  }

  return (
    <div className={`group ${isSoldOut ? "opacity-60" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowSizes(false); }}>
      <div className="relative overflow-hidden" style={{ background: shades[index % shades.length] }}>
        <div className="w-full aspect-[3/4] flex items-end justify-start p-4 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <line x1="16" y1="0" x2="16" y2="32" stroke="#000" strokeWidth="1"/>
              <line x1="0" y1="16" x2="32" y2="16" stroke="#000" strokeWidth="1"/>
            </svg>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 z-10">Photo coming</span>
        </div>

        {/* WISHLIST BUTTON */}
        <button
          onClick={handleWishlist}
          disabled={wishLoading}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center z-10 transition-all duration-200 ${
            wishlisted
              ? "bg-black text-white opacity-100"
              : "bg-white/80 text-gray-400 hover:text-black opacity-0 group-hover:opacity-100"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill={wishlisted ? "white" : "none"}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>

        {/* TAG */}
        {product.tag && !isSoldOut && (
          <span className="absolute top-3 left-3 bg-black text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 z-10">
            {product.tag}
          </span>
        )}

        {/* SOLD OUT TAG */}
        {isSoldOut && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 z-10">
            Sold Out
          </span>
        )}

        {/* LOW STOCK TAG */}
        {!isSoldOut && product.stock_count <= 5 && (
          <span className="absolute bottom-12 left-3 bg-red-500 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 z-10 animate-pulse">
            Last {product.stock_count}!
          </span>
        )}

        {/* SIZE SELECTOR */}
        {showSizes && (
          <div className="absolute inset-0 bg-white/96 flex flex-col items-center justify-center gap-3 z-20 p-5">
            <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Select Size</p>
            <div className="grid grid-cols-3 gap-1.5 w-full">
              {product.sizes.map(s => (
                <button key={s}
                  onClick={(e) => {
                    e.preventDefault();
                    addItem({ id: product.id, name: product.name, price: product.price, size: s });
                    setShowSizes(false); setAdded(true); setTimeout(() => setAdded(false), 1500);
                  }}
                  className="border border-black text-[10px] uppercase font-bold py-2.5 hover:bg-black hover:text-white transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ADD TO BAG */}
        {!showSizes && !isSoldOut && (
          <div className={`absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center transition-transform duration-300 ${
            hovered ? "translate-y-0" : "translate-y-full"
          }`}>
            <button onClick={handleAdd} className="flex items-center gap-2 w-full justify-center">
              {added
                ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Added</>
                : <>+ Add to Bag</>}
            </button>
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="mt-3 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-tight">{product.name}</h3>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">{product.category}</p>
        </div>
        <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
      </div>

      {/* SIZES */}
      <div className="mt-1.5 flex gap-1 flex-wrap">
        {product.sizes.map(s => (
          <span key={s} className="text-[9px] uppercase tracking-wider text-gray-400 border border-gray-200 px-1.5 py-0.5">{s}</span>
        ))}
      </div>

      {/* STOCK BADGE */}
      <StockBadge count={product.stock_count ?? 75} />
    </div>
  );
}

// ─── SHOP PAGE ────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const [products,       setProducts]       = useState<Product[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy,         setSortBy]         = useState("Newest");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("in_stock", true);
      setProducts(data || []);
      setLoading(false);
    }
    load();
  }, []);

  let filtered = activeCategory === "All" ? products : products.filter(p => p.category === activeCategory);
  if (sortBy === "Price: Low–High") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "Price: High–Low") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <main className="min-h-screen bg-white text-black pt-16">

      {/* ШАПКА */}
      <div className="border-b border-black px-6 md:px-10 py-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">VEH / Shop</p>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-none">All Products</h1>
        </div>
        <span className="text-sm text-gray-400 font-mono">{filtered.length} items</span>
      </div>

      {/* ФИЛЬТРЫ */}
      <div className="border-b border-black sticky top-16 bg-white z-40">
        <div className="px-6 md:px-10 flex items-center justify-between h-12 gap-4">
          <div className="hidden md:flex items-center">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 h-12 text-[11px] uppercase tracking-widest font-bold border-r border-black transition-colors ${
                  activeCategory === cat ? "bg-black text-white" : "text-gray-500 hover:text-black"
                }`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex md:hidden items-center gap-3 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`text-[10px] uppercase tracking-widest font-bold whitespace-nowrap px-3 py-1 rounded-full border transition-colors ${
                  activeCategory === cat ? "bg-black text-white border-black" : "border-gray-300 text-gray-500"
                }`}>
                {cat}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="ml-auto text-[10px] uppercase tracking-widest font-bold bg-transparent border border-black px-3 py-1.5 cursor-pointer"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L4 4L7 1' stroke='black' stroke-width='1.5'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "calc(100% - 8px) center", paddingRight: "24px" }}>
            {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* СЕТКА */}
      <div className="px-6 md:px-10 py-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 w-full"/>
                <div className="mt-3 h-4 bg-gray-100 rounded w-3/4"/>
                <div className="mt-2 h-3 bg-gray-100 rounded w-1/4"/>
                <div className="mt-2 h-2 bg-gray-100 rounded w-full"/>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>

      {/* БАННЕР */}
      <div className="border-t border-black mt-10 px-6 md:px-10 py-16 bg-[#111] text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Free shipping</p>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">On orders over $100</h2>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Handcrafted in</p>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Yerevan, Armenia</h2>
        </div>
      </div>

    </main>
  );
}