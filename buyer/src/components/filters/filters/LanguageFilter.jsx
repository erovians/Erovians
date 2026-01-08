const LanguageFilter = ({ selected, onChange }) => {
  const languages = ["English", "Hindi", "Spanish", "Chinese", "Arabic"];

  return (
    <div className="space-y-3">
      {languages.map((language) => (
        <label
          key={language}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-all"
        >
          <span className="text-sm font-medium text-gray-800">{language}</span>
          <input
            type="checkbox"
            checked={selected.includes(language)}
            onChange={() => {
              if (selected.includes(language)) {
                onChange(selected.filter((l) => l !== language));
              } else {
                onChange([...selected, language]);
              }
            }}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </label>
      ))}
    </div>
  );
};

export default LanguageFilter;
