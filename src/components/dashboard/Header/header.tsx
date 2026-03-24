// src/components/Layout/Header.tsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import logo from "../../../assets/images/logo.png";
import { useGetActiveCategoriesQuery } from "../../../features/Categories/categoriesApi";
import { useFilterProductsQuery } from "../../../features/Products/productsAPi";
import { ShoppingCart, User, Search, Heart, Menu, X, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../Context/cartContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: catLoading } = useGetActiveCategoriesQuery();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const cartRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const { cartItems } = useCart();

  // Search products
  const { data: searchResults = [], isLoading: searchLoading } = useFilterProductsQuery(
    { name: search, isActive: true },
    { skip: !search }
  );

  // Filter categories
  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, categories]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cart subtotal
  const cartTotal = cartItems.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);

  // ✅ Corrected Checkout route to match App.tsx
  const handleCheckout = () => {
    navigate("/dashboard/cart");
  };

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm font-medium">
          🚚 Free shipping on orders over KES 5,000 | 🎉 New customers get 10% off
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between gap-4">
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* LOGO */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="Kamunya Store" className="h-12 md:h-14 object-contain" />
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8 relative">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              className="w-full px-5 py-3 pr-24 border border-gray-200 rounded-full focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm flex items-center gap-2">
              <Search size={18} />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* SEARCH DROPDOWN */}
            {search && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 text-gray-400 text-center">Loading...</div>
                ) : searchResults.length ? (
                  searchResults.map((prod) => (
                    <div
                      key={prod.productID}
                      className="p-3 hover:bg-orange-50 cursor-pointer flex items-center gap-3"
                      onClick={() => {
                        navigate(`/product/${prod.productID}`);
                        setSearch("");
                      }}
                    >
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded">
                        {prod.imageURL ? (
                          <img src={prod.imageURL} alt={prod.name} className="object-cover w-full h-full" />
                        ) : (
                          <Package size={20} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 text-sm text-gray-700">{prod.name}</div>
                      <div className="text-sm font-semibold text-orange-500">KSh {prod.sellingPrice}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-400 text-center text-sm">No products found</div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* MOBILE SEARCH */}
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
              <Search size={22} className="text-gray-700" />
            </button>

            {/* WISHLIST */}
            <button className="hidden md:flex p-2 hover:bg-gray-100 rounded-full relative">
              <Heart size={22} className="text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            </button>

            {/* CART */}
            <div ref={cartRef} className="relative">
              <button
                onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                className="p-2 hover:bg-gray-100 rounded-full relative"
              >
                <ShoppingCart size={22} className="text-gray-700" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              {cartDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-800">Shopping Cart ({cartItems.length})</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {cartItems.length === 0 ? (
                      <div className="p-8 text-center">
                        <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">Your cart is empty</p>
                      </div>
                    ) : (
                      cartItems.map(item => (
                        <div key={item.productID} className="p-4 border-b hover:bg-gray-50 flex gap-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            {item.imageURL ? <img src={item.imageURL} alt={item.name} className="w-full h-full object-contain" /> : <Package size={20} />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-orange-500 font-semibold">KES {item.sellingPrice * item.quantity}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {cartItems.length > 0 && (
                    <div className="p-4 bg-gray-50">
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-bold text-gray-800">KES {cartTotal.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium text-sm"
                      >
                        Checkout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="p-2 hover:bg-gray-100 rounded-full flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  J
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">John</span>
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100">
                  <div className="p-3 border-b bg-orange-50">
                    <p className="font-medium text-gray-800">John Doe</p>
                    <p className="text-xs text-gray-500">john@example.com</p>
                  </div>
                  <ul className="py-2">
                    {[{ icon: User, label: "My Profile" }, { icon: ShoppingCart, label: "My Orders" }, { icon: Heart, label: "Wishlist" }].map(
                      (item, index) => (
                        <li key={index}>
                          <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-orange-50 flex items-center gap-3">
                            <item.icon size={16} /> {item.label}
                          </button>
                        </li>
                      )
                    )}
                    <li className="border-t mt-2 pt-2">
                      <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                        <User size={16} /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY NAVBAR */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="hidden lg:flex items-center gap-1 py-2 overflow-x-auto">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
              onClick={() => navigate("/categories")}
            >
              All Categories
            </button>

            {catLoading ? (
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-20 h-8 bg-gray-200 animate-pulse rounded" />
                ))}
              </div>
            ) : (
              filteredCategories.map((category) => (
                <button
                  key={category.categoryID}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                  onClick={() => navigate(`/categories?name=${encodeURIComponent(category.name)}`)}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;