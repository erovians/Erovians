import { MapPin } from "lucide-react";

const LocationFilter = ({ country, state, city, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Country</span>
          </div>
        </label>
        <input
          type="text"
          value={country}
          onChange={(e) => onChange("country", e.target.value)}
          placeholder="Enter country"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State
        </label>
        <input
          type="text"
          value={state}
          onChange={(e) => onChange("state", e.target.value)}
          placeholder="Enter state"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => onChange("city", e.target.value)}
          placeholder="Enter city"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default LocationFilter;
