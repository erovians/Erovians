import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { fetchAllCategories } from "../lib/redux/category/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  ChevronRight,
  Layers,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  Grid3x3,
  ArrowRight,
} from "lucide-react";
import { assets } from "../assets/assets";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, loading, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleCategoryClick = (categorySlug) => {
    navigate(`/categories/${categorySlug}`);
  };

  const handleSubCategoryClick = (categorySlug, subCategorySlug) => {
    navigate(`/categories/${categorySlug}/${subCategorySlug}`);
  };

  // Category colors for visual distinction
  const categoryColors = [
    {
      gradient: "from-blue-600 to-blue-700",
      hover: "hover:from-blue-700 hover:to-blue-800",
      dot: "bg-blue-500",
    },
    {
      gradient: "from-green-600 to-green-700",
      hover: "hover:from-green-700 hover:to-green-800",
      dot: "bg-green-500",
    },
    {
      gradient: "from-purple-600 to-purple-700",
      hover: "hover:from-purple-700 hover:to-purple-800",
      dot: "bg-purple-500",
    },
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <div className="bg-navyblue text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
            <div className="text-center">
              <img
                src={assets.logowhite}
                alt="Erovians Logo"
                className="h-10 sm:h-12 md:h-14 mb-4 sm:mb-6 mx-auto"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Explore Product Categories
              </h1>
              <p className="text-base sm:text-lg text-white/90 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
                Discover premium natural stones, tiles, and finishing materials
                from verified suppliers worldwide
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 max-w-2xl mx-auto px-4">
                <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/20">
                  <Grid3x3 className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl font-bold mb-1">
                    {categories.length}
                  </div>
                  <div className="text-xs sm:text-sm text-white/80">
                    Main Categories
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/20">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl font-bold mb-1">
                    {categories.reduce(
                      (acc, cat) => acc + cat.totalProducts,
                      0
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-white/80">
                    Total Products
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/20">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl font-bold mb-1">
                    {categories.reduce(
                      (acc, cat) => acc + cat.subcategories.length,
                      0
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-white/80">
                    Subcategories
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="py-8 sm:py-12 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navyblue mb-4"></div>
                <p className="text-gray-600">Loading categories...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
                <p className="text-red-600 font-semibold">{error}</p>
              </div>
            )}

            {/* Categories Grid */}
            {!loading && !error && categories.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {categories.map((category, index) => {
                  const colorScheme =
                    categoryColors[index % categoryColors.length];

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                    >
                      {/* Category Header */}
                      <div
                        className={`bg-linear-to-r ${colorScheme.gradient} ${colorScheme.hover} text-white p-4 sm:p-6 cursor-pointer transition-all`}
                        onClick={() => handleCategoryClick(category.slug)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="bg-white/20 p-2 sm:p-3 rounded-lg backdrop-blur-sm shrink-0">
                              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h2 className="text-lg sm:text-xl font-bold truncate">
                                {category.name}
                              </h2>
                              <p className="text-xs sm:text-sm text-white/90 mt-1">
                                {category.totalProducts} products
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Subcategories List */}
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-3 text-gray-700">
                          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wide">
                            Subcategories
                          </h3>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {category.subcategories.map((subcat, subIndex) => (
                            <div
                              key={subIndex}
                              className={`flex items-center justify-between p-2.5 sm:p-3 rounded-lg transition-all ${
                                subcat.productCount > 0
                                  ? "hover:bg-blue-50 cursor-pointer border border-gray-200 hover:border-blue-300 hover:shadow-sm"
                                  : "bg-gray-50 cursor-not-allowed opacity-60 border border-gray-100"
                              }`}
                              onClick={() => {
                                if (subcat.productCount > 0) {
                                  handleSubCategoryClick(
                                    category.slug,
                                    subcat.slug
                                  );
                                }
                              }}
                            >
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <div
                                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${
                                    subcat.productCount > 0
                                      ? colorScheme.dot
                                      : "bg-gray-300"
                                  }`}
                                ></div>
                                <span className="font-medium text-gray-800 text-xs sm:text-sm truncate">
                                  {subcat.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                <span
                                  className={`text-xs sm:text-sm font-semibold ${
                                    subcat.productCount > 0
                                      ? "text-blue-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {subcat.productCount}
                                </span>
                                {subcat.productCount > 0 && (
                                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* View All Footer */}
                      <div
                        className="border-t border-gray-100 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleCategoryClick(category.slug)}
                      >
                        <div className="flex items-center justify-between text-navyblue">
                          <span className="font-semibold text-xs sm:text-sm">
                            View All {category.name}
                          </span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && categories.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center max-w-md mx-auto">
                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-base sm:text-lg font-semibold">
                  No categories found
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">
                  Categories will appear here once added
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-navyblue text-white py-8 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-4 sm:mb-6">
              Post an RFQ and get custom quotes from verified suppliers
            </p>
            <button className="bg-yellow-500 text-navyblue px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 mx-auto text-sm sm:text-base">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              Post RFQ Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;
