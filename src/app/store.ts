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

// =============================
// ASYNC STORAGE (PROMISE-BASED)
// =============================
const asyncLocalStorage = {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) =>
    Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
};

// =============================
// ROOT REDUCER
// =============================
const rootReducer = combineReducers({
  // Add your slices here later
});

// =============================
// PERSIST CONFIG
// =============================
const persistConfig = {
  key: "root",
  version: 1,
  storage: asyncLocalStorage,
  whitelist: [], // Add slice keys here to persist them
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// =============================
// STORE
// =============================
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// =============================
// PERSISTOR
// =============================
export const persistedStore = persistStore(store);

// =============================
// TYPES
// =============================
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;