import React from "react";

const InquirySkeleton = () => {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg border border-gray-100 bg-white animate-pulse">
      {/* Left section: Checkbox and flag placeholders */}
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 bg-gray-200 rounded" />
        <div className="w-4 h-4 bg-gray-200 rounded" />
      </div>

      {/* Meta section */}
      <div className="w-72 flex flex-col gap-2">
        {/* ID and timestamps */}
        <div className="flex flex-col gap-1">
          <div className="h-3 bg-gray-200 rounded w-32" />
          <div className="h-2.5 bg-gray-200 rounded w-48" />
        </div>

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-1">
            <div className="h-3.5 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-5 bg-gray-200 rounded" />
            <div className="w-8 h-5 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Message section */}
      <div className="flex-1 px-4">
        <div className="h-3.5 bg-gray-200 rounded w-full max-w-md" />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <div className="h-3.5 bg-gray-200 rounded w-24" />
        <div className="h-6 bg-gray-200 rounded-full w-20" />
        <div className="h-8 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
};

export default InquirySkeleton;