"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, totalPrice } = useCart();

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white z-[70] shadow-2xl flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>

        {/* ШАПКА */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="font-bold uppercase tracking-tight text-lg">Bag</h2>
            {totalItems > 0 && (
              <span className="bg-black text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ТОВАРЫ */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (

            // ПУСТАЯ КОРЗИНА
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200 mb-4">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-6">Your bag is empty</p>
              <button
                onClick={closeCart}
                className="bg-black text-white px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>

          ) : (

            // СПИСОК ТОВАРОВ
            <ul className="divide-y divide-gray-50">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}`} className="flex gap-4 p-5">

                  {/* ФОТО PLACEHOLDER */}
                  <div className="w-20 h-24 bg-gray-100 shrink-0 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>

                  {/* ИНФО */}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold uppercase text-sm tracking-tight">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-gray-300 hover:text-black transition-colors p-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-400 uppercase tracking-widest">Size: {item.size}</p>
                    <p className="text-sm font-medium">${item.price.toFixed(2)}</p>

                    {/* КОЛИЧЕСТВО */}
                    <div className="flex items-center gap-0 mt-1 border border-gray-200 w-fit">
                      <button
                        onClick={() => updateQty(item.id, item.size, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500 text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.size, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500 text-lg leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>

                </li>
              ))}
            </ul>

          )}
        </div>

        {/* ИТОГО + CHECKOUT */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 flex flex-col gap-4">

            {/* SHIPPING NOTE */}
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                {totalPrice >= 100 ? "Free shipping on this order 🎉" : `Add $${(100 - totalPrice).toFixed(2)} more for free shipping`}
              </p>
            </div>

            {/* ИТОГО */}
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-gray-400">Total</span>
              <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
            </div>

            {/* КНОПКА */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="bg-black text-white py-4 text-center text-[11px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors"
            >
              Checkout
            </Link>

            <button
              onClick={closeCart}
              className="text-center text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              Continue Shopping
            </button>

          </div>
        )}

      </div>
    </>
  );
}
