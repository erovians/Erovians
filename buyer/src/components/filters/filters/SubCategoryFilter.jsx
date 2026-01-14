const SubCategoryFilter = ({ selected, onChange }) => {
  const subCategories = [
    "Marble",
    "Granite",
    "Limestone",
    "Sandstone",
    "Quartzite",
    "Onyx",
    "Travertine",
  ];

  return (
    <div className="space-y-3">
      {subCategories.map((subCategory) => (
        <label
          key={subCategory}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
        >
          <span className="text-sm font-medium text-gray-800">
            {subCategory}
          </span>
          <input
            type="checkbox"
            checked={selected.includes(subCategory)}
            onChange={() => {
              if (selected.includes(subCategory)) {
                onChange(selected.filter((c) => c !== subCategory));
              } else {
                onChange([...selected, subCategory]);
              }
            }}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </label>
      ))}
    </div>
  );
};

export default SubCategoryFilter;
