const LocationFilter = ({ filters, onChange }) => {
  const countries = ["India", "China", "Italy", "Turkey", "Brazil"];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country
        </label>
        <select
          value={filters.country}
          onChange={(e) => onChange({ ...filters, country: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State/Province
        </label>
        <input
          type="text"
          placeholder="Enter state"
          value={filters.state}
          onChange={(e) => onChange({ ...filters, state: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <input
          type="text"
          placeholder="Enter city"
          value={filters.city}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default LocationFilter;
