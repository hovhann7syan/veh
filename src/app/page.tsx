"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  sizes: string[];
  tag: string | null;
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────
function Marquee({ dark = false }: { dark?: boolean }) {
  const items = ["SILENT", "PRIDE", "MINIMAL", "MOTION", "PRECISION", "PRESENCE", "PHILOSOPHY", "UNDERGROUND", "LIMITED"];
  return (
    <div className={`w-full overflow-hidden border-y ${dark ? "border-white/10 bg-white text-black" : "border-black bg-black text-white"} py-3`}>
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 28s linear infinite" }}>
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className={`text-[10px] uppercase tracking-[0.4em] font-bold mx-6 ${dark ? "opacity-30" : "opacity-60"}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const [added,     setAdded]     = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const bgs = ["#EAEAEA", "#E5E5E5", "#EFEFEF", "#E8E8E8"];

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (product.sizes.length === 1) {
      addItem({ id: product.id, name: product.name, price: product.price, size: product.sizes[0] });
      setAdded(true); setTimeout(() => setAdded(false), 1500);
    } else { setShowSizes(true); }
  }

  return (
    <Link href={`/shop/${product.id}`} className="group flex flex-col">
      <div className="relative overflow-hidden" style={{ background: bgs[index % bgs.length] }}>
        <div className="aspect-[3/4] flex items-center justify-center relative overflow-hidden">
          <span className="absolute font-black uppercase text-black/[0.04] select-none leading-none"
            style={{ fontSize: "clamp(60px, 12vw, 110px)" }}>
            {product.name.split(" ")[0]}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-black/30 z-10">
            Photo coming
          </span>
        </div>

        {product.tag && (
          <span className="absolute top-3 left-3 bg-black text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 z-10">
            {product.tag}
          </span>
        )}

        {showSizes && (
          <div className="absolute inset-0 bg-white/96 flex flex-col items-center justify-center gap-3 z-20 p-5"
            onClick={e => e.preventDefault()}>
            <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Select Size</p>
            <div className="grid grid-cols-3 gap-1.5 w-full">
              {product.sizes.map(s => (
                <button key={s}
                  onClick={e => { e.preventDefault(); addItem({ id: product.id, name: product.name, price: product.price, size: s }); setShowSizes(false); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
                  className="border border-black text-[10px] uppercase font-bold py-2.5 hover:bg-black hover:text-white transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {!showSizes && (
          <div className={`absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center transition-transform duration-300 ${
            added ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"
          }`}>
            <button onClick={handleAdd} className="flex items-center gap-2 w-full justify-center">
              {added
                ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Added</>
                : <>+ Add to Bag</>}
            </button>
          </div>
        )}
      </div>

      <div className="pt-3 flex justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-tight">{product.name}</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{product.category}</p>
        </div>
        <span className="text-[11px] font-bold">${product.price}</span>
      </div>
    </Link>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded,   setLoaded]   = useState(false);

  useEffect(() => {
    createClient().from("products").select("id,name,category,price,sizes,tag").eq("in_stock", true).limit(4)
      .then(({ data }) => { setProducts(data || []); setLoaded(true); });
  }, []);

  return (
    <main className="bg-white text-black selection:bg-black selection:text-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="pt-16 min-h-screen flex flex-col border-b border-black">

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-5 md:px-10 h-10 border-b border-gray-100">
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-300">SS26 — Archive Drop</span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-300">Yerevan · 40°N 44°E</span>
        </div>

        {/* MAIN GRID */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-[85vh]">

          {/* LEFT — TEXT */}
          <div className="flex flex-col justify-between px-5 md:px-12 py-12 border-b md:border-b-0 md:border-r border-black order-2 md:order-1">
            <div>
              {/* LABEL */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-1.5 bg-black rounded-full"/>
                <span className="text-[9px] uppercase tracking-[0.4em] text-gray-400">Philosophy Worn on Fabric</span>
              </div>

              {/* HEADLINE */}
              <h1 className="font-black uppercase leading-[0.85] tracking-tighter mb-10"
                style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}>
                SILENT<br/>
                <span style={{ WebkitTextStroke: "2px #000", color: "transparent" }}>PRIDE</span><br/>
                WEAR
              </h1>

              {/* DESC */}
              <p className="text-[13px] text-gray-400 max-w-xs leading-relaxed mb-10 tracking-wide">
                Minimal streetwear born in Armenia.<br/>
                For those who understand.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-4">
              <Link href="/shop"
                className="bg-black text-white px-10 py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-gray-900 transition-colors w-fit">
                Explore Collection
              </Link>
              <div className="flex items-center gap-6 mt-2">
                {["Limited Drops", "Handcrafted", "Yerevan Made"].map((t, i) => (
                  <span key={i} className="text-[9px] uppercase tracking-widest text-gray-300 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-gray-300 rounded-full inline-block"/>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — VISUAL */}
          <div className="relative bg-[#0D0D0D] flex flex-col justify-between overflow-hidden min-h-[60vw] md:min-h-0 order-1 md:order-2">
            {/* BIG VEH */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-black uppercase text-white/[0.03] select-none leading-none tracking-tighter"
                style={{ fontSize: "clamp(10rem, 28vw, 26rem)" }}>
                VEH
              </span>
            </div>

            {/* CORNER LABELS */}
            <div className="relative z-10 p-6 flex justify-between">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">Underground Energy</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">SS26</span>
            </div>

            {/* CENTER CROSS */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-px h-20 bg-white/10 absolute"/>
              <div className="h-px w-20 bg-white/10 absolute"/>
            </div>

            <div className="relative z-10 p-6 flex justify-between items-end">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">Photo coming soon</span>
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">Armenian Spirit</p>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/10">Not Armenian Folklore</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────────────────── */}
      <Marquee />

      {/* ── NEW ARRIVALS ──────────────────────────────────────────────────── */}
      <section className="px-5 md:px-10 py-16 md:py-24 border-b border-black">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-gray-300 mb-2">New In</p>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Latest Drops</h2>
          </div>
          <Link href="/shop"
            className="hidden md:flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold hover:opacity-40 transition-opacity">
            All Products <span>→</span>
          </Link>
        </div>

        {!loaded ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100"/>
                <div className="mt-3 h-3 bg-gray-100 rounded w-3/4"/>
                <div className="mt-1.5 h-3 bg-gray-100 rounded w-1/3"/>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}

        <div className="flex justify-center mt-10 md:hidden">
          <Link href="/shop"
            className="border border-black px-10 py-3.5 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-black hover:text-white transition-colors">
            View All
          </Link>
        </div>
      </section>

      {/* ── STATEMENT ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] text-white px-5 md:px-10 py-20 md:py-32 border-b border-black">
        <div className="max-w-4xl">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 mb-8">VEH Philosophy</p>
          <h2 className="font-black uppercase leading-[0.88] tracking-tighter mb-12"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}>
            NOT FOR<br/>
            <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.3)", color: "transparent" }}>EVERYONE.</span><br/>
            FOR THE FEW<br/>
            WHO GET IT.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/10">
            {[
              { word: "SILENT", desc: "Confidence doesn't need to shout. VEH speaks through form, not noise." },
              { word: "PRECISE", desc: "Every detail is intentional. Every cut is considered. Nothing is accidental." },
              { word: "LIMITED", desc: "We never restock. Each drop is final. Scarcity is by design, not strategy." },
            ].map(item => (
              <div key={item.word}>
                <h3 className="text-base font-black uppercase tracking-widest mb-3 text-white/80">{item.word}</h3>
                <p className="text-sm text-white/30 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPLIT ─────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-black">
        {/* DARK */}
        <div className="border-b md:border-b-0 md:border-r border-black px-8 md:px-14 py-16 md:py-24 flex flex-col justify-between min-h-[360px] bg-[#0D0D0D] text-white">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/25">Limited — 30 made</span>
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">
              DRIFT<br/>HOODIE
            </h2>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed mb-8">
              Enzyme washed. Each ages differently. Yours is unique.
            </p>
            <Link href="/shop/7"
              className="inline-block border border-white/30 text-white px-8 py-3.5 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-white hover:text-black transition-colors">
              $95 — Get Yours
            </Link>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-white/15">3 left</span>
        </div>

        {/* LIGHT */}
        <div className="px-8 md:px-14 py-16 md:py-24 flex flex-col justify-between min-h-[360px] bg-[#F5F5F5]">
          <span className="text-[9px] uppercase tracking-[0.4em] text-gray-300">Yerevan Series</span>
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">
              YEREVAN<br/>TEE
            </h2>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed mb-8">
              Old city map, screen printed on organic cotton. Armenian spirit, minimal form.
            </p>
            <Link href="/shop/5"
              className="inline-block bg-black text-white px-8 py-3.5 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-gray-800 transition-colors">
              $40 — Shop Now
            </Link>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-gray-200">Limited quantity</span>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-10 py-16 md:py-20 border-b border-black">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mb-3">Stay underground</p>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Drop alerts.<br/>
              <span className="text-gray-300">No noise.</span>
            </h2>
          </div>
          <div className="flex border border-black max-w-sm w-full">
            <input type="email" placeholder="your@email.com"
              className="flex-1 px-5 py-4 text-sm outline-none placeholder:text-gray-300 bg-white"/>
            <button className="bg-black text-white px-6 py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-gray-900 transition-colors whitespace-nowrap">
              Join
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer>
        {/* BIG LOGO */}
        <div className="w-full overflow-hidden bg-white border-b border-black relative h-[18vh] md:h-[30vh]">
          <Image src="/logo.svg" alt="VEH" fill className="object-cover scale-110" />
        </div>

        {/* LINKS */}
        <div className="px-5 md:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-100">
          {[
            { t: "Shop",    l: [["All Products","/shop"],["T-Shirts","/shop"],["Hoodies","/shop"],["Accessories","/shop"]] },
            { t: "Brand",   l: [["About VEH","/about"],["Philosophy","#"],["Contact","#"],["Returns","#"]] },
            { t: "Follow",  l: [["Instagram","#"],["Facebook","#"]] },
            { t: "Account", l: [["Sign In","/login"],["Register","/register"],["My Orders","/account/orders"]] },
          ].map(col => (
            <div key={col.t} className="flex flex-col gap-2.5">
              <span className="text-[9px] uppercase tracking-[0.35em] font-bold text-gray-300 mb-1">{col.t}</span>
              {col.l.map(([label, href]) => (
                <Link key={label} href={href} className="text-sm text-gray-600 hover:text-black transition-colors">{label}</Link>
              ))}
            </div>
          ))}
        </div>

        <div className="px-5 md:px-10 py-5 flex flex-col md:flex-row justify-between gap-1">
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-300">© 2026 VEH — Silent Streetwear</span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-300">Yerevan, Armenia · 40°11′N 44°30′E</span>
        </div>
      </footer>

    </main>
  );
}