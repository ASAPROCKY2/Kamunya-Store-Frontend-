// src/components/Header.tsx
import React, { useState, useEffect } from "react";

interface User {
  name: string;
  avatar?: string;
}

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    // Fetch logged-in user info (replace with your API)
    fetch("/api/user")
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));

    // Fetch cart items (replace with your API)
    fetch("/api/cart")
      .then(res => res.json())
      .then(data => setCartItems(data))
      .catch(() => setCartItems([]));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect or call search API
    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 md:px-8">
      {/* Logo */}
      <div className="flex-1">
        <a className="btn btn-ghost text-xl font-bold">Kamunya Store</a>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden md:flex">
        <input
          type="text"
          placeholder="Search for products..."
          className="input input-bordered w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary ml-2">
          Search
        </button>
      </form>

      {/* Right-side Icons */}
      <div className="flex gap-2 items-center">
        {/* Wishlist */}
        <a href="/wishlist" className="btn btn-ghost btn-circle">
          <span className="material-icons">favorite</span>
        </a>

        {/* Saved Items */}
        <a href="/saved" className="btn btn-ghost btn-circle">
          <span className="material-icons">bookmark</span>
        </a>

        {/* Cart */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <span className="material-icons">shopping_cart</span>
              {cartCount > 0 && (
                <span className="badge badge-sm indicator-item">{cartCount}</span>
              )}
            </div>
          </label>
          <div
            tabIndex={0}
            className="dropdown-content z-10 mt-3 w-64 bg-base-100 rounded-box shadow-lg p-4"
          >
            <h3 className="font-bold mb-2">Cart Summary</h3>
            {cartItems.length === 0 ? (
              <p>No products in the cart.</p>
            ) : (
              <ul className="space-y-2">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.id}</span>
                    <span>
                      {item.quantity} × KES {item.price}
                    </span>
                  </li>
                ))}
                <li className="font-bold border-t pt-2 flex justify-between">
                  <span>Total:</span>
                  <span>KES {cartTotal}</span>
                </li>
              </ul>
            )}
            <a href="/cart" className="btn btn-primary btn-block mt-3">
              View Cart
            </a>
          </div>
        </div>

        {/* User / Account */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                src={
                  user?.avatar ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt="User Avatar"
              />
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            <li>
              <span className="font-semibold">Welcome, {user?.name || "Guest"}</span>
            </li>
            {user ? (
              <>
                <li>
                  <a href="/profile">Profile</a>
                </li>
                <li>
                  <a href="/orders">Orders</a>
                </li>
                <li>
                  <a href="/logout">Logout</a>
                </li>
              </>
            ) : (
              <li>
                <a href="/login">Login / Sign Up</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;