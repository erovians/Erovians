import React from "react";
import { AlertTriangle } from "lucide-react";

const NaturalStoneClause = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-5 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <h3 className="text-base font-bold text-amber-900 mb-2">
            Natural Stone Characteristics
          </h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            Natural variations in color, veining, texture, porosity, and grain
            structure are inherent characteristics of natural stone products
            (marble, granite, sandstone, limestone, quartzite). These variations
            are <strong>NOT considered defects</strong>. Each piece is unique,
            and slight differences from product images are normal and expected.
            Natural stone may also contain natural fissures, pits, and color
            variations that add to its authentic beauty.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NaturalStoneClause;
