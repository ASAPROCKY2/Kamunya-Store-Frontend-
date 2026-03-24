// src/pages/LandingPage.tsx

import React from "react";
import Navbar from "../../components/dashboard/Header/header";
import Hero from "../../components/dashboard/Home/hero"; // Hero fetches promotions from DB
import QuickCategories from "../../components/dashboard/QuickCategory/quickcategory"; // Quick category navigation
import FeaturedProducts from "../../components/dashboard/FeaturedProducts/featuredproducts"; // Featured products
import Highlights from "../../components/dashboard/Highlight/highlight"; // Store highlights
import AboutKamunyaStore from "../../components/dashboard/About/about"; // About section
import Footer from "../../components/dashboard/Footer/footer"; // Footer section

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* =============================
          NAVBAR
      ============================= */}
      <Navbar />

      {/* =============================
          MAIN CONTENT
      ============================= */}
      <main className="flex-grow">

        {/* =============================
            HERO SECTION (PROMOTIONS)
        ============================= */}
        <Hero />

        {/* =============================
            QUICK CATEGORY NAVIGATION
        ============================= */}
        <QuickCategories />

        {/* =============================
            FEATURED PRODUCTS
        ============================= */}
        <FeaturedProducts />

        {/* =============================
            STORE HIGHLIGHTS
        ============================= */}
        <Highlights />

        {/* =============================
            ABOUT KAMUNYA STORE
        ============================= */}
        <AboutKamunyaStore />

      </main>

      {/* =============================
          FOOTER
      ============================= */}
      <Footer />

    </div>
  );
};

export default LandingPage;