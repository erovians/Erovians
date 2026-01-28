import React from "react";
import { Truck, Package, MapPin, Clock } from "lucide-react";

const ShippingInfoSection = ({ product, company }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5 text-blue-600" />
        Shipping & Logistics
      </h2>

      <div className="space-y-4">
        {/* Shipping Origin */}
        {company?.address && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Ships From
              </h3>
              <p className="text-sm text-gray-700">
                {company.address.city}, {company.address.stateOrProvince},{" "}
                {company.address.countryOrRegion}
              </p>
            </div>
          </div>
        )}

        {/* Estimated Delivery */}
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Estimated Delivery Time
            </h3>
            <p className="text-sm text-gray-700">
              {product?.shippingEstimate || "7-15 business days"} (varies by
              location and quantity)
            </p>
          </div>
        </div>

        {/* Packaging */}
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-gray-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Packaging
            </h3>
            <p className="text-sm text-gray-700">
              Products are carefully packaged with protective materials suitable
              for the material type. Heavy stone items use wooden crates with
              foam padding. Custom packaging available on request.
            </p>
          </div>
        </div>

        {/* Incoterms */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="text-sm font-bold text-blue-900 mb-2">
            Shipping Terms (Incoterms)
          </h3>
          <p className="text-sm text-blue-800 mb-2">
            Standard shipping terms: <strong>DAP (Delivered at Place)</strong>
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>
              • Seller arranges transport to your specified delivery address
            </li>
            <li>
              • Buyer responsible for unloading and customs duties (if
              international)
            </li>
            <li>
              • Other Incoterms (FOB, EXW, CIF) available - discuss in quotation
            </li>
          </ul>
        </div>

        {/* Contact for Details */}
        <div className="bg-gray-50 border border-gray-200 rounded p-3">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Exact shipping costs, delivery time, and
            terms depend on your location and order quantity. Request a
            quotation for accurate shipping details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoSection;
