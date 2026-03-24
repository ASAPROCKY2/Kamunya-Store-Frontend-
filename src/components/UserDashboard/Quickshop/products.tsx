import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useFilterProductsQuery,
  type TProduct,
} from "../../../features/Products/productsAPi";
import { useGetActiveCategoriesQuery } from "../../../features/Categories/categoriesApi";
import {
  Package,
  Loader2,
  AlertCircle,
  ShoppingCart,
  Search,
  Heart,
  Filter,
  Grid3x3,
  LayoutList,
  X,
  ChevronRight,
  Tag,
  Store,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const ShopProducts: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const itemsPerPageOptions = [10, 20, 30, 50, 100];

  /* =============================
     FETCH DATA
  ============================= */

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
    refetch,
  } = useFilterProductsQuery({ isActive: true });

  const { data: categories = [] } = useGetActiveCategoriesQuery();

  /* =============================
     FILTER AND SORT PRODUCTS
  ============================= */

  const filteredProducts = products
    .filter((product) => {
      // Search filter
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === "all" || 
        product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.sellingPrice - b.sellingPrice;
        case "price-high":
          return b.sellingPrice - a.sellingPrice;
        case "name":
          return a.name.localeCompare(b.name);
        case "popular":
        default:
          return (b.stockQuantity || 0) - (a.stockQuantity || 0);
      }
    });

  /* =============================
     PAGINATION CALCULATIONS
  ============================= */
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, itemsPerPage]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  /* =============================
     PAGINATION HANDLERS
  ============================= */
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* =============================
     GENERATE PAGE NUMBERS FOR DISPLAY
  ============================= */
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const half = Math.floor(maxPagesToShow / 2);
      let start = Math.max(currentPage - half, 1);
      let end = Math.min(start + maxPagesToShow - 1, totalPages);
      
      if (end - start + 1 < maxPagesToShow) {
        start = Math.max(end - maxPagesToShow + 1, 1);
      }
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  /* =============================
     GROUP PRODUCTS BY CATEGORY
  ============================= */

  const groupedProducts: Record<string, TProduct[]> = {};
  currentProducts.forEach((product) => {
    const category = product.category || "Other";
    if (!groupedProducts[category]) {
      groupedProducts[category] = [];
    }
    groupedProducts[category].push(product);
  });

  /* =============================
     LOADING STATE
  ============================= */

  if (productsLoading) {
    return (
      <main className="flex-1 p-3 lg:p-6 w-full flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
            <Store className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500" size={32} />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
        </div>
      </main>
    );
  }

  /* =============================
     ERROR STATE
  ============================= */

  if (productsError) {
    return (
      <main className="flex-1 p-3 lg:p-6 w-full flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">Failed to load products. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  /* =============================
     MAIN UI - ONLY SHOP CONTENT
  ============================= */

  return (
    <main className="flex-1 p-3 lg:p-6 w-full">
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 lg:p-6 rounded-2xl">
        {/* HEADER WITH TOTALS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Products Shop
            </h2>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">
              Browse and shop our collection
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
              <span className="font-semibold text-green-600">
                {filteredProducts.length}
              </span>{" "}
              <span className="text-gray-500 text-sm">products</span>
            </div>
            <div className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
              <span className="font-semibold text-orange-600">
                {categories.length}
              </span>{" "}
              <span className="text-gray-500 text-sm">categories</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-3 mb-6 sticky top-20 z-30">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            {/* View Toggle */}
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <LayoutList size={18} />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
            >
              <Filter size={18} />
            </button>
          </div>

          {/* Category Filters (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-700">Category:</span>
            
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedCategory === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.categoryID}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    selectedCategory === cat.name
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory !== "all" || sortBy !== "popular") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSortBy("popular");
                  handleFilterChange();
                }}
                className="text-xs text-orange-500 hover:text-orange-600 font-medium ml-auto"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Categories</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-1">
              <button
                onClick={() => {
                  handleCategoryChange("all");
                  setShowFilters(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${
                  selectedCategory === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.categoryID}
                  onClick={() => {
                    handleCategoryChange(cat.name);
                    setShowFilters(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${
                    selectedCategory === cat.name
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ITEMS PER PAGE SELECTOR AND RESULTS COUNT */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm bg-white"
              >
                {itemsPerPageOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
            
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="font-semibold">{filteredProducts.length}</span> products
            </p>
          </div>
        )}

        {/* Category Sections */}
        {categories.map((category) => {
          const categoryProducts = groupedProducts[category.name] || [];
          if (!categoryProducts.length) return null;

          return (
            <div key={category.categoryID} className="mb-10">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                    <Tag className="text-white" size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {category.name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {categoryProducts.length} items
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/products?category=${category.name}`)}
                  className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-xs font-medium group"
                >
                  <span>View All</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition" />
                </button>
              </div>

              {/* Products Grid/List */}
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
                  : "space-y-3"
              }>
                {categoryProducts.map((product) => (
                  <div
                    key={product.productID}
                    onClick={() => navigate(`/product/${product.productID}`)}
                    className={`group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    {viewMode === "grid" ? (
                      // Grid View - Smaller Cards
                      <>
                        {/* Image */}
                        <div className="relative h-28 sm:h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg overflow-hidden">
                          {product.imageURL ? (
                            <img
                              src={product.imageURL}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={24} className="text-gray-400" />
                            </div>
                          )}
                          
                          {/* Wishlist Button */}
                          <button className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition">
                            <Heart size={12} className="text-gray-600" />
                          </button>
                        </div>

                        {/* Info */}
                        <div className="p-2">
                          <h3 className="font-medium text-gray-800 text-xs line-clamp-2 min-h-[2rem]">
                            {product.name}
                          </h3>

                          {/* Price and Cart */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-orange-500 font-semibold text-sm">
                              KSh {product.sellingPrice.toLocaleString()}
                            </span>
                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition">
                              <ShoppingCart
                                size={12}
                                className="text-orange-500 group-hover:text-white transition"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // List View - Smaller
                      <>
                        {/* Image */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-l-lg overflow-hidden flex-shrink-0">
                          {product.imageURL ? (
                            <img
                              src={product.imageURL}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 p-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                                {product.name}
                              </h3>
                            </div>

                            <div className="text-left sm:text-right">
                              <span className="text-orange-500 font-bold text-sm">
                                KSh {product.sellingPrice.toLocaleString()}
                              </span>
                              <button className="mt-1 px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-1 text-xs">
                                <ShoppingCart size={12} />
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {!filteredProducts.length && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package size={28} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No products found</h3>
            <p className="text-sm text-gray-600 mb-4">Try adjusting your search or category</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSortBy("popular");
                handleFilterChange();
              }}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm font-medium hover:shadow-md transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Enhanced Pagination Controls */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 mb-4 gap-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="First Page"
              >
                <ChevronsLeft size={16} />
              </button>
              
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1">
                {getPageNumbers().map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition ${
                      currentPage === pageNumber
                        ? "bg-orange-500 text-white"
                        : "bg-white border border-gray-200 hover:bg-orange-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next Page"
              >
                <ChevronRightIcon size={16} />
              </button>
              
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Last Page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ShopProducts;