// src/components/Dashboard/UserDashboard/Promotions/promotion.tsx
import React, { useState, useRef } from "react";
import { useGetActivePromotionsQuery } from "../../../features/Promotion/promotionsApi";
import type { TPromotion } from "../../../features/Promotion/promotionsApi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import {
  FaGift,
  FaTag,
  FaPercent,
  FaFire,
  FaArrowRight,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const DashboardPromotions: React.FC = () => {
  const { data: promotions, isLoading, isError } = useGetActivePromotionsQuery();
  const [showPromoBar, setShowPromoBar] = useState(true);
  const swiperRef = useRef<SwiperType | null>(null);

  const getPromoIcon = (index: number) => {
    const icons = [
      <FaGift className="text-pink-500" />,
      <FaTag className="text-blue-500" />,
      <FaPercent className="text-green-500" />,
      <FaFire className="text-orange-500" />
    ];
    return icons[index % icons.length];
  };

  // Handle collapsed state
  if (!showPromoBar) {
    return (
      <div className="mb-4 w-full">
        <button
          onClick={() => setShowPromoBar(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
        >
          <FaFire className="group-hover:animate-pulse" />
          <span>Show Promotions</span>
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="mb-4 w-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <FaFire className="text-orange-500" />
            <span>Hot Deals</span>
          </h2>

          <button
            onClick={() => setShowPromoBar(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close promotions"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (isError || !promotions || promotions.length === 0) {
    return (
      <div className="mb-4 w-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 opacity-50">
            <FaFire className="text-gray-400" />
            <span>No Active Promotions</span>
          </h2>
          <button
            onClick={() => setShowPromoBar(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close promotions"
          >
            <FaTimes size={14} />
          </button>
        </div>
        <div className="h-32 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
          <p className="text-sm text-gray-400">Check back later for exciting offers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
          <FaFire className="text-orange-500" size={14} />
          <span>🔥 Limited Time Offers</span>
          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {promotions.length}
          </span>
        </h2>

        <button
          onClick={() => setShowPromoBar(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 shadow-sm hover:shadow"
          title="Close promotions"
          aria-label="Close promotions"
        >
          <FaTimes size={12} />
        </button>
      </div>

      {/* Promotions Carousel */}
      <div className="w-full relative">
        {/* Navigation Buttons */}
        {promotions.length > 1 && (
          <>
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover/promo:opacity-100 border border-gray-200 hover:scale-110 backdrop-blur-sm"
              style={{ opacity: 0.8 }}
              aria-label="Previous promotion"
            >
              <FaChevronLeft size={14} />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover/promo:opacity-100 border border-gray-200 hover:scale-110 backdrop-blur-sm"
              style={{ opacity: 0.8 }}
              aria-label="Next promotion"
            >
              <FaChevronRight size={14} />
            </button>
          </>
        )}

        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={promotions.length > 1}
          spaceBetween={16}
          slidesPerView={1}
          onBeforeInit={(swiper: SwiperType) => { swiperRef.current = swiper; }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="w-full"
        >
          {promotions.map((promo: TPromotion, index: number) => (
            <SwiperSlide key={promo.promoID}>
              <div
                className="relative h-32 rounded-xl overflow-hidden cursor-pointer group/slide shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => { if (promo.link) window.open(promo.link, "_blank"); }}
              >
                {promo.imageURL ? (
                  <>
                    <img
                      src={promo.imageURL}
                      alt={promo.title}
                      className="w-full h-full object-cover group-hover/slide:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="flex items-center gap-2 px-3">
                      <span className="text-xl flex-shrink-0">{getPromoIcon(index)}</span>
                      <span className="text-sm font-medium truncate">{promo.title}</span>
                    </div>
                  </div>
                )}

                {/* Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/30">
                    {getPromoIcon(index)}
                    <span>Limited</span>
                  </span>
                </div>

                {/* Title - REMOVED description field since it doesn't exist in TPromotion */}
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="text-white font-medium text-xs drop-shadow-lg truncate">
                    {promo.title}
                  </h3>
                  {/* Removed the description section since TPromotion doesn't have a description field */}
                </div>

                {/* View Button - appears on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/slide:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-gray-900 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium transform -translate-y-2 group-hover/slide:translate-y-0 transition-all duration-300">
                    <span>View Offer</span>
                    <FaArrowRight size={10} />
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-pink-500 animate-progress"></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }

        .animate-progress {
          animation: progress 5s linear infinite;
        }

        /* Ensure Swiper container doesn't overflow */
        .swiper {
          overflow: hidden !important;
          width: 100% !important;
        }
        
        .swiper-wrapper {
          display: flex;
          align-items: stretch;
        }
        
        .swiper-slide {
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default DashboardPromotions;