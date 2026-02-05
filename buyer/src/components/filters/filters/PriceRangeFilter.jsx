import { TrendingUp } from "lucide-react";

const PriceRangeFilter = ({ priceMin, priceMax, onChange }) => {
  const minValue = priceMin || 0;
  const maxValue = priceMax || 500;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Price Range</span>
        </div>
        <span className="text-sm font-bold text-blue-600">
          ₹{minValue} - ₹{maxValue}
        </span>
      </div>

      <div className="space-y-4">
        {/* Min Price Slider */}
        <div>
          <label className="block text-xs text-gray-600 mb-2">
            Minimum Price (₹)
          </label>
          <input
            type="range"
            min={0}
            max={maxValue}
            value={minValue}
            onChange={(e) => onChange("priceMin", parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                (minValue / 500) * 100
              }%, #E5E7EB ${(minValue / 500) * 100}%, #E5E7EB 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹0</span>
            <span>₹{minValue}</span>
          </div>
        </div>

        {/* Max Price Slider */}
        <div>
          <label className="block text-xs text-gray-600 mb-2">
            Maximum Price (₹)
          </label>
          <input
            type="range"
            min={minValue}
            max={500}
            value={maxValue}
            onChange={(e) => onChange("priceMax", parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            style={{
              background: `linear-gradient(to right, #E5E7EB 0%, #E5E7EB ${
                (maxValue / 500) * 100
              }%, #3B82F6 ${(maxValue / 500) * 100}%, #3B82F6 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹{minValue}</span>
            <span>₹{maxValue}</span>
          </div>
        </div>
      </div>

      {/* Value Inputs */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500 block mb-1">Min (₹)</label>
          <input
            type="number"
            value={minValue}
            onChange={(e) =>
              onChange(
                "priceMin",
                Math.min(parseInt(e.target.value) || 0, maxValue)
              )
            }
            min={0}
            max={maxValue}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 block mb-1">Max (₹)</label>
          <input
            type="number"
            value={maxValue}
            onChange={(e) =>
              onChange(
                "priceMax",
                Math.max(parseInt(e.target.value) || 500, minValue)
              )
            }
            min={minValue}
            max={500}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
