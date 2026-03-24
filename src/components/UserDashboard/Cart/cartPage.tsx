// src/components/UserDashboard/CartPage.tsx
import React, { useState } from "react";
import { useCart } from "../../../Context/cartContext";
import { ShoppingCart, Trash2 } from "lucide-react";
import CreatePayments from "../Payments/createPayments";

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [saleID, setSaleID] = useState<number>(Date.now()); // Example saleID, replace with actual if needed

  const total = cartItems.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);

  if (showPayment) {
    return <CreatePayments saleID={saleID} amount={total} />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart /> My Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <li key={item.productID} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <img src={item.imageURL} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500">KSh {item.sellingPrice.toLocaleString()}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.productID)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-bold text-lg">Total: KSh {total.toLocaleString()}</span>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={clearCart}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Clear Cart
              </button>

              <button
                onClick={() => setShowPayment(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Buy All
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;