// src/components/dashboard/Home/FeaturedProducts.tsx
import React from "react";
import { useFilterProductsQuery } from "../../../features/Products/productsAPi";
import  type{  TProduct } from "../../../features/Products/productsAPi";

// Swiper imports for horizontal carousel (optional)
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedProducts: React.FC = () => {
  // Fetch only active products (you can adjust filter later)
  const { data: products, isLoading, isError } = useFilterProductsQuery({ isActive: true });

  if (isLoading) {
    return (
      <div className="w-full py-10 flex justify-center items-center text-gray-500">
        Loading featured products...
      </div>
    );
  }

  if (isError || !products || products.length === 0) {
    return (
      <div className="w-full py-10 flex justify-center items-center text-gray-500">
        No featured products available.
      </div>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto my-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Products</h2>

      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={15}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 15 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
          1280: { slidesPerView: 4, spaceBetween: 20 },
        }}
      >
        {products.map((prod: TProduct) => (
          <SwiperSlide key={prod.productID}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden">
              <div className="relative w-full h-48 md:h-56">
                <img
                  src={prod.imageURL || "/images/default-product.png"}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{prod.name}</h3>
                <p className="text-gray-600 mt-1">
                  KES {prod.sellingPrice.toLocaleString()}{" "}
                  <span className="line-through text-gray-400 text-sm">
                    {prod.buyingPrice.toLocaleString()}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">Stock: {prod.stockQuantity}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedProducts;