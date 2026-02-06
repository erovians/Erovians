import React from "react";

const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
        {/* Dotted Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0c2c43] rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-gray-100 border-t-[#1a4361] rounded-full animate-spin animation-delay-150"></div>
          </div>
        </div>
        {/* Message */}
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
