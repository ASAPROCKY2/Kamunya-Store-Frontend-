// src/pages/categories/Category.tsx
import React from "react";
import { useGetAllCategoriesQuery } from "../../../features/Categories/categoriesApi";
import  type { TCategory } from "../../../features/Categories/categoriesApi";

import { useNavigate } from "react-router-dom";

const Category: React.FC = () => {
  const navigate = useNavigate();

  const { data: categories = [], isLoading, isError } = useGetAllCategoriesQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading categories...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-red-500 text-lg">Failed to load categories. Please try again later.</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">No categories available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">All Categories</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((category: TCategory) => (
          <div
            key={category.categoryID}
            className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition"
            onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
          >
            <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
              {category.imageURL ? (
                <img src={category.imageURL} alt={category.name} className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-400 font-medium">No Image</span>
              )}
            </div>
            <div className="p-3 text-center">
              <p className="text-sm font-medium text-gray-700">{category.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;