import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Header from "../dashboard/Header/header";
import Footer from "../dashboard/Footer/footer";
import UserDrawer from "./Aside/UserDrawer";
import DashboardPromotions from "./Promotions/promotion";
import PopularProducts from "./PopularProducts/popularProducts";

import { motion } from "framer-motion";
import {
  FaHeart,
  FaStar,
  FaTruck,
  FaClock,
  FaArrowRight,
  FaCreditCard,
  FaBoxOpen,
  FaCheckCircle,
  FaHourglassHalf
} from "react-icons/fa";

/* Dummy stats API simulation */
const statsData = {
  totalProducts: 120,
  totalOrders: 45,
  pendingDeliveries: 8,
  wishlistItems: 12,
  pendingPayments: 3,
  completedPayments: 38
};

const tips = [
  "Check your pending payments to avoid delivery delays",
  "Add items to wishlist for price drop notifications",
  "Track your orders in real-time",
  "Complete your payments to process orders faster",
  "Earn loyalty points on every purchase",
];

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // <--- get current path

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tipOfDay, setTipOfDay] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  /* RANDOM TIP */
  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTipOfDay(randomTip);
  }, []);

  /* UPDATE TIME */
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const greeting = (): string => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  /* FEATURE CARDS */
  const featureCards = [
    {
      id: "orders",
      icon: <FaBoxOpen className="text-2xl" />,
      title: "My Orders",
      value: statsData.totalOrders,
      subtitle: "Total orders",
      status: `${statsData.totalOrders} orders placed`,
      bgGradient: "from-blue-600 to-blue-400",
      lightBg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      hoverColor: "hover:bg-blue-600",
      link: "/dashboard/orders",
      details: [
        { label: "Completed", value: "32", icon: <FaCheckCircle className="text-green-500" /> },
        { label: "Processing", value: "13", icon: <FaHourglassHalf className="text-orange-500" /> }
      ]
    },
    {
      id: "wishlist",
      icon: <FaHeart className="text-2xl" />,
      title: "My Wishlist",
      value: statsData.wishlistItems,
      subtitle: "Saved items",
      status: `${statsData.wishlistItems} items saved`,
      bgGradient: "from-pink-600 to-pink-400",
      lightBg: "bg-pink-50",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      textColor: "text-pink-700",
      borderColor: "border-pink-200",
      hoverColor: "hover:bg-pink-600",
      link: "/dashboard/wishlist",
      details: [
        { label: "In stock", value: "8", icon: <FaCheckCircle className="text-green-500" /> },
        { label: "Price drops", value: "3", icon: <FaStar className="text-yellow-500" /> }
      ]
    },
    {
      id: "deliveries",
      icon: <FaTruck className="text-2xl" />,
      title: "Deliveries",
      value: statsData.pendingDeliveries,
      subtitle: "Pending deliveries",
      status: `${statsData.pendingDeliveries} items on the way`,
      bgGradient: "from-purple-600 to-purple-400",
      lightBg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      hoverColor: "hover:bg-purple-600",
      link: "/dashboard/deliveries",
      details: [
        { label: "Out for delivery", value: "3", icon: <FaTruck className="text-purple-500" /> },
        { label: "Processing", value: "5", icon: <FaClock className="text-orange-500" /> }
      ]
    },
    {
      id: "payments",
      icon: <FaCreditCard className="text-2xl" />,
      title: "Payments",
      value: statsData.pendingPayments,
      subtitle: "Pending payments",
      status: `${statsData.pendingPayments} payments pending`,
      bgGradient: "from-green-600 to-green-400",
      lightBg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      hoverColor: "hover:bg-green-600",
      link: "/dashboard/payments",
      details: [
        { label: "Completed", value: statsData.completedPayments, icon: <FaCheckCircle className="text-green-500" /> },
        { label: "Pending", value: statsData.pendingPayments, icon: <FaClock className="text-orange-500" /> }
      ]
    }
  ];

  // ✅ Determine if we are on the default dashboard or a nested route
  const isDefaultDashboard = location.pathname === "/dashboard";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 shadow-xl`}
        >
          <UserDrawer />
        </aside>

        {drawerOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 transition-all duration-300 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            {/* Nested routes like /dashboard/cart will render here */}
            <Outlet />

            {/* Only render default dashboard content on /dashboard */}
            {isDefaultDashboard && (
              <>
                {/* Welcome Banner */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 text-white p-5 rounded-2xl shadow-2xl relative overflow-hidden"
                  style={{ backgroundColor: "rgb(33, 38, 56)" }}
                >
                  <div className="relative z-10">
                    <h1 className="text-xl lg:text-2xl font-bold mb-1">
                      {greeting()}, Shopper
                    </h1>
                    <p className="text-gray-300 text-xs lg:text-sm mb-2">
                      Welcome to Kamunya Store
                    </p>
                    <div className="flex items-center gap-2 text-xs bg-white/10 px-2 py-1.5 rounded-lg w-fit">
                      <FaStar className="text-yellow-400 flex-shrink-0" size={12} />
                      <span className="truncate max-w-[200px]">
                        Tip: {tipOfDay}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-6 -mb-6"></div>
                </motion.div>

                {/* Promotions */}
                <div className="mb-4">
                  <DashboardPromotions />
                </div>

                {/* Popular Products */}
                <div className="mb-6">
                  <PopularProducts initialDisplayCount={4} itemsPerPage={8} />
                </div>

                {/* Feature Cards */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[rgb(33,38,56)] rounded-full"></span>
                    Dashboard Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {featureCards.map((card, idx) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        onClick={() => navigate(card.link)}
                        className={`${card.lightBg} border ${card.borderColor} rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 group`}
                      >
                        <div className={`h-2 bg-gradient-to-r ${card.bgGradient}`}></div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className={`${card.iconBg} p-2.5 rounded-xl`}>
                              <div className={card.iconColor}>{card.icon}</div>
                            </div>
                            <div className="text-right">
                              <span className={`text-2xl font-bold ${card.textColor}`}>{card.value}</span>
                              <p className="text-xs text-gray-500">{card.subtitle}</p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <h3 className="font-bold text-gray-800 text-base">{card.title}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${card.bgGradient}`}></span>
                              {card.status}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                            {card.details.map((detail, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <span className="text-gray-400 text-xs">{detail.icon}</span>
                                <div>
                                  <p className="text-xs text-gray-500">{detail.label}</p>
                                  <p className="text-sm font-semibold text-gray-800">{detail.value}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center justify-end text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className={`${card.textColor} flex items-center gap-1`}>
                              View details
                              <FaArrowRight size={10} />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      Recent Activity
                    </h3>
                    <button 
                      onClick={() => navigate("/dashboard/activity")}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      View all
                      <FaArrowRight size={8} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50">
                      <span className="text-gray-600">Order #12345</span>
                      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Delivered</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50">
                      <span className="text-gray-600">Payment for #12346</span>
                      <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Pending</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1.5">
                      <span className="text-gray-600">New item in wishlist</span>
                      <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">In stock</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserDashboard;