import React, { useState } from "react";
import {
  Star,
  CheckCircle,
  Truck,
  Shield,
  PackageCheck,
  FileText,
  MessageSquare,
  TrendingUp,
  Package,
} from "lucide-react";

const ProductInfo = ({ product, seller }) => {
  const [quantity, setQuantity] = useState(product.moq || 1);

  return (
    <div className="space-y-4">
      <h1 className="text-xl text-gray-800 leading-relaxed font-medium">
        {product.productName}
      </h1>

      <div className="flex items-center gap-4 pb-4 border-b">
        <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
          4.3 <Star className="w-3 h-3 fill-current" />
        </div>
        <span className="text-gray-600 text-sm">
          {product.views?.toLocaleString() || 0} views
        </span>
        {seller?.varificationStatus === "Verified" && (
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

        <div className="flex items-center gap-2 mt-2">
          <Package className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-gray-700">
            <span className="font-semibold">MOQ:</span> {product.moq || 100}
            {product.priceUnit}
          </span>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 mt-3">
          <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Bulk Pricing Available
          </p>
          <div className="text-xs text-blue-800 space-y-1">
            <div>• 500+ units: Get 5% discount</div>
            <div>• 1000+ units: Get 10% discount</div>
            <div>• 5000+ units: Get 15% discount</div>
          </div>
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

      <div className="pt-4 border-t">
        <label className="text-sm font-semibold text-gray-900 mb-2 block">
          Order Quantity ({product.priceUnit})
        </label>
        <input
          type="number"
          min={product.moq || 1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border-2 border-gray-300 rounded px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder={`Minimum ${product.moq || 100} units`}
        />
        <p className="text-xs text-gray-500 mt-1">
          Minimum order: {product.moq || 100} {product.priceUnit}
        </p>
      </div>

      <div className="space-y-3 pt-4">
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded shadow-sm transition-all flex items-center justify-center gap-2">
          <FileText className="w-5 h-5" />
          REQUEST QUOTATION
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2.5 rounded transition-all flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" />
            By Now
          </button>
          <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2.5 rounded transition-all flex items-center justify-center gap-2">
            <Package className="w-4 h-4" />
            Add to cart
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
        <p className="font-semibold mb-1">💡 Price Negotiable</p>
        <p>
          Final price depends on order quantity, customization, and delivery
          terms. Contact supplier for best quote.
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;
