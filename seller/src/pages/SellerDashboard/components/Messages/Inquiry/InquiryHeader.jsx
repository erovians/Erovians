import React from "react";
import { Info } from "lucide-react";

const Metric = ({ label, value, unit = "", isHighlight = false, hasInfo = false }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-1 mb-1">
      <span className={`text-xs ${isHighlight ? "text-gray-700" : "text-gray-500"}`}>
        {label}
      </span>
      {hasInfo && <Info className="w-3 h-3 text-gray-400" />}
    </div>
    <span className={`text-lg font-semibold ${isHighlight ? "text-red-600" : "text-gray-800"}`}>
      {value}
      {unit && <span className="text-sm ml-0.5">{unit}</span>}
    </span>
  </div>
);

const InquiryHeader = () => {
  // These values should come from props or Redux state in production
  const receptionData = {
    quickResponse: 100,
    industryRate: 78.39,
    myResponseTime: 0,
    storeResponseTime: 0,
    dailyResponse: 100,
    storeResponseRate: 100
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-900">All Inquiries</h1>

      {/* Reception data card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-base font-medium text-gray-900">Reception data</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              <Info className="w-4 h-4" />
              Learn more
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              View detailed data
            </button>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <Metric
            label="Quick response..."
            value={receptionData.quickResponse}
            unit="%"
            isHighlight={false}
            hasInfo={true}
          />
          <Metric
            label="Quick response rate of industry l..."
            value={receptionData.industryRate}
            unit="%"
          />
          <Metric
            label="My response ..."
            value={receptionData.myResponseTime}
            unit=" hrs"
            isHighlight={true}
            hasInfo={true}
          />
          <Metric
            label="Store response ..."
            value={receptionData.storeResponseTime}
            unit=" hrs"
          />
          <Metric
            label="Daily response..."
            value={receptionData.dailyResponse}
            unit="%"
            hasInfo={true}
          />
          <Metric
            label="Store response..."
            value={receptionData.storeResponseRate}
            unit="%"
          />
        </div>
      </div>
    </div>
  );
};

export default InquiryHeader;