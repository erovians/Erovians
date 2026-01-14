const CategoryFilter = ({ selected, onChange }) => {
  const categories = [
    "Natural Stones",
    "Ceramic & Tiles",
    "Alternatives & Finishes",
  ];

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <label
          key={category}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
        >
          <span className="text-sm font-medium text-gray-800">{category}</span>
          <input
            type="checkbox"
            checked={selected.includes(category)}
            onChange={() => {
              if (selected.includes(category)) {
                onChange(selected.filter((c) => c !== category));
              } else {
                onChange([...selected, category]);
              }
            }}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </label>
      ))}
    </div>
  );
};

export default CategoryFilter;
