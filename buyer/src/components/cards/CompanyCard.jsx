import React, { useState } from "react";
import { MapPin, Calendar, Package, BadgeCheck } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const CompanyCard = ({ company, seller }) => {
  console.log(company);
  const { companyBasicInfo, companyIntro, _id } = company;
  const { companyName, address, mainCategory, subCategory } = companyBasicInfo;
  const { logo, companyPhotos } = companyIntro;

  const [imageLoadingStates, setImageLoadingStates] = useState({});

  const images =
    companyPhotos?.length > 0
      ? companyPhotos
      : ["https://via.placeholder.com/800x400"];

  // Get verification badge
  const getVerificationBadge = () => {
    if (seller.varificationStatus === "Approved") {
      return (
        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
          <BadgeCheck className="w-3 h-3" />
          <span className="hidden sm:inline">Verified</span>
        </div>
      );
    } else if (seller.varificationStatus === "Pending") {
      return (
        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
          <BadgeCheck className="w-3 h-3" />
          <span className="hidden sm:inline">Pending</span>
        </div>
      );
    }
    return null;
  };

  const handleImageLoad = (index) => {
    setImageLoadingStates((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="block bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer">
      {/* ========================================
          DESKTOP VIEW - Image Carousel
          ======================================== */}
      <div className="hidden lg:block relative h-48 overflow-hidden bg-gray-200">
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
          <CarouselContent className="h-48">
            {images.map((image, index) => (
              <CarouselItem key={index} className="h-48">
                <div className="relative w-full h-full">
                  {/* Loading Skeleton */}
                  {!imageLoadingStates[index] && (
                    <div className="absolute inset-0 bg-gray-300 animate-pulse" />
                  )}

                  <img
                    src={image}
                    alt={`${companyName} - Image ${index + 1}`}
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

        {/* Verification Badge */}
        <div className="absolute top-3 right-3 z-10">
          {getVerificationBadge()}
        </div>

        {/* Logo Overlay */}
        {logo && (
          <div className="absolute bottom-3 left-3 w-16 h-16 bg-white rounded-lg shadow-lg border-2 border-white overflow-hidden">
            <img
              src={logo}
              alt={`${companyName} logo`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Carousel Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-2 py-1 rounded-full z-10">
            {images.map((_, index) => (
              <div
                key={index}
                className="w-1.5 h-1.5 rounded-full bg-white/60"
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Content */}
      <div className="hidden lg:flex flex-col p-4 space-y-3">
        {/* Company Name & Location */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-navyblue transition-colors">
            {companyName}
          </h3>
          <div className="flex items-start gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="line-clamp-2">
              {address.street}, {address.city}, {address.stateOrProvince},{" "}
              {address.countryOrRegion} - {address.postalCode}
            </span>
          </div>
        </div>

        {/* Main Categories */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {/*  */}
            {/* <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Main Categories
            </span> */}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Package className="w-4 h-4 text-gray-500" />
            {mainCategory.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-50 text-navyblue rounded-full text-xs font-medium capitalize"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Sub Categories */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {/* <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Sub Categories
            </span> */}
          </div>
          <div className="flex flex-wrap gap-2 items-center line-clamp-2">
            <Package className="w-4 h-4 text-gray-500" />
            {subCategory.map((subCat, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize line-clamp-1"
              >
                {subCat}
              </span>
            ))}
          </div>
        </div>

        {/* Footer - Seller Info & Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-navyblue to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {seller.sellername.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {seller.sellername}
              </p>
              <p className="text-xs text-gray-500 line-clamp-1">
                {seller.companyregstartionlocation} {seller.seller_status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Calendar className="w-3 h-3" />
            <span className="whitespace-nowrap">
              Est. {companyBasicInfo.companyRegistrationYear}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================
          MOBILE VIEW - Split Layout
          ======================================== */}
      <div className="lg:hidden">
        {/* Top Section: Logo + Company Info */}
        <div className="flex border-b border-gray-200">
          {/* LEFT: Company Logo - FULL COVER */}
          <div className="w-32 h-32 shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 border-r border-gray-200 overflow-hidden">
            {logo ? (
              <img
                src={logo}
                alt={`${companyName} logo`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-navyblue/10 flex items-center justify-center">
                <Package className="w-8 h-8 text-navyblue" />
              </div>
            )}
          </div>

          {/* RIGHT: Company Information */}
          <div className="flex-1 p-3 flex flex-col gap-2">
            {/* Company Name + Badge */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-navyblue transition-colors flex-1">
                {companyName}
              </h3>
              {getVerificationBadge()}
            </div>

            {/* Location - State + Country ONLY */}
            <div className="flex items-start gap-1 text-gray-600 text-xs">
              <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
              <span className="line-clamp-1">
                {address.stateOrProvince}, {address.countryOrRegion}
              </span>
            </div>

            {/* Main Categories */}
            <div className="flex flex-wrap gap-1">
              {mainCategory.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-blue-50 text-navyblue rounded-full text-xs font-medium capitalize"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Sub Categories - RIGHT SIDE ME */}
            <div className="flex flex-wrap gap-1">
              {subCategory.map((subCat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs capitalize"
                >
                  {subCat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Seller Information */}
        <div className="p-3 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Seller Info */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 bg-gradient-to-br from-navyblue to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0">
                {seller.sellername.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-900 line-clamp-1">
                  {seller.sellername} ({seller.seller_status})
                </p>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {seller.companyregstartionlocation}
                </p>
              </div>
            </div>

            {/* Registration Year */}
            <div className="flex items-center gap-1 text-gray-500 text-xs shrink-0 ml-2">
              <Calendar className="w-3 h-3" />
              <span className="whitespace-nowrap">
                {companyBasicInfo.companyRegistrationYear}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
