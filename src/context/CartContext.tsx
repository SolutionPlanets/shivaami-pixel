"use client";

import { createContext, useContext, useReducer } from "react";
import type { ProductColor } from "@/lib/products";

export interface CartItem {
  productSlug: string;
  productName: string;
  color: ProductColor;
  quantity: number;
  unitPriceInr: number;
  accentBg: string;
  badge: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  updateColor: (slug: string, color: ProductColor) => void;
  clearCart: () => void;
  totalQuantity: number;
  totalRetailInr: number;
}

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; slug: string }
  | { type: "UPDATE_QTY"; slug: string; quantity: number }
  | { type: "UPDATE_COLOR"; slug: string; color: ProductColor }
  | { type: "CLEAR" };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find(
        (i) => i.productSlug === action.item.productSlug
      );
      if (existing) {
        return state.map((i) =>
          i.productSlug === action.item.productSlug
            ? { ...i, quantity: i.quantity + action.item.quantity }
            : i
        );
      }
      return [...state, action.item];
    }
    case "REMOVE_ITEM":
      return state.filter((i) => i.productSlug !== action.slug);
    case "UPDATE_QTY":
      if (action.quantity < 1)
        return state.filter((i) => i.productSlug !== action.slug);
      return state.map((i) =>
        i.productSlug === action.slug ? { ...i, quantity: action.quantity } : i
      );
    case "UPDATE_COLOR":
      return state.map((i) =>
        i.productSlug === action.slug ? { ...i, color: action.color } : i
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
  const totalRetailInr = items.reduce(
    (s, i) => s + i.unitPriceInr * i.quantity,
    0
  );

  const value: CartContextValue = {
    items,
    totalQuantity,
    totalRetailInr,
    addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
    removeItem: (slug) => dispatch({ type: "REMOVE_ITEM", slug }),
    updateQuantity: (slug, quantity) =>
      dispatch({ type: "UPDATE_QTY", slug, quantity }),
    updateColor: (slug, color) =>
      dispatch({ type: "UPDATE_COLOR", slug, color }),
    clearCart: () => dispatch({ type: "CLEAR" }),
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
