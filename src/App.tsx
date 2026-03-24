// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

/* =============================
   CONTEXTS
============================= */
import { CartProvider } from "./Context/cartContext";

/* =============================
   PUBLIC PAGES
============================= */
import LandingPage from "./Pages/LandingPage/Landingpage";
import Products from "./components/dashboard/Products/products";
import ProductCard from "./components/dashboard/Products/productsCard";
import Category from "./components/dashboard/Category/category";
import ShopProducts from "./components/UserDashboard/Quickshop/products";

/* =============================
   DASHBOARD PAGES
============================= */
import UserDashboard from "./components/UserDashboard/UserDashboard";
import CartPage from "./components/UserDashboard/Cart/cartPage";
import DeliveryMethod from "./components/UserDashboard/Delivery/deliverymethod"; // ✅ Updated component

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* ===== DEFAULT LANDING PAGE ===== */}
          <Route path="/" element={<LandingPage />} />

          {/* ===== PRODUCTS ===== */}
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductCard />} />

          {/* ===== CATEGORY ===== */}
          <Route path="/categories" element={<Category />} />

          {/* ===== DASHBOARD ===== */}
          <Route path="/dashboard" element={<UserDashboard />}>
            {/* Nested dashboard routes */}
            <Route path="shop" element={<ShopProducts />} />
            <Route path="cart" element={<CartPage />} />
            {/* Add more nested dashboard routes here */}
          </Route>

          {/* ===== CHECKOUT / DELIVERY ===== */}
          <Route path="/delivery-method" element={<DeliveryMethod />} />

          {/* ===== FALLBACK 404 PAGE ===== */}
          <Route
            path="*"
            element={
              <div className="p-6 text-center text-xl text-red-500">
                Page Not Found
              </div>
            }
          />
        </Routes>

        {/* ===== TOASTER NOTIFICATIONS ===== */}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              error: "bg-red-500 text-white",
              success: "bg-green-500 text-white",
              info: "bg-blue-500 text-white",
            },
          }}
        />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;