import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFilterProductsQuery } from "../../../features/Products/productsAPi";
import { Package, Loader2, AlertCircle } from "lucide-react";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read the category query from URL
  const categoryQuery = searchParams.get("category") || "";

  /* =============================
     FETCH FILTERED PRODUCTS
  ============================= */
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useFilterProductsQuery({ category: categoryQuery, isActive: true });

  /* =============================
     LOADING STATE
  ============================= */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  /* =============================
     ERROR STATE
  ============================= */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle size={40} className="text-red-500 mb-3" />
        <p className="text-lg font-semibold text-gray-700">
          Failed to load products
        </p>

        <button
          onClick={() => refetch()}
          className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* =============================
     EMPTY STATE
  ============================= */
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Package size={40} className="text-gray-400 mb-3" />
        <p className="text-lg text-gray-600">
          {categoryQuery
            ? `No products found in "${categoryQuery}"`
            : "No products available"}
        </p>
      </div>
    );
  }

  /* =============================
     MAIN UI
  ============================= */
  return (
    <div className="w-full px-6 py-10 max-w-[1400px] mx-auto">
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {categoryQuery ? categoryQuery : "All Products"}
        </h1>
        <p className="text-gray-500 mt-1">
          Browse available products in the store
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.productID}
            onClick={() => navigate(`/product/${product.productID}`)}
            className="cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white"
          >
            {/* IMAGE */}
            <div className="h-[180px] bg-gray-100 flex items-center justify-center overflow-hidden">
              {product.imageURL ? (
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Package size={40} className="text-gray-400" />
              )}
            </div>

            {/* PRODUCT INFO */}
            <div className="p-4">
              {/* NAME */}
              <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">
                {product.name}
              </h3>

              {/* CATEGORY */}
              {product.category && (
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              )}

              {/* PRICE */}
              <div className="flex items-center justify-between mt-3">
                <span className="text-orange-500 font-bold text-lg">
                  KSh {product.sellingPrice}
                </span>

                {/* STOCK */}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    product.stockQuantity > product.reorderLevel
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.stockQuantity} in stock
                </span>
              </div>

              {/* SKU */}
              <p className="text-xs text-gray-400 mt-2">SKU: {product.sku}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;