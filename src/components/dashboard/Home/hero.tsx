// src/components/dashboard/Home/hero.tsx
import React from "react";
import { useGetActivePromotionsQuery } from "../../../features/Promotion/promotionsApi";
import type { TPromotion } from "../../../features/Promotion/promotionsApi";

// Swiper v11 imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Swiper v11 styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Hero: React.FC = () => {
  // Fetch active promotions from the database
  const { data: promotions, isLoading, isError } = useGetActivePromotionsQuery();

  return (
    <section className="relative w-full">
      {isLoading ? (
        // Loading state
        <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-lg" />
      ) : isError || !promotions || promotions.length === 0 ? (
        // Error or empty state
        <div className="w-full h-[400px] flex items-center justify-center bg-red-100 rounded-lg">
          <p className="text-red-500 font-semibold">No active promotions available</p>
        </div>
      ) : (
        // Carousel with actual promotions
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="w-full relative"
        >
          {promotions.map((promo: TPromotion) => (
            <SwiperSlide key={promo.promoID}>
              <div
                className="relative w-full h-[400px] cursor-pointer"
                onClick={() => {
                  if (promo.link) window.open(promo.link, "_blank");
                }}
              >
                {promo.imageURL ? (
                  <img
                    src={promo.imageURL}
                    alt={promo.title}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 rounded-lg">
                    {promo.title}
                  </div>
                )}
                <div className="absolute bottom-5 left-5 bg-black bg-opacity-50 text-white px-4 py-2 rounded-md">
                  {promo.title}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default Hero;