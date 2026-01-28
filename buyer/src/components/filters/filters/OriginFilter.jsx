import { MapPinned } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { useState, useEffect } from "react";

const OriginFilter = ({ origin, onChange }) => {
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  // Update states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry);
      setAvailableStates(states);
      setAvailableCities([]);
      setSelectedState("");
    } else {
      setAvailableStates([]);
      setAvailableCities([]);
    }
  }, [selectedCountry]);

  // Update cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState);
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry, selectedState]);

  return (
    <div className="space-y-4">
      {/* Country Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <MapPinned className="w-4 h-4 text-blue-600" />
            <span>Origin Country</span>
          </div>
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => {
            const countryCode = e.target.value;
            setSelectedCountry(countryCode);
            const country = countries.find((c) => c.isoCode === countryCode);
            onChange(country?.name || "");
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Select Origin Country</option>
          {countries.map((country) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* State Dropdown (Optional) */}
      {selectedCountry && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Origin State (Optional)
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              const stateCode = e.target.value;
              setSelectedState(stateCode);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Select State</option>
            {availableStates.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* City Dropdown (Optional) */}
      {selectedState && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Origin City (Optional)
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
            <option value="">Select City</option>
            {availableCities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default OriginFilter;
