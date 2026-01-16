import React from "react";
import {
  CheckCircle,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Building2,
} from "lucide-react";

const SellerInfo = ({ company, seller }) => {
  const getRegistrationYear = () => {
    if (!company?.companyRegistrationYear) return "N/A";
    return new Date(company.companyRegistrationYear).getFullYear();
  };

  if (!company) return null;

  return (
    <div className="bg-white border border-gray-300 rounded p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        Supplier Information
      </h3>

      <div className="flex items-start gap-4">
        {company.logo && (
          <div className="shrink-0">
            <img
              src={company.logo}
              alt={company.companyName}
              className="w-16 h-16 object-contain border-2 border-gray-200 rounded-lg p-1"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 text-base">
                {company.companyName}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                {seller?.varificationStatus === "Verified" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Verified Supplier
                  </span>
                )}
                <span className="text-xs text-gray-500 font-medium">
                  Since {getRegistrationYear()}
                </span>
              </div>
            </div>
          </div>

          {company.address && (
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="text-gray-900 font-medium">
                  {company.address.city}, {company.address.stateOrProvince}
                </p>
                <p className="text-gray-600">
                  {company.address.countryOrRegion}
                </p>
              </div>
            </div>
          )}

          {company.mainCategory && company.mainCategory.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Main Products</p>
              <div className="flex flex-wrap gap-1">
                {company.mainCategory.slice(0, 3).map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs capitalize"
                  >
                    {cat}
                  </span>
                ))}
                {company.mainCategory.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{company.mainCategory.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Contact Actions */}
          <div className="flex gap-2 pt-3 border-t">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm transition-all flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Supplier
            </button>
            <button className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded text-sm transition-all">
              View Profile
            </button>
          </div>
        </div>
      </div>

      {seller && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-semibold text-xs">
                {seller.sellername?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{seller.sellername}</p>
              <p className="text-xs text-gray-500">Sales Representative</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerInfo;
