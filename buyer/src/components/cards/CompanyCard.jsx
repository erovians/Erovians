import React from "react";
import { MapPin, Calendar, Package, BadgeCheck } from "lucide-react";

const CompanyCard = ({ company, seller, onClick }) => {
  const { companyBasicInfo, companyIntro, createdAt } = company;

  const { companyName, address, mainCategory, subCategory } = companyBasicInfo;
  const { logo, companyDescription, companyPhotos } = companyIntro;

  // Get verification badge color
  const getVerificationBadge = () => {
    if (seller.varificationStatus === "Approved") {
      return (
        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
          <BadgeCheck className="w-3 h-3" />
          Verified
        </div>
      );
    } else if (seller.varificationStatus === "Pending") {
      return (
        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
          <BadgeCheck className="w-3 h-3" />
          Pending
        </div>
      );
    }
    return null;
  };

  return (
    <div
      onClick={() => onClick(company._id)}
      className="bg-white w-98 h-125 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer "
    >
      {/* Image Section */}
      <div className=" relative  h-56 overflow-hidden bg-gray-200">
        <img
          src={companyPhotos[0] || "https://via.placeholder.com/800x400"}
          alt={companyName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">{getVerificationBadge()}</div>
        {/* Logo Overlay */}
        {logo && (
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-lg shadow-lg border-2 border-white overflow-hidden">
            <img
              src={logo}
              alt={`${companyName} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Company Name & Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {companyName}
          </h3>
          <div className="flex items-start gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="line-clamp-1">
              {address.city}, {address.stateOrProvince},{" "}
              {address.countryOrRegion}
            </span>
          </div>
        </div>

        {/* Description */}
        {/* <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {companyDescription}
          {companyDescription && companyDescription.length > 100 && (
            <span className="text-blue-600 hover:text-blue-700 font-medium ml-1 cursor-pointer">
              Read more
            </span>
          )}
        </p> */}

        {/* Main Categories */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Main Categories
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mainCategory.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium capitalize"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Sub Categories */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {subCategory.slice(0, 4).map((subCat, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize"
              >
                {subCat}
              </span>
            ))}
            {subCategory.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                +{subCategory.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer - Seller Info & Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {seller.sellername.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {seller.sellername}
              </p>
              <p className="text-xs text-gray-500">
                {seller.companyregstartionlocation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Calendar className="w-3 h-3" />
            <span>Est. {companyBasicInfo.companyRegistrationYear}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
