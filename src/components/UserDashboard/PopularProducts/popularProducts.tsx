// src/components/Dashboard/UserDashboard/PopularProducts.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaBoxOpen,
  FaSearch,
  FaFilter,
  FaTimes
} from "react-icons/fa";
import { useGetAllProductsQuery } from "../../../features/Products/productsAPi";
import { useGetActiveCategoriesQuery } from "../../../features/Categories/categoriesApi";

interface PopularProductsProps {
  initialDisplayCount?: number;
  itemsPerPage?: number;
}

const PopularProducts: React.FC<PopularProductsProps> = ({ 
  initialDisplayCount = 4,
  itemsPerPage = 8 
}) => {
  const navigate = useNavigate();
  const { data: products = [], isLoading: productsLoading, error: productsError } = useGetAllProductsQuery();
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useGetActiveCategoriesQuery();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  // Extract unique categories from database categories
  useEffect(() => {
    if (categories.length > 0) {
      const categoryNames = categories.map(cat => cat.name);
      setCategoryOptions(["all", ...categoryNames]);
    } else {
      // Fallback to product categories if no categories in database
      if (products.length > 0) {
        const uniqueCategories = Array.from(
          new Set(products.map(p => p.category || "Uncategorized"))
        );
        setCategoryOptions(["all", ...uniqueCategories]);
      }
    }
  }, [categories, products]);

  // Handle product click navigation
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Handle view details button click
  const handleViewDetails = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation(); // Prevent event bubbling
    navigate(`/product/${productId}`);
  };

  // Handle add to cart button click
  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log("Add to cart", {
      productID: product.productID,
      name: product.name,
      price: product.sellingPrice
    });
    // You can dispatch to cart store here
    alert(`${product.name} added to cart`);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Handle category matching - check against both product.category and if it matches any category name
    const productCategory = product.category || "Uncategorized";
    const matchesCategory = selectedCategory === "all" || productCategory === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort by popularity (based on stock quantity as a proxy)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    return b.stockQuantity - a.stockQuantity;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("popular-products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Loading state
  if (productsLoading || categoriesLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 bg-[rgb(33,38,56)] rounded-full"></span>
            Popular Products
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(initialDisplayCount)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-40 rounded-t-lg"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (productsError || categoriesError) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
        <div className="text-center text-red-600">
          <FaBoxOpen className="text-4xl mx-auto mb-2" />
          <p className="font-medium">Failed to load products</p>
          <p className="text-sm text-red-400 mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div id="popular-products" className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm">
      {/* Header with title and filter toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-5 bg-[rgb(33,38,56)] rounded-full"></span>
          Popular Products
          <span className="text-xs font-normal text-gray-500 ml-2">
            ({sortedProducts.length} items)
          </span>
        </h2>
        
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200"
        >
          <FaFilter size={12} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Search and Filters */}
      <motion.div 
        initial={false}
        animate={{ height: showFilters ? "auto" : "auto" }}
        className="mb-4 space-y-3"
      >
        {/* Search bar - always visible */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(33,38,56)] focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>

        {/* Category filter - responsive with categories from database */}
        <div className={`${!showFilters && 'hidden sm:block'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-64 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(33,38,56)] bg-white"
            >
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            
            {/* Show category count */}
            {selectedCategory !== "all" && (
              <span className="text-xs text-gray-500">
                {filteredProducts.length} products in this category
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      {displayedProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FaBoxOpen className="text-4xl mx-auto mb-2 text-gray-300" />
          <p>No products found</p>
          <button 
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <AnimatePresence mode="wait">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.productID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleProductClick(product.productID)}
                  className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative h-32 sm:h-36 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {product.imageURL ? (
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBoxOpen className="text-3xl text-gray-300" />
                      </div>
                    )}
                    
                    {/* Stock Badge */}
                    <div className="absolute top-2 right-2">
                      {product.stockQuantity > 10 ? (
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                          In Stock
                        </span>
                      ) : product.stockQuantity > 0 ? (
                        <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                          Low Stock
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Quick action buttons */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={(e) => handleViewDetails(e, product.productID)}
                        className="p-2 bg-white rounded-full hover:bg-[rgb(33,38,56)] hover:text-white transition-colors"
                        title="View Details"
                      >
                        <FaEye size={14} />
                      </button>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="p-2 bg-white rounded-full hover:bg-[rgb(33,38,56)] hover:text-white transition-colors"
                        title="Add to Cart"
                      >
                        <FaShoppingCart size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 text-sm truncate" title={product.name}>
                      {product.name}
                    </h3>
                    
                    {/* Category and SKU */}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {product.category || "General"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        SKU: {product.sku}
                      </span>
                    </div>

                    {/* Price and Rating */}
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-base font-bold text-[rgb(33,38,56)]">
                          KSh {product.sellingPrice.toLocaleString()}
                        </span>
                        {product.buyingPrice < product.sellingPrice && (
                          <span className="text-[10px] text-gray-400 line-through ml-1">
                            KSh {product.buyingPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" size={12} />
                        <span className="text-xs text-gray-600">4.5</span>
                      </div>
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                        <span>Stock</span>
                        <span>{product.stockQuantity} units</span>
                      </div>
                      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[rgb(33,38,56)] to-blue-600 rounded-full"
                          style={{ width: `${Math.min((product.stockQuantity / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${
                    currentPage === 1
                      ? "border-gray-100 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-gray-600 hover:bg-[rgb(33,38,56)] hover:text-white hover:border-[rgb(33,38,56)] transition-colors"
                  }`}
                >
                  <FaChevronLeft size={14} />
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                            currentPage === pageNumber
                              ? "bg-[rgb(33,38,56)] text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border ${
                    currentPage === totalPages
                      ? "border-gray-100 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-gray-600 hover:bg-[rgb(33,38,56)] hover:text-white hover:border-[rgb(33,38,56)] transition-colors"
                  }`}
                >
                  <FaChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PopularProducts;