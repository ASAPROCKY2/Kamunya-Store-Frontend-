import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  productID: number;
  name: string;
  price: number;
  quantity: number;
  imageURL?: string;
  stockQuantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(item => item.productID === action.payload.productID);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + action.payload.quantity, existing.stockQuantity);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.productID !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ productID: number; quantity: number }>) => {
      const item = state.items.find(i => i.productID === action.payload.productID);
      if (item) {
        item.quantity = Math.min(action.payload.quantity, item.stockQuantity);
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;