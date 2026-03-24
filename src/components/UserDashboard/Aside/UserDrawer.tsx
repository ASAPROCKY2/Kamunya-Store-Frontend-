// src/dashboard/UserDashboard/aside/UserDrawer.tsx
import { Link, useLocation } from "react-router-dom";
import { userDrawerData, type DrawerItem } from "./drawerData";
import { useCart } from "../../../Context/cartContext"; 
const UserDrawer = () => {
  const location = useLocation();
  const { cartItems } = useCart(); // ✅ Get cart items
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="h-full w-64 bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold tracking-wide">User Dashboard</h2>
      </div>

      {/* Navigation */}
      <ul className="flex-1 py-2">
        {userDrawerData.map((item: DrawerItem) => {
          const isActive = item.link && location.pathname.startsWith(item.link);

          return (
            <li key={item.id} className="relative">
              <Link
                to={item.link ?? "#"}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gray-800 border-l-4 border-blue-500 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white hover:border-l-4 hover:border-blue-500"
                }`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>

                {/* ✅ Show cart count badge */}
                {item.id === "cart" && cartCount > 0 && (
                  <span className="ml-auto bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-400 text-center">
        © 2026 Kamunya Store
      </div>
    </aside>
  );
};

export default UserDrawer;