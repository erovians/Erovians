import React from "react";
import { Search } from "lucide-react";

const MAIN_TABS = [
  { id: "All", label: "All", countKey: "totalAll" },
  { id: "Sent", label: "Sent", countKey: null },
  { id: "Flagged", label: "Flagged", countKey: "totalFlagged" },
  { id: "Spam", label: "Spam", countKey: "totalSpam" },
  { id: "Deleted", label: "Deleted", countKey: "totalDeleted" },
];

const STATUS_TABS = [
  { id: "All", label: "All" },
  { id: "Pending for reply", label: "Pending for reply", countKey: "totalPending" },
  { id: "New inquiry", label: "New inquiry", countKey: "totalNew" },
];

const InquiryFilters = ({
  selectedTab,
  onTabChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  counts = {},
}) => {
  // Check if current tab is a main tab or status tab
  const isMainTab = MAIN_TABS.some((tab) => tab.id === selectedTab);
  const isStatusTab = STATUS_TABS.some((tab) => tab.id === selectedTab);

  return (
    <div className="border-b border-gray-200">
      {/* Top section with main tabs */}
      <div className="px-6 pt-4 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {MAIN_TABS.map((tab) => {
              const count = tab.countKey ? counts[tab.countKey] : null;
              const isActive = selectedTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-50 text-navyblue border border-blue-200"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-pressed={isActive}
                  aria-label={`${tab.label} tab${count > 0 ? `, ${count} items` : ""}`}
                >
                  {tab.label}

                  {count > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow min-w-[20px] text-center"
                      aria-label={`${count} ${tab.label.toLowerCase()}`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom section with status tabs and controls */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between gap-4">
          {/* Status filter tabs */}
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {STATUS_TABS.map((tab) => {
              const count = tab.countKey ? counts[tab.countKey] : null;
              const isActive = selectedTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-t ${
                    isActive
                      ? "border-b-2 border-navyblue text-gray-900 bg-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  aria-pressed={isActive}
                  aria-label={`${tab.label} filter${count > 0 ? `, ${count} items` : ""}`}
                >
                  {tab.label}
                  
                  {count > 0 && (
                    <span className="ml-1.5 text-xs text-gray-500 font-normal">
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right controls: Sort and Search */}
          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white cursor-pointer"
              aria-label="Sort inquiries"
            >
              <option value="Latest">Latest</option>
              <option value="Oldest">Oldest</option>
              <option value="Unread">Unread first</option>
            </select>

            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search inquiries..."
                className="w-64 pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navyblue focus:border-transparent"
                aria-label="Search inquiries"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Search"
                type="button"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryFilters;