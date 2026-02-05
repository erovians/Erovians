import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAddress,
  clearError,
  clearSuccess,
} from "../../lib/redux/auth/authSlice";
import { MapPin, Edit2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Country, State, City } from "country-state-city";
import * as Dialog from "@radix-ui/react-dialog";

const AddressManager = ({ user }) => {
  const dispatch = useDispatch();

  // ✅ Use addressLoading instead of loading
  const { addressLoading, error, success, message } = useSelector(
    (state) => state.auth
  );

  const [addressType, setAddressType] = useState("billing");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    city: "",
    state: "",
    country: "",
    alternateMobile: "",
    landmark: "",
    pincode: "",
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry));
      setSelectedState(null);
      setCities([]);
      setFormData((prev) => ({ ...prev, state: "", city: "" }));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      setCities(City.getCitiesOfState(selectedCountry, selectedState));
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  }, [selectedState]);

  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearSuccess());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, message, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    setModalMode("add");
    setEditingIndex(null);
    setSelectedCountry(null);
    setSelectedState(null);
    setStates([]);
    setCities([]);
    setFormData({
      name: "",
      mobile: "",
      city: "",
      state: "",
      country: "",
      alternateMobile: "",
      landmark: "",
      pincode: "",
    });
    setIsAddressModalOpen(true);
  };

  const handleEdit = (address, index) => {
    setModalMode("edit");
    setEditingIndex(index);

    const country = countries.find((c) => c.name === address.country);
    if (country) {
      setSelectedCountry(country.isoCode);
      const countryStates = State.getStatesOfCountry(country.isoCode);
      setStates(countryStates);

      const state = countryStates.find((s) => s.name === address.state);
      if (state) {
        setSelectedState(state.isoCode);
        setCities(City.getCitiesOfState(country.isoCode, state.isoCode));
      }
    }

    setFormData({
      name: address.name || "",
      mobile: address.mobile || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "",
      alternateMobile: address.alternateMobile || "",
      landmark: address.landmark || "",
      pincode: address.pincode || "",
    });
    setIsAddressModalOpen(true);
  };

  const resetModal = () => {
    setSelectedCountry(null);
    setSelectedState(null);
    setStates([]);
    setCities([]);
    setFormData({
      name: "",
      mobile: "",
      city: "",
      state: "",
      country: "",
      alternateMobile: "",
      landmark: "",
      pincode: "",
    });
    setEditingIndex(null);
  };

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.mobile ||
      !formData.city ||
      !formData.state ||
      !formData.country ||
      !formData.pincode
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const actionType = modalMode === "add" ? "add" : "edit";

    try {
      await dispatch(
        updateAddress({
          type: addressType,
          action: actionType,
          data: formData,
          index: editingIndex,
        })
      ).unwrap();

      setIsAddressModalOpen(false);
      resetModal();
    } catch (err) {
      // Error handled by useEffect
    }
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await dispatch(
        updateAddress({
          type: addressType,
          action: "delete",
          data: null,
          index,
        })
      ).unwrap();
    }
  };

  const addresses =
    addressType === "billing"
      ? user.buyer_data?.billing_address || []
      : user.buyer_data?.shipping_address || [];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              Manage Addresses
            </h2>
            <button
              onClick={handleAddNew}
              className="self-start sm:self-auto text-black hover:text-blue-700 flex items-center gap-2 text-sm md:text-base font-medium hover:bg-blue-50 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          </div>

          <div className="flex gap-1 sm:gap-2 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setAddressType("billing")}
              className={`px-3 sm:px-4 md:px-5 py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-semibold transition-all whitespace-nowrap ${
                addressType === "billing"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Billing ({user.buyer_data?.billing_address?.length || 0})
            </button>
            <button
              onClick={() => setAddressType("shipping")}
              className={`px-3 sm:px-4 md:px-5 py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-semibold transition-all whitespace-nowrap ${
                addressType === "shipping"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Shipping ({user.buyer_data?.shipping_address?.length || 0})
            </button>
          </div>
        </div>

        {/* ✅ Show loading ONLY for address section */}
        {addressLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : addresses.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {addresses.map((address, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg md:rounded-xl p-3 sm:p-4 hover:border-blue-300 transition-colors relative"
              >
                <div className="space-y-1.5 md:space-y-2 text-xs sm:text-sm text-gray-700 mb-3 md:mb-4">
                  {address.name && (
                    <p className="wrap-break-words">
                      <span className="font-semibold text-gray-900">Name:</span>{" "}
                      {address.name}
                    </p>
                  )}
                  {address.mobile && (
                    <p className="break-all">
                      <span className="font-semibold text-gray-900">
                        Mobile:
                      </span>{" "}
                      {address.mobile}
                    </p>
                  )}
                  {address.alternateMobile && (
                    <p className="break-all">
                      <span className="font-semibold text-gray-900">
                        Alternate Mobile:
                      </span>{" "}
                      {address.alternateMobile}
                    </p>
                  )}
                  {address.landmark && (
                    <p className="wrap-break-words">
                      <span className="font-semibold text-gray-900">
                        Landmark:
                      </span>{" "}
                      {address.landmark}
                    </p>
                  )}
                  <p className="wrap-break-words">
                    {address.city && `${address.city}, `}
                    {address.state && `${address.state}, `}
                    {address.country}
                  </p>
                  {address.pincode && (
                    <p>
                      <span className="font-semibold text-gray-900">
                        Pincode:
                      </span>{" "}
                      {address.pincode}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  <button
                    onClick={() => handleEdit(address, index)}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <MapPin className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-gray-500 text-xs sm:text-sm mb-3 md:mb-4 px-4">
              No {addressType === "billing" ? "billing" : "shipping"} addresses
              saved yet
            </p>
            <button
              onClick={handleAddNew}
              className="text-black hover:text-blue-700 font-medium inline-flex items-center gap-2 text-sm md:text-base hover:bg-blue-50 px-4 md:px-5 py-2 md:py-2.5 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>
                Add Your First{" "}
                {addressType === "billing" ? "Billing" : "Shipping"} Address
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Address Add/Edit Modal */}
      <Dialog.Root
        open={isAddressModalOpen}
        onOpenChange={(open) => {
          setIsAddressModalOpen(open);
          if (!open) resetModal();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-5 md:p-6 overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <Dialog.Title className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              {modalMode === "add"
                ? `Add New ${
                    addressType === "billing" ? "Billing" : "Shipping"
                  } Address`
                : `Edit ${
                    addressType === "billing" ? "Billing" : "Shipping"
                  } Address`}
            </Dialog.Title>

            <div className="space-y-4">
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    maxLength={100}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter mobile number"
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                    Alternate Mobile
                  </label>
                  <input
                    type="tel"
                    name="alternateMobile"
                    value={formData.alternateMobile}
                    onChange={handleInputChange}
                    placeholder="Enter alternate mobile"
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCountry || ""}
                    onChange={(e) => {
                      const countryCode = e.target.value;
                      setSelectedCountry(countryCode);
                      const country = countries.find(
                        (c) => c.isoCode === countryCode
                      );
                      setFormData({
                        ...formData,
                        country: country?.name || "",
                      });
                    }}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedState || ""}
                    onChange={(e) => {
                      const stateCode = e.target.value;
                      setSelectedState(stateCode);
                      const state = states.find((s) => s.isoCode === stateCode);
                      setFormData({ ...formData, state: state?.name || "" });
                    }}
                    disabled={!selectedCountry}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    disabled={!selectedState}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Enter nearby landmark"
                    maxLength={200}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={addressLoading}
                  className="flex-1 bg-navyblue text-white px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all text-sm md:text-base"
                >
                  {addressLoading ? "Saving..." : "Save Address"}{" "}
                  {/* ✅ Use addressLoading */}
                </button>
                <Dialog.Close asChild>
                  <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm md:text-base">
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default AddressManager;
