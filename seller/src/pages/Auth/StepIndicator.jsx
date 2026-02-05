import React from "react";
import { Check } from "lucide-react";

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="flex justify-between items-center mb-8 text-xs sm:text-sm font-semibold text-gray-600">
      {steps.map((item) => (
        <div key={item.id} className="flex flex-col items-center flex-1">
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
              currentStep >= item.id
                ? "border-[#0c2c43] bg-[#0c2c43] text-white"
                : "border-gray-300 text-gray-400"
            }`}
          >
            {currentStep > item.id ? (
              <Check size={14} className="sm:w-4 sm:h-4" />
            ) : (
              item.id
            )}
          </div>
          <span className="mt-2 text-center text-[10px] sm:text-xs md:text-sm">
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
