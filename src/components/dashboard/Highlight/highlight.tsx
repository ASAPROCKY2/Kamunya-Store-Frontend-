// src/components/dashboard/Home/Highlights.tsx

import React from "react";
import { Truck, Package, DollarSign, Smartphone } from "lucide-react";

const Highlights: React.FC = () => {
  const highlights = [
    {
      icon: <Truck size={32} />,
      title: "Fast Delivery",
      description: "Quick delivery within your area",
    },
    {
      icon: <DollarSign size={32} />,
      title: "Wholesale Prices",
      description: "Better prices when buying in bulk",
    },
    {
      icon: <Package size={32} />,
      title: "Always in Stock",
      description: "Wide range of products available",
    },
    {
      icon: <Smartphone size={32} />,
      title: "Easy Ordering",
      description: "Order easily from your phone",
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="text-green-600 mb-3">{item.icon}</div>

            <h3 className="font-semibold text-gray-800">{item.title}</h3>

            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Highlights;