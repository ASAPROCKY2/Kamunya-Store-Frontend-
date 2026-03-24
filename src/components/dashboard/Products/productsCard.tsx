// src/components/dashboard/Products/productsCard.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery } from "../../../features/Products/productsAPi";
import {
  Package,
  AlertCircle,
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  CreditCard,
  Heart,
  Share2,
  Check,
  Star,
  StarHalf,
} from "lucide-react";

// Layout Components
import Header from "../../dashboard/Header/header";
import Footer from "../../dashboard/Footer/footer";
import UserDrawer from "../../UserDashboard/Aside/UserDrawer";

// Sales API
import { useCreateSaleMutation } from "../../../features/sales/salesAPi";
import type { TSaleItem, TCreateSale } from "../../../features/sales/salesAPi";

// Cart Context
import { useCart } from "../../../Context/cartContext";

// Define the product variant type
interface ProductVariant {
  id: number;
  color: string;
  colorName: string;
  imageURL: string;
  stockQuantity: number;
  sku?: string;
}

const ProductCard: React.FC = () => {    
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const productId = Number(id);
  const { data: product, isLoading, isError, refetch } = useGetProductByIdQuery(productId);

  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const [createSale] = useCreateSaleMutation();

  // Mock product variants - with proper type checking
  const getProductVariants = (): ProductVariant[] => {
    if (!product) return [];
    
    // Ensure imageURL exists, provide fallback
    const baseImageURL = product.imageURL || "/images/placeholder.jpg";
    
    return [
      {
        id: 1,
        color: "white",
        colorName: "White",
        imageURL: baseImageURL,
        stockQuantity: product.stockQuantity,
        sku: `${product.sku}-WHITE`
      },
      {
        id: 2,
        color: "black",
        colorName: "Black",
        imageURL: baseImageURL.includes("white") 
          ? baseImageURL.replace("white", "black") 
          : "/images/air-force-black.jpg",
        stockQuantity: 15,
        sku: `${product.sku}-BLACK`
      },
      {
        id: 3,
        color: "red",
        colorName: "Red",
        imageURL: baseImageURL.includes("white") 
          ? baseImageURL.replace("white", "red") 
          : "/images/air-force-red.jpg",
        stockQuantity: 8,
        sku: `${product.sku}-RED`
      }
    ];
  };

  const productVariants = getProductVariants();

  // Get current variant images based on selected variant
  const getCurrentVariantImages = (): string[] => {
    if (selectedVariant && selectedVariant.imageURL) {
      return [selectedVariant.imageURL];
    }
    return product?.imageURL ? [product.imageURL] : [];
  };

  const productImages = getCurrentVariantImages();
  
  // Get current stock quantity based on selected variant
  const currentStockQuantity = selectedVariant?.stockQuantity || product?.stockQuantity || 0;
  
  // Get current SKU based on selected variant
  const currentSku = selectedVariant?.sku || product?.sku || "";

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const increaseQty = () => {
    if (quantity < (currentStockQuantity || 10)) setQuantity((q) => q + 1);
  };
  
  const decreaseQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  // Handle variant selection
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImage(0); // Reset to first image when variant changes
    setQuantity(1); // Reset quantity when variant changes
  };

  // Updated Add to Cart with variant info
  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      productID: product.productID,
      name: selectedVariant 
        ? `${product.name} - ${selectedVariant.colorName}` 
        : product.name,
      sellingPrice: product.sellingPrice,
      quantity,
      imageURL: selectedVariant?.imageURL || product.imageURL,
      variant: selectedVariant ? {
        color: selectedVariant.color,
        colorName: selectedVariant.colorName,
        sku: selectedVariant.sku
      } : undefined
    };

    addToCart(cartItem);

    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  // Updated Buy Now Logic - Navigates to delivery method with product data
  const handleBuyNow = async () => {
    if (!product) return;

    try {
      // First, create the sale to get a sale ID
      const saleItem: TSaleItem = {
        productID: product.productID,
        quantity,
      };

      const salePayload: TCreateSale = {
        saleType: "online",
        paymentStatus: "pending",
        saleStatus: "completed",
        deliveryRequired: true,
        totalAmount: product.sellingPrice * quantity,
        items: [saleItem],
      };

      const response = await createSale(salePayload).unwrap();
      const saleID = response.data.saleID;

      // Prepare product data for delivery method
      const productData = {
        saleID,
        product: {
          id: product.productID,
          name: selectedVariant 
            ? `${product.name} - ${selectedVariant.colorName}` 
            : product.name,
          price: product.sellingPrice,
          quantity,
          imageURL: selectedVariant?.imageURL || product.imageURL,
          variant: selectedVariant ? {
            color: selectedVariant.color,
            colorName: selectedVariant.colorName,
            sku: selectedVariant.sku
          } : undefined,
          totalAmount: product.sellingPrice * quantity
        }
      };

      // Store the product data in session storage to access it in delivery method
      sessionStorage.setItem('pendingPurchase', JSON.stringify(productData));
      
      // Navigate to delivery method route
      navigate('/delivery-method', { 
        state: { 
          purchaseData: productData 
        } 
      });
    } catch (error) {
      console.error("Sale creation failed:", error);
      alert("Failed to process sale. Please try again.");
    }
  };

  const toggleWishlist = () => setIsWishlisted(!isWishlisted);

  const originalPrice = product?.buyingPrice ? product.buyingPrice * 1.3 : 0;
  const discount = product ? Math.round(((originalPrice - product.sellingPrice) / originalPrice) * 100) : 0;

  // =============================
  // LOADING STATE
  // =============================
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Header />
        <div className="flex flex-1">
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform ${
              drawerOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 transition-transform duration-300 shadow-2xl`}
          >
            <UserDrawer />
          </aside>
          {drawerOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setDrawerOpen(false)} />
          )}
          <main className="flex-1 p-3 lg:p-6 w-full flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
                <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500" size={32} />
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading product details...</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  // =============================
  // ERROR OR NO PRODUCT
  // =============================
  if (isError || !product) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <Header />
        <div className="flex flex-1">
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform ${
              drawerOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 transition-transform duration-300 shadow-2xl`}
          >
            <UserDrawer />
          </aside>
          {drawerOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setDrawerOpen(false)} />
          )}
          <main className="flex-1 p-3 lg:p-6 w-full flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isError ? "Oops! Something went wrong" : "Product Not Found"}
              </h2>
              <p className="text-gray-600 mb-6">
                {isError ? "Failed to load product. Please try again." : "The product you're looking for doesn't exist or has been removed."}
              </p>
              <button
                onClick={() => (isError ? refetch() : navigate("/shop"))}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition"
              >
                {isError ? "Try Again" : "Browse Products"}
              </button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  // =============================
  // MAIN PRODUCT DISPLAY
  // =============================
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <Header />
      <div className="flex flex-1">
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 shadow-2xl`}
        >
          <UserDrawer />
        </aside>
        {drawerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setDrawerOpen(false)} />
        )}
        <main className="flex-1 p-3 lg:p-6 w-full transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {/* Product Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition group"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow group-hover:bg-orange-50">
                  <ArrowLeft size={18} className="group-hover:text-orange-500" />
                </div>
                <span className="font-medium hidden sm:inline">Back to Products</span>
              </button>
              <div className="flex items-center gap-2">
                <button onClick={toggleWishlist} className="p-2 bg-white rounded-lg shadow-sm hover:shadow transition group">
                  <Heart size={18} className={`${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 group-hover:text-red-500"}`} />
                </button>
                <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow transition group">
                  <Share2 size={18} className="text-gray-600 group-hover:text-orange-500" />
                </button>
              </div>
            </div>

            {/* Product Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* LEFT - IMAGES */}
                <div className="bg-gradient-to-br from-gray-50 to-orange-50 p-6 lg:p-8">
                  <div className="relative mb-4 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                    <div className="aspect-square flex items-center justify-center p-8">
                      {productImages[selectedImage] ? (
                        <img
                          src={productImages[selectedImage]}
                          alt={`${product.name}${selectedVariant ? ` - ${selectedVariant.colorName}` : ""}`}
                          className="max-w-full max-h-full object-contain transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <Package size={120} className="text-gray-300" />
                      )}
                    </div>
                    {discount > 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                        -{discount}%
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      {currentStockQuantity > 10 ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 border border-green-200">
                          <Check size={14} />
                          In Stock
                        </span>
                      ) : currentStockQuantity > 0 ? (
                        <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-orange-200">
                          Only {currentStockQuantity} left
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Color Variants Selection */}
                  {productVariants.length > 1 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Color: {selectedVariant?.colorName || productVariants[0].colorName}</label>
                      <div className="flex gap-3">
                        {productVariants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => handleVariantSelect(variant)}
                            className={`flex flex-col items-center gap-2 transition-all ${
                              selectedVariant?.id === variant.id
                                ? "scale-110"
                                : "opacity-70 hover:opacity-100"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-full border-2 overflow-hidden ${
                                selectedVariant?.id === variant.id
                                  ? "border-orange-500 shadow-lg"
                                  : "border-gray-300 hover:border-orange-300"
                              }`}
                              style={{
                                backgroundColor: variant.color,
                                backgroundImage: variant.imageURL ? `url(${variant.imageURL})` : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                              }}
                            >
                              {!variant.imageURL && (
                                <div className="w-full h-full flex items-center justify-center text-xs text-white">
                                  {variant.colorName.charAt(0)}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-600">{variant.colorName}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Thumbnail Images - If you have multiple images per variant */}
                  {productImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 mt-4">
                      {productImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg border-2 overflow-hidden p-2 transition ${
                            selectedImage === index ? "border-orange-500 shadow-md" : "border-gray-200 hover:border-orange-300"
                          }`}
                        >
                          <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT - DETAILS */}
                <div className="p-6 lg:p-8">
                  {/* Product Info */}
                  <div className="mb-6">
                    {product.category && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                          {product.category}
                        </span>
                      </div>
                    )}
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
                      {product.name}
                      {selectedVariant && ` - ${selectedVariant.colorName}`}
                    </h1>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                        <StarHalf size={16} className="fill-yellow-400 text-yellow-400" />
                      </div>
                      <span className="text-sm text-gray-500">(124 reviews)</span>
                    </div>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-4xl font-bold text-orange-500">
                        KSh {product.sellingPrice.toLocaleString()}
                      </span>
                      {originalPrice > product.sellingPrice && (
                        <>
                          <span className="text-lg text-gray-400 line-through">KSh {originalPrice.toLocaleString()}</span>
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                            Save KSh {(originalPrice - product.sellingPrice).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <Package size={14} />
                      SKU: {currentSku}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Quantity</label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={decreaseQty}
                          disabled={quantity <= 1}
                          className="px-4 py-2.5 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} className={quantity <= 1 ? "text-gray-300" : "text-gray-600"} />
                        </button>
                        <span className="w-16 text-center font-medium text-gray-800">{quantity}</span>
                        <button
                          onClick={increaseQty}
                          disabled={quantity >= currentStockQuantity}
                          className="px-4 py-2.5 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} className={quantity >= currentStockQuantity ? "text-gray-300" : "text-gray-600"} />
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">{currentStockQuantity} available</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <button
                      onClick={handleAddToCart}
                      disabled={currentStockQuantity === 0}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all transform hover:scale-[1.02] ${
                        isAddedToCart 
                          ? "bg-green-500 text-white" 
                          : currentStockQuantity === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {isAddedToCart ? (
                        <>
                          <Check size={18} />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          Add to Cart
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={currentStockQuantity === 0}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all transform hover:scale-[1.02] ${
                        currentStockQuantity === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg"
                      }`}
                    >
                      <CreditCard size={18} />
                      Buy Now
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Product Details</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5" />
                        <span>High quality materials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5" />
                        <span>Authentic product from Kamunya Store</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5" />
                        <span>Secure payment with M-Pesa or Card</span>
                      </li>
                      {selectedVariant && (
                        <li className="flex items-start gap-2">
                          <Check size={16} className="text-green-500 mt-0.5" />
                          <span>Color: {selectedVariant.colorName}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProductCard;