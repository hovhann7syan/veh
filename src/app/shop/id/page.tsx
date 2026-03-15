"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  sizes: string[];
  tag: string | null;
  in_stock: boolean;
  images: string[];
}

// ─── PLACEHOLDER ФОТО ─────────────────────────────────────────────────────────
function PhotoPlaceholder() {
  return (
    <div className="w-full aspect-[3/4] bg-[#e8e8e8] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <line x1="40" y1="0" x2="40" y2="80" stroke="#000" strokeWidth="1"/>
          <line x1="0" y1="40" x2="80" y2="40" stroke="#000" strokeWidth="1"/>
        </svg>
      </div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
        Photo coming soon
      </span>
    </div>
  );
}

// ─── СКЕЛЕТОН ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <main className="min-h-screen bg-white pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-64px)]">
        <div className="animate-pulse bg-gray-100 aspect-[3/4] md:aspect-auto"/>
        <div className="p-8 md:p-16 flex flex-col gap-6 animate-pulse">
          <div className="h-3 bg-gray-100 rounded w-1/4"/>
          <div className="h-10 bg-gray-100 rounded w-3/4"/>
          <div className="h-6 bg-gray-100 rounded w-1/4"/>
          <div className="h-20 bg-gray-100 rounded w-full"/>
        </div>
      </div>
    </main>
  );
}

// ─── ГЛАВНЫЙ КОМПОНЕНТ ────────────────────────────────────────────────────────
export default function ProductPage() {
  const params   = useParams();
  const router   = useRouter();
  const { addItem, openCart } = useCart();

  const [product,      setProduct]      = useState<Product | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError,    setSizeError]    = useState(false);
  const [added,        setAdded]        = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        router.push("/shop");
        return;
      }

      setProduct(data);
      // Если только один размер — выбираем автоматически
      if (data.sizes.length === 1) setSelectedSize(data.sizes[0]);
      setLoading(false);
    }
    load();
  }, [params.id]);

  function handleAddToBag() {
    if (!product) return;
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem({ id: product.id, name: product.name, price: product.price, size: selectedSize });
    setAdded(true);
    setTimeout(() => { setAdded(false); openCart(); }, 600);
  }

  if (loading) return <Skeleton />;
  if (!product) return null;

  return (
    <main className="min-h-screen bg-white text-black pt-16">

      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="px-6 md:px-10 py-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-100">
        <Link href="/" className="hover:text-black transition-colors">VEH</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-black">{product.name}</span>
      </div>

      {/* ОСНОВНАЯ СЕТКА */}
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* ── ФОТО ──────────────────────────────────────────────────────── */}
        <div className="border-b md:border-b-0 md:border-r border-black">
          <PhotoPlaceholder />
        </div>

        {/* ── ИНФО ──────────────────────────────────────────────────────── */}
        <div className="px-6 md:px-12 py-10 md:py-16 flex flex-col">

          {/* КАТЕГОРИЯ + ТЕГ */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              {product.category}
            </span>
            {product.tag && (
              <span className="bg-black text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1">
                {product.tag}
              </span>
            )}
          </div>

          {/* НАЗВАНИЕ */}
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-none mb-4">
            {product.name}
          </h1>

          {/* ЦЕНА */}
          <p className="text-2xl font-medium mb-8">
            ${product.price.toFixed(2)}
          </p>

          {/* ОПИСАНИЕ */}
          <p className="text-sm text-gray-500 leading-relaxed mb-10 max-w-sm">
            {product.description}
          </p>

          <hr className="border-gray-100 mb-8"/>

          {/* ВЫБОР РАЗМЕРА */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Size
                {selectedSize && (
                  <span className="ml-2 text-gray-400 normal-case font-normal">— {selectedSize}</span>
                )}
              </span>
              <button className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors underline underline-offset-2">
                Size Guide
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  className={`py-3 text-[11px] uppercase font-bold tracking-wider border transition-colors ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "border-gray-200 hover:border-black text-gray-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {sizeError && (
              <p className="text-xs text-red-500 mt-2 uppercase tracking-wider">
                Please select a size
              </p>
            )}
          </div>

          {/* КНОПКА ADD TO BAG */}
          <button
            onClick={handleAddToBag}
            className={`w-full py-4 text-[11px] uppercase font-bold tracking-widest transition-all duration-300 mb-3 ${
              added
                ? "bg-gray-800 text-white"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {added ? (
              <span className="flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Added to Bag
              </span>
            ) : "Add to Bag"}
          </button>

          {/* КНОПКА CHECKOUT СРАЗУ */}
          <Link
            href="/checkout"
            onClick={handleAddToBag}
            className="w-full py-4 text-[11px] uppercase font-bold tracking-widest border border-black hover:bg-gray-50 transition-colors text-center block"
          >
            Buy Now
          </Link>

          <hr className="border-gray-100 my-8"/>

          {/* ДЕТАЛИ */}
          <div className="flex flex-col gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <span className="uppercase tracking-widest">Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
              </svg>
              <span className="uppercase tracking-widest">Free returns within 14 days</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className="uppercase tracking-widest">Handcrafted in Yerevan, Armenia</span>
            </div>
          </div>

        </div>
      </div>

      {/* ПОХОЖИЕ ТОВАРЫ */}
      <RelatedProducts category={product.category} currentId={product.id} />

    </main>
  );
}

// ─── ПОХОЖИЕ ТОВАРЫ ───────────────────────────────────────────────────────────
function RelatedProducts({ category, currentId }: { category: string; currentId: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .neq("id", currentId)
        .limit(3);
      setProducts(data || []);
    }
    load();
  }, [category, currentId]);

  if (products.length === 0) return null;

  return (
    <section className="border-t border-black px-6 md:px-10 py-12">
      <h2 className="text-xs uppercase tracking-widest font-bold mb-8">You may also like</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {products.map((p, i) => (
          <Link key={p.id} href={`/shop/${p.id}`} className="group">
            <div className="relative overflow-hidden">
              <div className="w-full aspect-[3/4] bg-[#e8e8e8] flex items-center justify-center">
                <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Photo coming</span>
              </div>
            </div>
            <div className="mt-3 flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-tight group-hover:opacity-60 transition-opacity">{p.name}</h3>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">{p.category}</p>
              </div>
              <span className="text-sm font-medium">${p.price.toFixed(2)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}