import React, { useEffect, useState, useCallback } from "react";
import api from "@/utils/axios.utils";
import { Globe, Map, Search, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function CountryStateSelect({ formData, setFormData, errors }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Fetch all countries once
  useEffect(() => {
    (async () => {
      try {
        setFetchError(null);
        const res = await api.get("/location/countries");
        setCountries(res.data || []);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setFetchError("Failed to load countries. Please try again.");
      } finally {
        setLoadingCountries(false);
      }
    })();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const countryName = formData.address?.countryOrRegion;
    if (!countryName) {
      setStates([]);
      return;
    }

    const selectedCountry = countries.find((c) => c.name === countryName);
    if (!selectedCountry) {
      setStates([]);
      return;
    }

    (async () => {
      setLoadingStates(true);
      setFetchError(null);
      try {
        const res = await api.get(`/location/states/${selectedCountry.isoCode}`);
        setStates(res.data || []);
      } catch (err) {
        console.error("Error fetching states:", err);
        setFetchError("Failed to load states. Please try again.");
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    })();
  }, [formData.address?.countryOrRegion, countries]);

  // Handle country change
  const handleCountryChange = useCallback((value) => {
    setFormData((prev) => ({
      ...prev,
      address: { 
        ...(prev.address || {}), 
        countryOrRegion: value,
        stateOrProvince: "" // Reset state when country changes
      },
    }));
  }, [setFormData]);

  // Handle state change
  const handleStateChange = useCallback((value) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...(prev.address || {}), stateOrProvince: value },
    }));
  }, [setFormData]);

  // Clear search when dropdown closes
  useEffect(() => {
    if (!countryDropdownOpen) {
      setCountrySearch("");
    }
  }, [countryDropdownOpen]);

  useEffect(() => {
    if (!stateDropdownOpen) {
      setStateSearch("");
    }
  }, [stateDropdownOpen]);

  // Filter lists
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );
  
  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Country */}
      <div className="flex flex-col">
        <label className="flex gap-2 font-medium text-gray-700 text-sm mb-2 items-center">
          Country / Region
          <span className="text-red-500">*</span>
        </label>

        <Select
          value={formData.address?.countryOrRegion || ""}
          onValueChange={handleCountryChange}
          onOpenChange={setCountryDropdownOpen}
          disabled={loadingCountries}
        >
          <SelectTrigger
            className={`w-full p-6 text-sm border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
              errors["address.countryOrRegion"]
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loadingCountries ? (
              <span className="flex items-center gap-2 text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                Loading countries...
              </span>
            ) : (
              <SelectValue placeholder="Select country" />
            )}
          </SelectTrigger>

          <SelectContent className="bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
            {/* Search bar */}
            <div className="p-2 border-b flex items-center gap-2 sticky top-0 bg-white z-10">
              <Search size={16} className="text-gray-400" />
              <Input
                placeholder="Search country..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="h-8 text-sm border-none focus:ring-0 focus-visible:ring-0"
                onClick={(e) => e.stopPropagation()}
              />
              {countrySearch && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCountrySearch("");
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                  aria-label="Clear search"
                >
                  <X size={14} className="text-gray-500" />
                </button>
              )}
            </div>

            <SelectGroup className="overflow-y-auto max-h-64">
              {fetchError ? (
                <div className="text-center text-red-500 text-sm py-3 px-4">
                  {fetchError}
                </div>
              ) : filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <SelectItem
                    key={country.isoCode}
                    value={country.name}
                    className="cursor-pointer hover:bg-gray-100 px-3 py-2.5 focus:bg-blue-50"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span className="text-sm">{country.name}</span>
                    </span>
                  </SelectItem>
                ))
              ) : (
                <div className="text-center text-gray-500 text-sm py-6 px-4">
                  {countrySearch ? (
                    <>
                      No countries found matching <strong>"{countrySearch}"</strong>
                    </>
                  ) : (
                    "No countries available"
                  )}
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        {errors["address.countryOrRegion"] && (
          <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
            <span>⚠</span>
            <span>{errors["address.countryOrRegion"]}</span>
          </p>
        )}
      </div>

      {/* State */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
          State / Province
          <span className="text-red-500">*</span>
        </label>

        <Select
          value={formData.address?.stateOrProvince || ""}
          onValueChange={handleStateChange}
          onOpenChange={setStateDropdownOpen}
          disabled={!formData.address?.countryOrRegion || loadingStates}
        >
          <SelectTrigger
            className={`w-full p-6 text-sm border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
              errors["address.stateOrProvince"]
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {!formData.address?.countryOrRegion ? (
              <span className="text-gray-400">Select country first</span>
            ) : loadingStates ? (
              <span className="flex items-center gap-2 text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                Loading states...
              </span>
            ) : (
              <SelectValue placeholder="Select state" />
            )}
            
          </SelectTrigger>

          <SelectContent className="bg-white border rounded-lg shadow-lg max-h-80 overflow-hidden">
            {/* Search bar */}
            <div className="p-2 border-b flex items-center gap-2 sticky top-0 bg-white z-10">
              <Search size={16} className="text-gray-400" />
              <Input
                placeholder="Search state..."
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                className="h-8 text-sm border-none focus:ring-0 focus-visible:ring-0"
                onClick={(e) => e.stopPropagation()}
              />
              {stateSearch && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStateSearch("");
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                  aria-label="Clear search"
                >
                  <X size={14} className="text-gray-500" />
                </button>
              )}
            </div>

            <SelectGroup className="overflow-y-auto max-h-64">
              {fetchError ? (
                <div className="text-center text-red-500 text-sm py-3 px-4">
                  {fetchError}
                </div>
              ) : filteredStates.length > 0 ? (
                filteredStates.map((state) => (
                  <SelectItem
                    key={state.isoCode}
                    value={state.name}
                    className="cursor-pointer hover:bg-gray-100 px-3 py-2.5 focus:bg-blue-50"
                  >
                    <span className="text-sm">{state.name}</span>
                  </SelectItem>
                ))
              ) : (
                <div className="text-center text-gray-500 text-sm py-6 px-4">
                  {stateSearch ? (
                    <>
                      No states found matching <strong>"{stateSearch}"</strong>
                    </>
                  ) : states.length === 0 ? (
                    "No states available for this country"
                  ) : (
                    "No states available"
                  )}
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        {errors["address.stateOrProvince"] && (
          <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
            <span>⚠</span>
            <span>{errors["address.stateOrProvince"]}</span>
          </p>
        )}
      </div>
    </div>
  );
}