// src/components/dashboard/Home/AboutKamunyaStore.tsx

import React from "react";
import { MapPin, Phone, Store, User, Clock, Mail, Package, Award } from "lucide-react";
import storeImage from "../../../assets/images/kamunya-store.jpg";

const AboutKamunyaStore: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-orange-500">Kamunya Store</span>
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Your trusted local shop serving Ngaremara and beyond with quality products and exceptional service.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* =============================
              STORE IMAGE (LEFT SIDE)
          ============================= */}
          <div className="relative group order-2 lg:order-1">
            {/* Decorative elements */}
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            
            {/* Image container */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={storeImage}
                alt="Kamunya Store - Ngaremara"
                className="w-full h-[500px] object-cover transform group-hover:scale-110 transition duration-700"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              {/* Store badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                <p className="text-orange-500 font-bold text-lg">Est. 2020</p>
              </div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-100 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-pink-100 rounded-full blur-2xl"></div>
          </div>

          {/* =============================
              STORE DETAILS (RIGHT SIDE)
          ============================= */}
          <div className="space-y-6 order-1 lg:order-2">
            
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 rounded-xl border border-orange-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Award className="text-orange-500" size={24} />
                Welcome to Your Neighborhood Store
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Kamunya Store is more than just a shop – we're a part of the Ngaremara community. 
                Founded with a vision to provide quality products at affordable prices, we've grown 
                to become a trusted name in Isiolo County.
              </p>
            </div>

            {/* Main Description */}
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                We specialize in both wholesale and retail distribution of essential household items. 
                From sugar, cooking oil, and flour to a wide range of everyday products, we ensure 
                our shelves are always stocked with quality goods at competitive prices.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our commitment to customer satisfaction and reliability has made us the preferred 
                shopping destination for families and businesses in Ngaremara and surrounding areas.
              </p>
            </div>

            {/* Store Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              
              {/* Founder Card */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 hover:border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-orange-100 rounded-lg">
                    <User className="text-orange-500" size={22} />
                  </div>
                  <h4 className="font-semibold text-gray-800">Founder</h4>
                </div>
                <p className="text-gray-700 font-medium">Kamunya</p>
                <p className="text-sm text-gray-500">Visionary & Community Leader</p>
              </div>

              {/* Store Name Card */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 hover:border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-orange-100 rounded-lg">
                    <Store className="text-orange-500" size={22} />
                  </div>
                  <h4 className="font-semibold text-gray-800">Store</h4>
                </div>
                <p className="text-gray-700 font-medium">Kamunya Store</p>
                <p className="text-sm text-gray-500">Wholesale & Retail</p>
              </div>

              {/* Location Card */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 hover:border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-orange-100 rounded-lg">
                    <MapPin className="text-orange-500" size={22} />
                  </div>
                  <h4 className="font-semibold text-gray-800">Location</h4>
                </div>
                <p className="text-gray-700 font-medium">Ngaremara, Isiolo</p>
                <p className="text-sm text-gray-500">Isiolo County, Kenya</p>
              </div>

              {/* Contact Card */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 hover:border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-orange-100 rounded-lg">
                    <Phone className="text-orange-500" size={22} />
                  </div>
                  <h4 className="font-semibold text-gray-800">Contact</h4>
                </div>
                <p className="text-gray-700 font-medium">+254 XXX XXX XXX</p>
                <p className="text-sm text-gray-500">info@kamunyastore.co.ke</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-orange-50 p-5 rounded-xl border border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="text-orange-500" size={22} />
                <h4 className="font-semibold text-gray-800">Business Hours</h4>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Monday - Friday</p>
                  <p className="font-medium text-gray-800">8:00 AM - 8:00 PM</p>
                </div>
                <div>
                  <p className="text-gray-600">Saturday - Sunday</p>
                  <p className="font-medium text-gray-800">9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <MapPin size={18} />
                Get Directions
              </button>
              <button className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 py-3 px-6 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2">
                <Mail size={18} />
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Package, label: "Quality Products", value: "500+" },
            { icon: User, label: "Happy Customers", value: "1000+" },
            { icon: Award, label: "Years of Service", value: "5+" },
            { icon: Store, label: "Community Trust", value: "100%" },
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center hover:shadow-lg transition duration-300">
              <item.icon className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutKamunyaStore;