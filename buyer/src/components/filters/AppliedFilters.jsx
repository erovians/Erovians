import { X } from "lucide-react";

const AppliedFilters = ({ filters, onRemove, onClearAll }) => {
  const getAppliedFiltersArray = () => {
    const applied = [];

    filters.mainCategory.forEach((cat) => {
      applied.push({ type: "mainCategory", value: cat, label: cat });
    });

    if (filters.country) {
      applied.push({
        type: "country",
        value: filters.country,
        label: filters.country,
      });
    }
    if (filters.state) {
      applied.push({
        type: "state",
        value: filters.state,
        label: filters.state,
      });
    }
    if (filters.city) {
      applied.push({ type: "city", value: filters.city, label: filters.city });
    }

    filters.paymentMethods.forEach((pm) => {
      applied.push({ type: "paymentMethods", value: pm, label: pm });
    });

    filters.currency.forEach((curr) => {
      applied.push({ type: "currency", value: curr, label: curr });
    });

    filters.language.forEach((lang) => {
      applied.push({ type: "language", value: lang, label: lang });
    });

    return applied;
  };

  const appliedFilters = getAppliedFiltersArray();

  if (appliedFilters.length === 0) return null;

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 lg:hidden">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-600">Applied:</span>
        {appliedFilters.map((filter, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
          >
            {filter.label}
            <button
              onClick={() => onRemove(filter.type, filter.value)}
              className="hover:bg-blue-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-red-600 hover:text-red-700 ml-2"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default AppliedFilters;
