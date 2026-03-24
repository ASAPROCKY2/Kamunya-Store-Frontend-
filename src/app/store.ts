// src/app/store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import { categoriesAPI } from "../features/Categories/categoriesApi"; // ✅ Categories API
import { promotionAPI } from "../features/Promotion/promotionsApi"; // ✅ Promotions API
import { productsAPI } from "../features/Products/productsAPi"; // ✅ Products API
import { salesAPI } from "../features/sales/salesAPi"; // ✅ Sales API
import { paymentsAPI } from "../features/Payments/paymentsApi"; // ✅ Payments API
import { deliveryAPI } from "../features/Delivery/deliveryAPi"; // ✅ Delivery API

// ⬇ Cart Slice
import cartReducer from "../app/cart/cartSlice";

/* =============================
   ASYNC STORAGE (PROMISE BASED)
============================= */
const asyncLocalStorage = {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) =>
    Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
};

/* =============================
   ROOT REDUCER
============================= */
const rootReducer = combineReducers({
  // RTK Query APIs
  [categoriesAPI.reducerPath]: categoriesAPI.reducer,
  [promotionAPI.reducerPath]: promotionAPI.reducer,
  [productsAPI.reducerPath]: productsAPI.reducer,
  [salesAPI.reducerPath]: salesAPI.reducer,
  [paymentsAPI.reducerPath]: paymentsAPI.reducer,
  [deliveryAPI.reducerPath]: deliveryAPI.reducer, // ✅ Added delivery API

  // Slices
  cart: cartReducer,
});

/* =============================
   PERSIST CONFIG
============================= */
const persistConfig = {
  key: "root",
  version: 1,
  storage: asyncLocalStorage,
  whitelist: ["cart"], // ✅ Persist cart only
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* =============================
   STORE
============================= */
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      categoriesAPI.middleware,
      promotionAPI.middleware,
      productsAPI.middleware,
      salesAPI.middleware,
      paymentsAPI.middleware,
      deliveryAPI.middleware // ✅ Added delivery middleware
    ),
});

/* =============================
   PERSISTOR
============================= */
export const persistedStore = persistStore(store);

/* =============================
   TYPES
============================= */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;