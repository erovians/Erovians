const YearFilter = ({ yearRange, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Year Range</span>
        <span className="text-sm font-bold text-blue-600">
          {yearRange[0]} - {yearRange[1]}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-2">From Year</label>
          <input
            type="range"
            min={1990}
            max={2025}
            value={yearRange[0]}
            onChange={(e) => onChange([parseInt(e.target.value), yearRange[1]])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-2">To Year</label>
          <input
            type="range"
            min={1990}
            max={2025}
            value={yearRange[1]}
            onChange={(e) => onChange([yearRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

export default YearFilter;
