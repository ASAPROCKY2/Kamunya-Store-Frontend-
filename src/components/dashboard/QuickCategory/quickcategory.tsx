// src/components/dashboard/Home/QuickCategories.tsx
import React from "react";
import { useGetActiveCategoriesQuery } from "../../../features/Categories/categoriesApi";
import type { TCategory } from "../../../features/Categories/categoriesApi";
import { useNavigate } from "react-router-dom"; // for navigation

const QuickCategories: React.FC = () => {
  const { data: categories, isLoading, isError } = useGetActiveCategoriesQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full py-6 flex justify-center items-center text-gray-500">
        Loading categories...
      </div>
    );
  }

  if (isError || !categories || categories.length === 0) {
    return (
      <div className="w-full py-6 flex justify-center items-center text-gray-500">
        No categories available.
      </div>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto my-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Quick Categories</h2>

      <div className="flex overflow-x-auto space-x-4 py-2">
        {categories.map((cat: TCategory) => (
          <div
            key={cat.categoryID}
            onClick={() => navigate(`/products?category=${cat.categoryID}`)}
            className="flex-none w-32 md:w-36 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden flex flex-col items-center"
          >
            <div className="w-full h-24 md:h-28 relative">
              <img
                src={cat.imageURL || "/images/default-category.png"}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 text-center">
              <p className="text-gray-800 font-medium truncate">{cat.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickCategories;