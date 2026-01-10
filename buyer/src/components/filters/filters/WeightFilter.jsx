import { Weight } from "lucide-react";

const WeightFilter = ({ weightRange, weightUnit, onChange }) => {
  const maxWeight = weightUnit === "kg" ? 1000 : 100;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Weight Unit
        </label>
        <div className="flex gap-3">
          <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all has-:checked:border-blue-600 has-:checked:bg-blue-50">
            <input
              type="radio"
              name="weightUnit"
              value="kg"
              checked={weightUnit === "kg"}
              onChange={(e) => onChange("unit", e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <Weight className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Kilogram</span>
          </label>
          <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all has-:checked:border-blue-600 has-:checked:bg-blue-50">
            <input
              type="radio"
              name="weightUnit"
              value="ton"
              checked={weightUnit === "ton"}
              onChange={(e) => onChange("unit", e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <Weight className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Ton</span>
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Weight Range
          </span>
          <span className="text-sm font-bold text-blue-600">
            {weightRange[0]} - {weightRange[1]} {weightUnit}
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Min Weight
            </label>
            <input
              type="range"
              min={0}
              max={maxWeight}
              value={weightRange[0]}
              onChange={(e) =>
                onChange("range", [parseInt(e.target.value), weightRange[1]])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Max Weight
            </label>
            <input
              type="range"
              min={0}
              max={maxWeight}
              value={weightRange[1]}
              onChange={(e) =>
                onChange("range", [weightRange[0], parseInt(e.target.value)])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightFilter;
