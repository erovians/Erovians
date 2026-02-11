import React from "react";
import {
  Eye,
  Package,
  Shield,
  Truck,
  CheckCircle,
  Building2,
  FileText,
} from "lucide-react";

const BuyerPreview = ({
  formData,
  selectedPreviewImage,
  setSelectedPreviewImage,
  company,
  seller,
}) => {
  return (
    <div className="lg:sticky lg:top-24 h-fit">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Preview Header */}
        <div className="bg-navyblue px-5 py-4 border-b">
          <div className="flex items-center gap-2 text-white">
            <Eye className="w-5 h-5" />
            <h2 className="font-semibold text-white">Live Buyer Preview</h2>
          </div>
          <p className="text-blue-100 text-xs mt-1">
            See how customers will view your product
          </p>
        </div>

        {/* Image Gallery Preview */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-70 flex items-center justify-center">
            {formData.productImages.length > 0 ? (
              <img
                src={
                  typeof formData.productImages[selectedPreviewImage] ===
                  "string"
                    ? formData.productImages[selectedPreviewImage]
                    : URL.createObjectURL(
                        formData.productImages[selectedPreviewImage]
                      )
                }
                alt="Product Preview"
                className="max-h-65 max-w-full object-contain rounded"
              />
            ) : (
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  Upload images to preview
                </p>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {formData.productImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {formData.productImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPreviewImage(idx)}
                  className={`shrink-0 w-14 h-14 rounded border-2 overflow-hidden transition-all ${
                    selectedPreviewImage === idx
                      ? "border-blue-900 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img)
                    }
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Preview */}
        <div className="p-5 space-y-4">
          {/* Product Name & SKU */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {formData.productName || "Product Name"}
            </h2>
            {formData.product_sku && (
              <p className="text-xs text-gray-500 mt-1">
                SKU: {formData.product_sku}
              </p>
            )}
          </div>

          {/* Price */}
          {formData.pricePerUnit && (
            <div className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-700">
                  ₹{parseFloat(formData.pricePerUnit).toLocaleString()}
                </span>
                <span className="text-sm text-green-600">
                  / {formData.priceUnit}
                </span>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {formData.product_type && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                {formData.product_type.replace("-", " ")}
              </span>
            )}
            {formData.category && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">
                {formData.category}
              </span>
            )}
            {formData.subCategory && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
                {formData.subCategory}
              </span>
            )}
            {formData.grade && (
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                Grade {formData.grade}
              </span>
            )}
          </div>

          {/* Specifications Grid */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Specifications
            </h4>

            {formData.color ||
            formData.origin ||
            formData.product_material ||
            formData.weight ||
            formData.size.length ||
            formData.size.width ||
            formData.size.thickness ||
            formData.available_stock ||
            formData.expected_shipping_time ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {formData.color && (
                  <div>
                    <p className="text-gray-500 text-xs">Color</p>
                    <p className="font-medium text-gray-900">
                      {formData.color}
                    </p>
                  </div>
                )}
                {formData.origin && (
                  <div>
                    <p className="text-gray-500 text-xs">Origin</p>
                    <p className="font-medium text-gray-900">
                      {formData.origin}
                    </p>
                  </div>
                )}
                {formData.product_material && (
                  <div>
                    <p className="text-gray-500 text-xs">Material</p>
                    <p className="font-medium text-gray-900">
                      {formData.product_material}
                    </p>
                  </div>
                )}
                {formData.weight && (
                  <div>
                    <p className="text-gray-500 text-xs">Weight</p>
                    <p className="font-medium text-gray-900">
                      {formData.weight} {formData.weightMeasurement}
                    </p>
                  </div>
                )}
                {(formData.size.length ||
                  formData.size.width ||
                  formData.size.thickness) && (
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs mb-1">
                      Dimensions (L × W × T)
                    </p>
                    <p className="font-medium text-gray-900 text-xs">
                      {formData.size.length &&
                        `${formData.size.length}${formData.size.lengthMeasurement}`}
                      {formData.size.width &&
                        ` × ${formData.size.width}${formData.size.widthMeasurement}`}
                      {formData.size.thickness &&
                        ` × ${formData.size.thickness}${formData.size.thicknessMeasurement}`}
                    </p>
                  </div>
                )}
                {formData.available_stock && (
                  <div>
                    <p className="text-gray-500 text-xs">Stock Available</p>
                    <p className="font-medium text-green-600">
                      {formData.available_stock} units
                    </p>
                  </div>
                )}
                {formData.expected_shipping_time && (
                  <div>
                    <p className="text-gray-500 text-xs">Shipping Time</p>
                    <p className="font-medium text-gray-900">
                      {formData.expected_shipping_time} days
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-xs text-center py-2">
                Fill in specifications to preview
              </p>
            )}
          </div>

          {/* Description Preview */}
          {formData.description && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                {formData.description}
              </p>
            </div>
          )}

          {/* Trust Badges */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Trade Assurance
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Quality checked products</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Customized packaging & shipping</span>
              </div>
              {formData.compliance_standards.ce_marking && (
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>CE Marking Certified</span>
                </div>
              )}
            </div>
          </div>

          {/* Seller Info Preview */}
          {(company || seller) && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                {company?.companyBasicInfo?.logo ? (
                  <img
                    src={company.companyBasicInfo.logo}
                    alt="Company"
                    className="w-12 h-12 object-contain border border-gray-200 rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-900" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">
                    {company?.companyBasicInfo?.companyName ||
                      seller?.seller_name ||
                      "Your Company"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {seller?.varificationStatus === "Approved" && (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    )}
                    <span className="text-xs text-gray-500">
                      {seller?.varificationStatus === "Approved"
                        ? "Verified Supplier"
                        : "Supplier"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons Preview */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-default"
            >
              <FileText className="w-4 h-4" />
              REQUEST QUOTATION
            </button>
            <button
              type="button"
              className="w-full border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-medium cursor-default"
            >
              Contact Supplier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerPreview;
