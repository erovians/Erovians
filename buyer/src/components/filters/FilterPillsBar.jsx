import {
  SlidersHorizontal,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  ChevronDown,
} from "lucide-react";

const FilterPillsBar = ({ activeFilters, onPillClick }) => {
  const filterPills = [
    { id: "category", label: "Category", icon: Building2 },
    { id: "location", label: "Location", icon: MapPin },
    { id: "year", label: "Year", icon: Calendar },
    { id: "payment", label: "Payment", icon: DollarSign },
    { id: "currency", label: "Currency", icon: DollarSign },
    { id: "language", label: "Language", icon: Globe },
  ];

  const getFilterCount = (filterId) => {
    switch (filterId) {
      case "category":
        return activeFilters.mainCategory.length;
      case "location":
        return [
          activeFilters.country,
          activeFilters.state,
          activeFilters.city,
        ].filter(Boolean).length;
      case "payment":
        return activeFilters.paymentMethods.length;
      case "currency":
        return activeFilters.currency.length;
      case "language":
        return activeFilters.language.length;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed mt-14 top-[80px] left-0 right-0 bg-white border-b border-gray-200 z-30 lg:hidden shadow-sm">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 px-4 py-3 min-w-max">
          {filterPills.map((pill) => {
            const Icon = pill.icon;
            const count = getFilterCount(pill.id);
            return (
              <button
                key={pill.id}
                onClick={() => onPillClick(pill.id)}
                className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-full hover:border-navyblue hover:bg-blue-50 transition-all"
              >
                <Icon className="w-4 h-4 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                  {pill.label}
                </span>
                {count > 0 && (
                  <span className="bg-navyblue text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                    {count}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterPillsBar;
