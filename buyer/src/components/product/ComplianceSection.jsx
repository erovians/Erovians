import React from "react";
import { Shield, CheckCircle2, FileCheck } from "lucide-react";

const ComplianceSection = ({ product }) => {
  // Check if product has compliance data
  const hasCompliance = product?.compliance;
  const hasCertifications = product?.certifications?.length > 0;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-green-600" />
        Compliance & Standards
      </h2>

      <div className="space-y-4">
        {/* Compliance Info */}
        {hasCompliance ? (
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Product Compliance
              </h3>
              <p className="text-sm text-gray-700">{product.compliance}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Product Compliance
              </h3>
              <p className="text-sm text-gray-600">
                Contact seller for detailed compliance and certification
                information
              </p>
            </div>
          </div>
        )}

        {/* Standard Compliance for Natural Stone */}
        {(product?.category?.includes("natural stones") ||
          product?.material?.toLowerCase().includes("stone") ||
          product?.material?.toLowerCase().includes("marble") ||
          product?.material?.toLowerCase().includes("granite")) && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="text-sm font-semibold text-green-900 mb-2">
              Natural Stone Standards
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Typically complies with EN 1469 (Natural stone slabs)</li>
              <li>• EN 1341 (Paving stones)</li>
              <li>• EN 12058 (Modular tiles)</li>
              <li>
                • Contact seller to confirm specific standards for this product
              </li>
            </ul>
          </div>
        )}

        {/* Certifications */}
        {hasCertifications && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.certifications.map((cert, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceSection;
