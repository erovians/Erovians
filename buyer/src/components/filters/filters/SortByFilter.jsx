import { ArrowUpDown } from "lucide-react";

const SortByFilter = ({ selected, onChange }) => {
  const sortOptions = [
    { value: "priceAsc", label: "Price: Low to High", icon: "↑" },
    { value: "priceDesc", label: "Price: High to Low", icon: "↓" },
    { value: "newest", label: "Newest First", icon: "✨" },
    { value: "mostViewed", label: "Most Viewed", icon: "👁️" },
  ];

  return (
    <div className="space-y-3">
      {sortOptions.map((option) => (
        <label
          key={option.value}
          className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all has-checked:border-blue-600 has-checked:bg-blue-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{option.icon}</span>
            <div>
              <span className="block text-sm font-medium text-gray-800">
                {option.label}
              </span>
            </div>
          </div>
          <input
            type="radio"
            name="sortBy"
            value={option.value}
            checked={selected === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
        </label>
      ))}
    </div>
  );
};

export default SortByFilter;
