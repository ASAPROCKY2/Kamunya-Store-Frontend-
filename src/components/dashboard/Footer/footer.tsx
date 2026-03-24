import React from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, ShoppingCart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-orange-600 text-orange-100 pt-14 pb-6 px-6">
      <div className="max-w-7xl mx-auto">

        {/* =============================
            TOP FOOTER SECTIONS
        ============================= */}
        <div className="grid md:grid-cols-4 gap-10 mb-10">

          {/* STORE INFO */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Kamunya Store
            </h3>

            <p className="text-orange-100 mb-4">
              Your trusted neighborhood shop providing quality household
              goods at affordable wholesale and retail prices.
            </p>

            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} />
              <span>Ngaremara, Isiolo County, Kenya</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Phone size={18} />
              <span>+254 XXX XXX XXX</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail size={18} />
              <span>kamunyastore@gmail.com</span>
            </div>
          </div>

          {/* SHOP CATEGORIES */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Shop Categories
            </h3>

            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Sugar
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Cooking Oil
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Flour
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Rice
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Household Essentials
                </a>
              </li>
            </ul>
          </div>

          {/* CUSTOMER LINKS */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Customer Links
            </h3>

            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  My Account
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  My Orders
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Track Order
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Help Center
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>

          {/* SOCIAL + ABOUT */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              About Kamunya Store
            </h3>

            <p className="text-orange-100 mb-4">
              Serving the Ngaremara community with reliable access to
              essential products. We provide both retail and wholesale
              services to make shopping easy and affordable.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 mt-4">

              <a
                href="#"
                className="bg-orange-500 hover:bg-orange-700 p-2 rounded-md transition"
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                className="bg-orange-500 hover:bg-orange-700 p-2 rounded-md transition"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                className="bg-orange-500 hover:bg-orange-700 p-2 rounded-md transition"
              >
                <ShoppingCart size={18} />
              </a>

            </div>
          </div>

        </div>

        {/* =============================
            FOOTER DIVIDER
        ============================= */}
        <div className="border-t border-orange-400 pt-6 text-center text-sm text-orange-100">
          © 2026 Kamunya Store — Wholesale & Retail Shop System.  
          All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;