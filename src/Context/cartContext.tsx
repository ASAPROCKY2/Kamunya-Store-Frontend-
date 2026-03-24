// src/context/CartContext.tsx
import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type TCartItem = {
  productID: number;
  name: string;
  sellingPrice: number;
  quantity: number;
  imageURL?: string;
};

type CartContextType = {
  cartItems: TCartItem[];
  addToCart: (item: TCartItem) => void;
  removeFromCart: (productID: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<TCartItem[]>([]);

  const addToCart = (item: TCartItem) => {
    setCartItems(prev => {
      const exists = prev.find(ci => ci.productID === item.productID);
      if (exists) {
        return prev.map(ci =>
          ci.productID === item.productID
            ? { ...ci, quantity: ci.quantity + item.quantity }
            : ci
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productID: number) => {
    setCartItems(prev => prev.filter(ci => ci.productID !== productID));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};