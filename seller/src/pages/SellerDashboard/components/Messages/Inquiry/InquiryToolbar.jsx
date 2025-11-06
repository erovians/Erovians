import React, { useState } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";

const InquiryToolbar = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDelete,
  onReportSpam,
  statusFilter,
  onStatusFilterChange
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const allSelected = selectedCount === totalCount && totalCount > 0;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div className="px-6 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        {/* Left side: Bulk actions */}
        <div className="flex items-center gap-3">
          {/* Select all checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={allSelected}
              ref={input => {
                if (input) {
                  input.indeterminate = someSelected;
                }
              }}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
            />
          </div>

          {/* Delete button */}
          <button
            onClick={onDelete}
            disabled={selectedCount === 0}
            className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
              selectedCount === 0
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Delete
          </button>

          {/* Report spam button */}
          <button
            onClick={onReportSpam}
            disabled={selectedCount === 0}
            className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
              selectedCount === 0
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Report spam
          </button>

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              More
              <ChevronDown className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <button
                    onClick={() => {
                      console.log("Mark as read");
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Mark as read
                  </button>
                  <button
                    onClick={() => {
                      console.log("Mark as unread");
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Mark as unread
                  </button>
                  <button
                    onClick={() => {
                      console.log("Move to folder");
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Move to folder
                  </button>
                  <button
                    onClick={() => {
                      console.log("Export selected");
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                  >
                    Export selected
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Show only checkbox */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={showOnlyUnread}
              onChange={(e) => setShowOnlyUnread(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            Show only unread
          </label>
        </div>

        {/* Right side: Selection count */}
        {selectedCount > 0 && (
          <div className="text-sm text-gray-600">
            {selectedCount} selected
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryToolbar;