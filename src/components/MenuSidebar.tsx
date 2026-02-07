"use client";
import { useState } from "react";
import Link from "next/link";
interface MenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuSidebar({ isOpen, onClose }: MenuSidebarProps) {
  // ЭМУЛЯЦИЯ: Представим, что это состояние входа. 
  // В будущем тут будет реальная проверка базы данных.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {/* 1. ЗАТЕМНЕНИЕ ФОНА (Overlay) */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* 2. САМО МЕНЮ (Выезжает справа) */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-8 md:p-12 relative">

          {/* КНОПКА ЗАКРЫТЬ */}
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
          </button>

          {/* --- ЛОГИКА МЕНЮ --- */}
          
          {/* ВАРИАНТ 1: ЮЗЕР НЕ АВТОРИЗОВАН (ГОСТЬ) */}
          {!isLoggedIn ? (
            <div className="mt-10 mb-10">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Account</h2>
              <p className="text-gray-500 text-sm mb-8">Sign in to sync your bag and track orders.</p>
              
              <div className="flex flex-col gap-4">
                <button className="bg-black text-white w-full py-4 uppercase font-bold text-xs tracking-widest hover:bg-gray-800 transition-colors">
                  Log In
                </button>
                <button className="border border-black text-black w-full py-4 uppercase font-bold text-xs tracking-widest hover:bg-gray-100 transition-colors">
                  Create Account
                </button>
              </div>
            </div>
          ) : (
            
            /* ВАРИАНТ 2: ЮЗЕР АВТОРИЗОВАН (КАБИНЕТ) */
            <div className="mt-10 mb-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg">
                    A
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Welcome back</p>
                    <h2 className="text-2xl font-bold">Armen</h2>
                 </div>
              </div>

              <nav className="flex flex-col gap-6 text-xl font-medium">
                <Link href="#" className="hover:text-gray-500 transition-colors flex justify-between group">
                  My Orders
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
                <Link href="#" className="hover:text-gray-500 transition-colors flex justify-between group">
                  Wishlist
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
                <Link href="#" className="hover:text-gray-500 transition-colors flex justify-between group">
                  Settings
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
                 <button onClick={() => setIsLoggedIn(false)} className="text-left text-red-500 text-sm font-bold uppercase tracking-widest mt-4">
                  Log Out
                </button>
              </nav>
            </div>
          )}

          <hr className="border-gray-100 my-2" />

          {/* ОБЩАЯ НАВИГАЦИЯ (ДЛЯ ВСЕХ) */}
          <nav className="flex flex-col gap-6 mt-8 text-3xl font-bold uppercase tracking-tight">
            <Link href="/shop" onClick={onClose} className="hover:text-gray-500 transition-colors">Shop</Link>
            <Link href="/archive" onClick={onClose} className="hover:text-gray-500 transition-colors">Archive</Link>
            <Link href="/about" onClick={onClose} className="hover:text-gray-500 transition-colors">About</Link>
          </nav>

          {/* НИЖНЯЯ ЧАСТЬ */}
          <div className="mt-auto pt-10 text-xs text-gray-400 flex flex-col gap-2">
            <a href="#">Help & Contact</a>
            <a href="#">Shipping & Returns</a>
            
            {/* ТЕСТОВАЯ КНОПКА (УДАЛИТЬ ПОТОМ) */}
            <button 
              onClick={() => setIsLoggedIn(!isLoggedIn)} 
              className="mt-6 text-blue-500 underline text-left"
            >
              [Dev: Switch Guest/User Mode]
            </button>
          </div>

        </div>
      </div>
    </>
  );
}