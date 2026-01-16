import React, { useState } from "react";
import {
  Eye,
  Package,
  Palette,
  MapPin,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const ProductCard = ({ product, onClick }) => {
  const {
    _id,
    productName,
    productImages,
    views,
    minimumOrder,
    category,
    subCategory,
    grade,
    color,
    origin,
    pricePerUnit,
    priceUnit,
    description,
  } = product;

  const [imageLoadingStates, setImageLoadingStates] = useState({});

  // Normalize category & subCategory to arrays
  const normalizeToArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value) return [value];
    return [];
  };

  const categories = normalizeToArray(category);
  const subCategories = normalizeToArray(subCategory);

  const images =
    productImages?.length > 0
      ? productImages
      : ["https://via.placeholder.com/800x400"];

  const handleImageLoad = (index) => {
    setImageLoadingStates((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div
      className="block bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
      onClick={() => onClick(_id)}
    >
      {/* Image Carousel - Desktop & Mobile Same */}
      <div className="relative h-48 sm:h-40 overflow-hidden bg-gray-200">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full h-full"
        >
          <CarouselContent className="h-48 sm:h-40">
            {images.map((image, index) => (
              <CarouselItem key={index} className="h-48 sm:h-40">
                <div className="relative w-full h-full">
                  {/* Loading Skeleton */}
                  {!imageLoadingStates[index] && (
                    <div className="absolute inset-0 bg-gray-300 animate-pulse" />
                  )}

                  <img
                    src={image}
                    alt={`${productName} - Image ${index + 1}`}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                      imageLoadingStates[index] ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => handleImageLoad(index)}
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </Carousel>

        {/* Views Badge */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
          <Eye className="w-3 h-3" />
          <span>{views?.toLocaleString() || 0}</span>
        </div>

        {/* Grade Badge */}
        {grade && (
          <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            Grade {grade}
          </div>
        )}

        {/* Carousel Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-2 py-1 rounded-full z-10">
            {images.map((_, index) => (
              <div
                key={index}
                className="w-1.5 h-1.5 rounded-full bg-white/60"
              />
            ))}
          </div>
        )}
      </div>

      {/* Content - Same for Desktop & Mobile */}
      <div className="flex flex-col p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Product Name */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {productName}
          </h3>
        </div>

        {/* Categories */}
        <div className="space-y-1.5">
          {/* Main Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <Package className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              {categories.slice(0, 3).map((cat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium capitalize"
                >
                  {cat}
                </span>
              ))}
              {categories.length > 3 && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  +{categories.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Sub Categories */}
          {subCategories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="flex flex-wrap gap-1.5 items-center line-clamp-1">
                {subCategories.slice(0, 4).map((subCat, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize whitespace-nowrap"
                  >
                    {subCat}
                  </span>
                ))}
                {subCategories.length > 4 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs whitespace-nowrap">
                    +{subCategories.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Color & Origin */}
        <div className="flex items-center gap-3 text-sm">
          {color && (
            <div className="flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 font-medium">{color}</span>
            </div>
          )}
          {origin && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{origin}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price & Minimum Order - Footer */}
        <div className="pt-2 sm:pt-3 border-t border-gray-100 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-lg sm:text-xl font-bold text-green-600">
                ${pricePerUnit}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              per {priceUnit}
            </span>
          </div>

          {/* Minimum Order */}
          {minimumOrder && (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>
                Min. Order:{" "}
                <span className="font-semibold">{minimumOrder}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
