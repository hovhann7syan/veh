"use client";
import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

// ─── ТИПЫ ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM";    payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: { id: number; size: string } }
  | { type: "UPDATE_QTY";  payload: { id: number; size: string; quantity: number } }
  | { type: "CLEAR" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD";        payload: CartItem[] };

// ─── REDUCER ──────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {

    case "LOAD":
      return { ...state, items: action.payload };

    case "ADD_ITEM": {
      const exists = state.items.find(
        i => i.id === action.payload.id && i.size === action.payload.size
      );
      const items = exists
        ? state.items.map(i =>
            i.id === action.payload.id && i.size === action.payload.size
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { ...action.payload, quantity: 1 }];
      return { ...state, items, isOpen: true };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          i => !(i.id === action.payload.id && i.size === action.payload.size)
        ),
      };

    case "UPDATE_QTY":
      return {
        ...state,
        items: action.payload.quantity <= 0
          ? state.items.filter(
              i => !(i.id === action.payload.id && i.size === action.payload.size)
            )
          : state.items.map(i =>
              i.id === action.payload.id && i.size === action.payload.size
                ? { ...i, quantity: action.payload.quantity }
                : i
            ),
      };

    case "CLEAR":      return { ...state, items: [] };
    case "OPEN_CART":  return { ...state, isOpen: true };
    case "CLOSE_CART": return { ...state, isOpen: false };
    default:           return state;
  }
}

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
interface CartContextType {
  items:       CartItem[];
  isOpen:      boolean;
  totalItems:  number;
  totalPrice:  number;
  addItem:     (item: Omit<CartItem, "quantity">) => void;
  removeItem:  (id: number, size: string) => void;
  updateQty:   (id: number, size: string, quantity: number) => void;
  clear:       () => void;
  openCart:    () => void;
  closeCart:   () => void;
}

const CartContext = createContext<CartContextType | null>(null);

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Загружаем корзину из localStorage при старте
  useEffect(() => {
    try {
      const saved = localStorage.getItem("veh_cart");
      if (saved) dispatch({ type: "LOAD", payload: JSON.parse(saved) });
    } catch {}
  }, []);

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("veh_cart", JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items:      state.items,
      isOpen:     state.isOpen,
      totalItems,
      totalPrice,
      addItem:    (item) => dispatch({ type: "ADD_ITEM",    payload: item }),
      removeItem: (id, size) => dispatch({ type: "REMOVE_ITEM", payload: { id, size } }),
      updateQty:  (id, size, quantity) => dispatch({ type: "UPDATE_QTY", payload: { id, size, quantity } }),
      clear:      () => dispatch({ type: "CLEAR" }),
      openCart:   () => dispatch({ type: "OPEN_CART" }),
      closeCart:  () => dispatch({ type: "CLOSE_CART" }),
    }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
