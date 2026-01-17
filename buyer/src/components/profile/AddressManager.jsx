import React, { useState } from "react";
import { MapPin, Edit2, Trash2, Plus, Save, X } from "lucide-react";

const AddressManager = ({ user }) => {
  const [isAdding, setIsAdding] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    setIsAdding(true);
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
  };

  const handleEdit = (address, index) => {
    setEditingIndex(index);
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
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
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
  };

  const handleSave = () => {
    // TODO: Dispatch Redux action to save address
    console.log("Saving address:", formData);
    handleCancel();
  };

  const handleDelete = (index) => {
    // TODO: Dispatch Redux action to delete address
    console.log("Deleting address at index:", index);
  };

  const addresses = user.address || [];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Manage Addresses
          </h2>
          {!isAdding && editingIndex === null && (
            <button
              onClick={handleAddNew}
              className="text-black hover:text-blue-700 flex items-center gap-1.5 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingIndex !== null) && (
          <div className="mb-6 p-4 sm:p-6 border-2 border-navyblue-200 rounded-xl ">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {isAdding ? "Add New Address" : "Edit Address"}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Alternate Mobile */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">
                  Alternate Mobile
                </label>
                <input
                  type="tel"
                  name="alternateMobile"
                  value={formData.alternateMobile}
                  onChange={handleInputChange}
                  placeholder="Enter alternate mobile"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* City */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  maxLength={50}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* State */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  maxLength={50}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Country */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block font-medium">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                  maxLength={50}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Landmark */}
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-700 mb-2 block font-medium">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="Enter nearby landmark"
                  maxLength={200}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-navyblue text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg"
              >
                <Save className="w-4 h-4" />
                Save Address
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 font-semibold hover:bg-gray-300"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Existing Addresses List */}
        {addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((address, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors relative"
              >
                {/* Address Content */}
                <div className="space-y-2.5 text-sm text-gray-700 mb-4">
                  {address.name && (
                    <p>
                      <span className="font-semibold text-gray-900">Name:</span>{" "}
                      {address.name}
                    </p>
                  )}
                  {address.mobile && (
                    <p>
                      <span className="font-semibold text-gray-900">
                        Mobile:
                      </span>{" "}
                      {address.mobile}
                    </p>
                  )}
                  {address.alternateMobile && (
                    <p>
                      <span className="font-semibold text-gray-900">
                        Alternate Mobile:
                      </span>{" "}
                      {address.alternateMobile}
                    </p>
                  )}
                  {address.landmark && (
                    <p>
                      <span className="font-semibold text-gray-900">
                        Landmark:
                      </span>{" "}
                      {address.landmark}
                    </p>
                  )}
                  <p>
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

                {/* Action Buttons */}
                {editingIndex !== index && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address, index)}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !isAdding && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No addresses saved yet</p>
              <button
                onClick={handleAddNew}
                className="text-black hover:text-blue-700 font-medium inline-flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Your First Address
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AddressManager;
