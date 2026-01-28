import {
  SlidersHorizontal,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  ChevronDown,
  Layers,
  Award,
  Palette,
  Ruler,
  Weight,
  Tag,
  Sparkles,
  MapPinned,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";

const FilterPillsBar = ({ type = "company", activeFilters, onPillClick }) => {
  const companyPills = [
    { id: "category", label: "Category", icon: Building2 },
    { id: "subCategory", label: "Sub Category", icon: Layers },
    { id: "location", label: "Location", icon: MapPin },
    { id: "year", label: "Year", icon: Calendar },
    { id: "payment", label: "Payment", icon: DollarSign },
    { id: "currency", label: "Currency", icon: DollarSign },
    { id: "language", label: "Language", icon: Globe },
  ];

  const productPills = [
    { id: "sortBy", label: "Sort By", icon: ArrowUpDown }, // ✅ NEW
    { id: "category", label: "Category", icon: Building2 },
    { id: "subCategory", label: "Sub Category", icon: Layers },
    { id: "grade", label: "Grade", icon: Award },
    { id: "color", label: "Color", icon: Palette },
    { id: "origin", label: "Origin", icon: MapPinned }, // ✅ NEW
    { id: "priceRange", label: "Price Range", icon: TrendingUp }, // ✅ NEW
    { id: "size", label: "Size", icon: Ruler },
    { id: "weight", label: "Weight", icon: Weight },
    { id: "newArrivals", label: "New", icon: Sparkles },
  ];

  const filterPills = type === "company" ? companyPills : productPills;

  const getFilterCount = (filterId) => {
    switch (filterId) {
      case "sortBy": // ✅ NEW
        return activeFilters.sortBy ? 1 : 0;
      case "category":
        return type === "company"
          ? activeFilters.mainCategory?.length || 0
          : activeFilters.category?.length || 0;
      case "subCategory":
        return activeFilters.subCategory?.length || 0;
      case "location":
        return [
          activeFilters.country,
          activeFilters.state,
          activeFilters.city,
        ].filter(Boolean).length;
      case "payment":
        return activeFilters.paymentMethods?.length || 0;
      case "currency":
        return activeFilters.currency?.length || 0;
      case "language":
        return activeFilters.language?.length || 0;
      case "grade":
        return activeFilters.grade?.length || 0;
      case "color":
        return activeFilters.color?.length || 0;
      case "origin": // ✅ NEW
        return activeFilters.origin ? 1 : 0;
      case "priceRange": // ✅ NEW
        return activeFilters.priceMin || activeFilters.priceMax ? 1 : 0;
      case "size":
        return activeFilters.lengthMin ||
          activeFilters.lengthMax ||
          activeFilters.widthMin ||
          activeFilters.widthMax ||
          activeFilters.thicknessMin ||
          activeFilters.thicknessMax
          ? 1
          : 0;
      case "weight":
        return activeFilters.weightMin || activeFilters.weightMax ? 1 : 0;
      case "newArrivals":
        return activeFilters.newArrivals ? 1 : 0;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed mt-14 top-20 left-0 right-0 bg-white border-b border-gray-200 z-30 lg:hidden shadow-sm">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 px-4 py-3 min-w-max">
          {filterPills.map((pill) => {
            const Icon = pill.icon;
            const count = getFilterCount(pill.id);
            return (
              <button
                key={pill.id}
                onClick={() => onPillClick(pill.id)}
                className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-full hover:border-blue-600 hover:bg-blue-50 transition-all"
              >
                <Icon className="w-4 h-4 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                  {pill.label}
                </span>
                {count > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
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
