import { X } from "lucide-react";

const FilterBottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  onApply,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl shadow-2xl transform transition-transform duration-300 max-h-[85vh] flex flex-col lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* Footer with 3 Buttons */}
        <div className="border-t border-gray-200 p-4 flex gap-3">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          {/* Clear All Button - NEW */}
          <button
            onClick={() => {
              onClearAll();
              onClose();
            }}
            className="flex-1 py-3 border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Clear All
          </button>

          {/* Apply Button */}
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterBottomSheet;
