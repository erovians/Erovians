import React from "react";
import { Award, Calendar, Info } from "lucide-react";

const WarrantySection = ({ product, seller }) => {
  // Check if custom warranty exists
  const hasWarranty = product?.warranty;
  const isB2C = seller?.seller_status !== "business"; // Assume B2C if not business

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-blue-600" />
        Warranty & Guarantee
      </h2>

      <div className="space-y-4">
        {/* Legal Warranty (B2C) */}
        {isB2C && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-blue-900 mb-1">
                  2-Year Legal Guarantee (EU B2C)
                </h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  For consumer transactions within the EU, this product is
                  covered by a mandatory 2-year legal guarantee under Directive
                  (EU) 2019/771. The seller is responsible for any lack of
                  conformity that exists at the time of delivery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Custom Warranty */}
        {hasWarranty && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Seller Warranty
            </h3>
            <p className="text-sm text-gray-700">{product.warranty}</p>
          </div>
        )}

        {/* Warranty Info */}
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <strong>What's covered:</strong> Manufacturing defects, material
              non-conformity, and quality issues present at delivery.
            </p>
            <p>
              <strong>Not covered:</strong> Normal wear and tear, damage from
              improper installation, modifications, or natural characteristics
              of stone materials.
            </p>
          </div>
        </div>

        {/* Contact for Details */}
        {!hasWarranty && (
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <p className="text-sm text-gray-700">
              For detailed warranty terms and conditions, please contact the
              seller directly or request this information when getting a
              quotation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarrantySection;
