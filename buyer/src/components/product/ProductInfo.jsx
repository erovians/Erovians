import React, { useState } from "react";
import {
  Star,
  CheckCircle,
  Truck,
  Shield,
  PackageCheck,
  FileText,
  MessageSquare,
  Package,
  MessageCircle,
  Info,
} from "lucide-react";
import QuotationModal from "./QuotationModal";

const ProductInfo = ({ product, seller }) => {
  const [quantity, setQuantity] = useState(1);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isChatEnabled] = useState(false); // TODO: Enable after quotation response

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-xl text-gray-800 leading-relaxed font-medium">
          {product.productName}
        </h1>

        <div className="flex items-center gap-4 pb-4 border-b">
          <span className="text-gray-600 text-sm">
            {product.views?.toLocaleString() || 0} views
          </span>
          {seller?.varificationStatus === "Approved" && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Verified Supplier</span>
            </div>
          )}
        </div>

        <div className="pb-4 border-b">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-semibold text-gray-900">
              ₹{product.pricePerUnit?.toLocaleString()}
            </span>
            <span className="text-gray-500">/ {product.priceUnit}</span>
          </div>
        </div>

        <div className="space-y-3">
          {product.grade && (
            <div className="flex">
              <span className="text-gray-600 text-sm w-36">Grade</span>
              <span className="text-gray-900 text-sm font-medium">
                {product.grade}
              </span>
            </div>
          )}
          {product.color && (
            <div className="flex">
              <span className="text-gray-600 text-sm w-36">Color</span>
              <span className="text-gray-900 text-sm font-medium">
                {product.color}
              </span>
            </div>
          )}
          {product.origin && (
            <div className="flex">
              <span className="text-gray-600 text-sm w-36">Origin</span>
              <span className="text-gray-900 text-sm font-medium">
                {product.origin}
              </span>
            </div>
          )}
          {product.size && (
            <div className="flex">
              <span className="text-gray-600 text-sm w-36">Dimensions</span>
              <span className="text-gray-900 text-sm font-medium">
                {product.size.length} {product.size.lengthMeasurement} ×{" "}
                {product.size.width} {product.size.widthMeasurement} ×{" "}
                {product.size.thickness} {product.size.thicknessMeasurement}
              </span>
            </div>
          )}
          {product.weight && (
            <div className="flex">
              <span className="text-gray-600 text-sm w-36">Weight</span>
              <span className="text-gray-900 text-sm font-medium">
                {product.weight} {product.weightMeasurement}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {Array.isArray(product.category) &&
              product.category.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium capitalize"
                >
                  {cat}
                </span>
              ))}
            {Array.isArray(product.subCategory) &&
              product.subCategory.map((subCat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize"
                >
                  {subCat}
                </span>
              ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Trade Assurance
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Quality checked products</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Customized packaging & shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <PackageCheck className="w-4 h-4 text-orange-600" />
              <span>Sample available before bulk order</span>
            </div>
          </div>
        </div>

        {/* B2B Focused Action Buttons */}
        <div className="space-y-3 pt-4">
          {/* Primary CTA - Request Quotation */}
          <button
            onClick={() => setIsQuotationModalOpen(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            REQUEST QUOTATION
          </button>

          {/* Chat Status Badge - Small Info Tag */}
          <div className="relative group">
            <div
              className={`w-full py-2 px-3 rounded border-2 flex items-center justify-between ${
                isChatEnabled
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageCircle
                  className={`w-4 h-4 ${
                    isChatEnabled ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isChatEnabled ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {isChatEnabled ? "Chat Now Available" : "Chat"}
                </span>
              </div>

              {/* Info Badge */}
              <div className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {isChatEnabled ? "Active" : "After quotation"}
                </span>
              </div>
            </div>

            {/* Tooltip on hover */}
            {!isChatEnabled && (
              <div className="absolute bottom-full left-0 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-gray-900 text-white text-xs rounded px-3 py-2 text-center">
                  Chat will be enabled once you receive a quotation response
                  from the seller
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
          <p className="font-semibold mb-1">💡 Price Negotiable</p>
          <p>
            Final price depends on order quantity, customization, and delivery
            terms. Request quotation for best pricing.
          </p>
        </div>
      </div>

      {/* Quotation Modal */}
      <QuotationModal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductInfo;
