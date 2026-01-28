const SizeFilter = ({
  lengthMin,
  lengthMax,
  widthMin,
  widthMax,
  thicknessMin,
  thicknessMax,
  onChange,
}) => {
  const minLength = lengthMin || 0;
  const maxLength = lengthMax || 100;
  const minWidth = widthMin || 0;
  const maxWidth = widthMax || 100;
  const minThickness = thicknessMin || 0;
  const maxThickness = thicknessMax || 10;

  return (
    <div className="space-y-6">
      {/* Length Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Length (ft)</span>
          <span className="text-sm font-bold text-blue-600">
            {minLength} - {maxLength} ft
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Min Length
            </label>
            <input
              type="range"
              min={0}
              max={maxLength}
              value={minLength}
              onChange={(e) => onChange("lengthMin", parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Max Length
            </label>
            <input
              type="range"
              min={minLength}
              max={100}
              value={maxLength}
              onChange={(e) => onChange("lengthMax", parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Width Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Width (ft)</span>
          <span className="text-sm font-bold text-blue-600">
            {minWidth} - {maxWidth} ft
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Min Width
            </label>
            <input
              type="range"
              min={0}
              max={maxWidth}
              value={minWidth}
              onChange={(e) => onChange("widthMin", parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Max Width
            </label>
            <input
              type="range"
              min={minWidth}
              max={100}
              value={maxWidth}
              onChange={(e) => onChange("widthMax", parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Thickness Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Thickness (inch)
          </span>
          <span className="text-sm font-bold text-blue-600">
            {minThickness} - {maxThickness} inch
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Min Thickness
            </label>
            <input
              type="range"
              min={0}
              max={maxThickness}
              value={minThickness}
              onChange={(e) =>
                onChange("thicknessMin", parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Max Thickness
            </label>
            <input
              type="range"
              min={minThickness}
              max={10}
              value={maxThickness}
              onChange={(e) =>
                onChange("thicknessMax", parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeFilter;
