// src/components/UserDashboard/Delivery/deliverymethod.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Truck, MapPin, Clock, CheckCircle } from "lucide-react";

// Layout Components
import Header from "../../dashboard/Header/header";
import Footer from "../../dashboard/Footer/footer";
import UserDrawer from "../Aside/UserDrawer";

const DeliveryMethod: React.FC = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"pickup" | "delivery" | null>(null);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleConfirm = () => {
    if (!selectedMethod) return;

    if (selectedMethod === "pickup") {
      navigate("/payment");
    } else {
      navigate("/delivery-form");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar Drawer */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 shadow-2xl`}
        >
          <UserDrawer />
        </aside>
        
        {/* Overlay for mobile */}
        {drawerOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
            onClick={() => setDrawerOpen(false)} 
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-3 lg:p-6 w-full transition-all duration-300">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
                <Package className="w-8 h-8 text-orange-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Choose Delivery Method
              </h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Select how you'd like to receive your order
              </p>
            </div>

            {/* Delivery Options Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Pickup Option */}
              <button
                onClick={() => setSelectedMethod("pickup")}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedMethod === "pickup"
                    ? "border-orange-500 bg-orange-50 shadow-lg scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md hover:scale-[1.01]"
                }`}
              >
                {selectedMethod === "pickup" && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="text-orange-500" size={24} />
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${
                    selectedMethod === "pickup" 
                      ? "bg-orange-100" 
                      : "bg-gray-100 group-hover:bg-orange-50"
                  }`}>
                    <MapPin size={28} className={
                      selectedMethod === "pickup" 
                        ? "text-orange-500" 
                        : "text-gray-600 group-hover:text-orange-500"
                    } />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Pickup at Store
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Collect your order from our physical store location
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-green-600">
                        <Clock size={14} />
                        <span>Ready in 1-2 hours</span>
                      </div>
                      <div className="text-orange-600 font-medium">
                        Free pickup
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Delivery Option */}
              <button
                onClick={() => setSelectedMethod("delivery")}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedMethod === "delivery"
                    ? "border-orange-500 bg-orange-50 shadow-lg scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md hover:scale-[1.01]"
                }`}
              >
                {selectedMethod === "delivery" && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="text-orange-500" size={24} />
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${
                    selectedMethod === "delivery" 
                      ? "bg-orange-100" 
                      : "bg-gray-100 group-hover:bg-orange-50"
                  }`}>
                    <Truck size={28} className={
                      selectedMethod === "delivery" 
                        ? "text-orange-500" 
                        : "text-gray-600 group-hover:text-orange-500"
                    } />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Home Delivery
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Get your order delivered to your doorstep
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-blue-600">
                        <Clock size={14} />
                        <span>2-3 business days</span>
                      </div>
                      <div className="text-gray-500">
                        Calculated at checkout
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center max-w-md mx-auto gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedMethod}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedMethod
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>

            {/* Help Text */}
            <p className="text-center text-sm text-gray-500 mt-8">
              Need help? Contact our support team for assistance
            </p>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default DeliveryMethod;