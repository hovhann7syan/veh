"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MenuSidebar from "./MenuSidebar"; 

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* h-16 (64px) — это эталон тонкого хедера */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex justify-between items-center px-4 md:px-8 h-16 transition-all">
        
        {/* ЛОГОТИП (Аккуратный) */}
        <Link href="/" className="hover:opacity-70 transition-opacity">
          <Image 
            src="/logo.svg" 
            alt="VEH" 
            width={120} 
            height={40} 
            className="h-16 md:h-20 w-auto object-contain" // h-6 (24px) на мобайле, h-8 (32px) на ПК
            priority 
          />
        </Link>

        {/* ПРАВАЯ ЧАСТЬ (ИКОНКИ ТОНЬШЕ) */}
        <div className="flex items-center gap-5 md:gap-6">
          
          {/* Поиск */}
          <button className="hover:opacity-60 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* Сумка */}
          <button className="hover:opacity-60 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 01-8 0"></path>
            </svg>
          </button>

          {/* Бургер */}
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="hover:opacity-60 transition-opacity"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
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