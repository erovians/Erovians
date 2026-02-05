import { Weight } from "lucide-react";

const WeightFilter = ({ weightMin, weightMax, onChange }) => {
  const minValue = weightMin || 0;
  const maxValue = weightMax || 1000;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Weight className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            Weight Range (kg)
          </span>
        </div>
        <span className="text-sm font-bold text-blue-600">
          {minValue} - {maxValue} kg
        </span>
      </div>

      <div className="space-y-4">
        {/* Min Weight Slider */}
        <div>
          <label className="block text-xs text-gray-600 mb-2">
            Min Weight (kg)
          </label>
          <input
            type="range"
            min={0}
            max={maxValue}
            value={minValue}
            onChange={(e) => onChange("weightMin", parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Max Weight Slider */}
        <div>
          <label className="block text-xs text-gray-600 mb-2">
            Max Weight (kg)
          </label>
          <input
            type="range"
            min={minValue}
            max={1000}
            value={maxValue}
            onChange={(e) => onChange("weightMax", parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Value Inputs */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500 block mb-1">Min (kg)</label>
          <input
            type="number"
            value={minValue}
            onChange={(e) =>
              onChange(
                "weightMin",
                Math.min(parseInt(e.target.value) || 0, maxValue)
              )
            }
            min={0}
            max={maxValue}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 block mb-1">Max (kg)</label>
          <input
            type="number"
            value={maxValue}
            onChange={(e) =>
              onChange(
                "weightMax",
                Math.max(parseInt(e.target.value) || 1000, minValue)
              )
            }
            min={minValue}
            max={1000}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default WeightFilter;
