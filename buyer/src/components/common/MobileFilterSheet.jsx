// src/components/Sidebar/MobileFilterSheet.jsx
import { X, SlidersHorizontal } from "lucide-react";

const MobileFilterSheet = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-50 rounded-t-2xl shadow-2xl transform transition-transform duration-300 lg:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5 text-navyblue" />
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {children}
          </div>

          {/* Apply Button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <button
              onClick={onClose}
              className="w-full bg-navyblue hover:bg-blue text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileFilterSheet;
