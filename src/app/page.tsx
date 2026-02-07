"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      
      <Navbar />

      {/* --- HERO SECTION --- */}
      {/* ВАЖНО: mt-16 (64px) — ровно под новый тонкий хедер */}
      <section className="mt-16 w-full flex flex-col md:flex-row border-b border-black">
        
        {/* ТЕКСТ */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-12 md:px-16 md:py-20 border-b md:border-b-0 md:border-r border-black">
          <h1 className="text-4xl md:text-7xl font-medium tracking-tight mb-4 leading-tight">
            Archive Drop
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Summer collection
          </p>
          <button className="bg-black text-white px-8 py-3 md:px-10 md:py-4 rounded-full w-fit uppercase font-bold text-xs tracking-widest hover:bg-gray-800 transition-colors">
            Shop Now
          </button>
        </div>

        {/* ФОТО */}
        <div className="w-full md:w-1/2 min-h-[400px] md:min-h-[600px] bg-gray-200 relative flex items-center justify-center">
           <span className="text-gray-500 font-mono uppercase">[ФОТО МОДЕЛИ]</span>
        </div>
      </section>

      {/* --- T-SHIRTS GRID --- */}
      <section className="w-full border-b border-black">
        <div className="grid grid-cols-1 md:grid-cols-4">
          
          <div className="border-b md:border-b-0 md:border-r border-black p-8 md:p-10 flex items-center justify-center md:justify-start">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">T-shirts</h2>
          </div>

          {/* ITEM 1 */}
          <div className="border-b md:border-b-0 md:border-r border-black p-6 flex flex-col gap-4 group hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="aspect-[4/5] bg-gray-100 w-full flex items-center justify-center text-gray-400 text-xs">[ФОТО 1]</div>
            <div className="flex justify-between items-end">
              <div><h3 className="font-bold uppercase text-sm">Motion Tee</h3><p className="text-xs text-gray-500">$37.00</p></div>
              <span className="text-[10px] uppercase border border-black px-2 py-1">Add</span>
            </div>
          </div>

          {/* ITEM 2 */}
          <div className="border-b md:border-b-0 md:border-r border-black p-6 flex flex-col gap-4 group hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="aspect-[4/5] bg-gray-100 w-full flex items-center justify-center text-gray-400 text-xs">[ФОТО 2]</div>
            <div className="flex justify-between items-end">
              <div><h3 className="font-bold uppercase text-sm">Beyond Tee</h3><p className="text-xs text-gray-500">$37.00</p></div>
              <span className="text-[10px] uppercase border border-black px-2 py-1">Add</span>
            </div>
          </div>

          {/* ITEM 3 */}
          <div className="p-6 flex flex-col gap-4 group hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="aspect-[4/5] bg-gray-100 w-full flex items-center justify-center text-gray-400 text-xs">[ФОТО 3]</div>
            <div className="flex justify-between items-end">
              <div><h3 className="font-bold uppercase text-sm">Essence Tee</h3><p className="text-xs text-gray-500">$37.00</p></div>
              <span className="text-[10px] uppercase border border-black px-2 py-1">Add</span>
            </div>
          </div>

        </div>
      </section>

      {/* --- HOODIES --- */}
      <section className="w-full flex flex-col md:flex-row border-b border-black">
        <div className="w-full md:w-1/2 p-10 md:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-black">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Hoodies</h2>
          <button className="bg-black text-white px-8 py-3 rounded-full w-fit text-xs uppercase font-bold tracking-widest hover:bg-gray-800">
            View All Products
          </button>
        </div>
        <div className="w-full md:w-1/2 min-h-[400px] md:min-h-[500px] bg-gray-200 relative flex items-center justify-center">
           <span className="text-gray-500 font-mono uppercase">[ФОТО ХУДИ]</span>
        </div>
      </section>

      {/* --- CRAFT --- */}
      <section className="w-full bg-[#111] text-white py-20 md:py-32 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-tight">Craft & Vision</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-sm leading-relaxed">
          We use only the finest natural materials and eco-friendly dyes.<br className="hidden md:block"/>Each of our prints is handcrafted in Yerevan.
        </p>
        <button className="bg-white text-black px-10 py-3 rounded-full text-xs font-bold uppercase hover:bg-gray-200 transition-colors">
          Read More
        </button>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-[#fdfdfd] text-black overflow-hidden">
        
        {/* SUBSCRIBE */}
        <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl md:text-3xl mb-6 font-normal tracking-tight">Subscribe to our newsletter</h3>
            <div className="flex w-full max-w-md border border-black rounded-full overflow-hidden p-1">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-400" 
              />
              <button className="bg-[#4a4a4a] text-white px-6 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors">
                Submit
              </button>
            </div>
            <p className="text-gray-500 text-[10px] md:text-xs mt-4">Be the first to know about new collections.</p>
        </div>

        {/* LOGO BLOCK */}
        <div className="w-full border-t border-b border-black overflow-hidden bg-white relative h-[18vh] md:h-[40vh] flex items-center">
          <Image 
            src="/logo.svg" 
            alt="VEH HUGE LOGO" 
            fill 
            className="object-cover scale-[1.15]" 
          />
        </div>

        {/* LINKS */}
        <div className="px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 bg-[#fdfdfd]">
          
          <div className="flex flex-col gap-3 text-sm">
            <span className="font-bold text-xs uppercase text-gray-400 mb-2">Quick links</span>
            <a href="#" className="hover:underline">Contact</a>
            <a href="#" className="hover:underline">Refund Policy</a>
            <a href="#" className="hover:underline">Shipping Policy</a>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <span className="font-bold text-xs uppercase text-gray-400 mb-2">Follow us</span>
            <a href="#" className="hover:underline">Instagram</a>
            <a href="#" className="hover:underline">Facebook</a>
          </div>

          <div className="hidden md:block"></div>

          <div className="flex flex-col gap-4 md:gap-6">
            <div>
              <span className="font-bold text-xs uppercase text-gray-400 mb-2 block">Language</span>
              <div className="border border-gray-300 px-4 py-2 w-full max-w-[200px] flex justify-between items-center text-sm">
                <span>English</span>
                <span className="text-[8px]">▼</span>
              </div>
            </div>
          </div>

        </div>

        <div className="px-6 pb-6 pt-0 flex justify-center md:justify-end items-center text-[10px] text-gray-500 font-bold uppercase">
           <span>Copyright © 2026 Veh. Yerevan, Armenia</span>
        </div>

      </footer>
      
    </main>
  );
}