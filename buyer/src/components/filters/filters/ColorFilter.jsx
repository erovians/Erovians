const ColorFilter = ({ selected, onChange }) => {
  const colors = [
    "White",
    "Black",
    "Grey",
    "Beige",
    "Brown",
    "Red",
    "Green",
    "Blue",
    "Yellow",
    "Pink",
  ];

  return (
    <div className="space-y-3">
      {colors.map((color) => (
        <label
          key={color}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: color.toLowerCase() }}
            />
            <span className="text-sm font-medium text-gray-800">{color}</span>
          </div>
          <input
            type="checkbox"
            checked={selected.includes(color)}
            onChange={() => {
              if (selected.includes(color)) {
                onChange(selected.filter((c) => c !== color));
              } else {
                onChange([...selected, color]);
              }
            }}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </label>
      ))}
    </div>
  );
};

export default ColorFilter;
