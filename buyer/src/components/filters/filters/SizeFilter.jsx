const SizeFilter = ({ length, width, thickness, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Length (cm)</span>
          <span className="text-sm font-bold text-blue-600">
            {length[0]} - {length[1]} cm
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
              max={300}
              value={length[0]}
              onChange={(e) =>
                onChange("length", [parseInt(e.target.value), length[1]])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Max Length
            </label>
            <input
              type="range"
              min={0}
              max={300}
              value={length[1]}
              onChange={(e) =>
                onChange("length", [length[0], parseInt(e.target.value)])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Width (cm)</span>
          <span className="text-sm font-bold text-blue-600">
            {width[0]} - {width[1]} cm
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
              max={300}
              value={width[0]}
              onChange={(e) =>
                onChange("width", [parseInt(e.target.value), width[1]])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Max Width
            </label>
            <input
              type="range"
              min={0}
              max={300}
              value={width[1]}
              onChange={(e) =>
                onChange("width", [width[0], parseInt(e.target.value)])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Thickness (cm)
          </span>
          <span className="text-sm font-bold text-blue-600">
            {thickness[0]} - {thickness[1]} cm
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
              max={10}
              value={thickness[0]}
              onChange={(e) =>
                onChange("thickness", [parseInt(e.target.value), thickness[1]])
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
              min={0}
              max={10}
              value={thickness[1]}
              onChange={(e) =>
                onChange("thickness", [thickness[0], parseInt(e.target.value)])
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
