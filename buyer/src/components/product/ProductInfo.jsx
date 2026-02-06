import React, { useState, useEffect } from "react";
import {
  Star,
  CheckCircle,
  Truck,
  Shield,
  PackageCheck,
  FileText,
  MessageSquare,
  Package,
  MessageCircle,
  Info,
  X,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import * as Dialog from "@radix-ui/react-dialog";
import { Country, State, City } from "country-state-city";
import {
  createQuotationRequest,
  clearSuccess,
  clearError,
} from "../../lib/redux/quotation/quotationSlice";

import { toast } from "sonner";

const ProductInfo = ({ product, seller }) => {
  const { user: logedUser, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const quotationState = useSelector((state) => state.quotation);
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isChatEnabled] = useState(false);

  // Get countries, states, cities
  const countries = Country.getAllCountries();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Quotation Form States
  const [formData, setFormData] = useState({
    quotation_type: "product",
    quantity: "",
    unit: product?.priceUnit || "sq.ft",
    message: "",
    timeline: "",
    country: "",
    state: "",
    city: "",
    budgetMin: "",
    budgetMax: "",
    broadcastToCategory: false,
    contactEmail: isAuthenticated ? logedUser?.email || "" : "",
    contactPhone: isAuthenticated ? logedUser?.mobile || "" : "",
    selectedShippingAddress: logedUser?.shipping_address?.[0] || null,
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Component ke andar, useState ke baad:
  useEffect(() => {
    if (quotationState.success) {
      toast.success(
        `✅ ${quotationState.successMessage}\n${quotationState.sellersNotified} seller(s) notified`
      );
      dispatch(clearSuccess());
    }

    if (quotationState.error) {
      toast.error(`❌ ${quotationState.error}`);
      dispatch(clearError());
    }
  }, [quotationState.success, quotationState.error]);

  // ========== SHIPPING ADDRESS CHANGE (Logged in) ==========
  const handleShippingAddressChange = (e) => {
    const index = parseInt(e.target.value);
    const selected = logedUser?.shipping_address?.[index] || null;
    setFormData({
      ...formData,
      selectedShippingAddress: selected,
    });
  };

  // ========== COUNTRY CHANGE (Not logged in) ==========
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setFormData({
      ...formData,
      country: countryCode,
      state: "",
      city: "",
    });
    setStates(State.getStatesOfCountry(countryCode));
    setCities([]);
  };

  // ========== STATE CHANGE (Not logged in) ==========
  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setFormData({ ...formData, state: stateCode, city: "" });
    setCities(City.getCitiesOfState(formData.country, stateCode));
  };

  // ========== SUBMIT ==========
  const handleSubmit = (e) => {
    e.preventDefault();

    let location = "";

    if (isAuthenticated && formData.selectedShippingAddress) {
      // Logged in — use selected shipping address
      const addr = formData.selectedShippingAddress;
      location = `${addr.city}, ${addr.state}, ${addr.country}`;
    } else {
      // Not logged in — use manual country/state/city
      const countryName =
        countries.find((c) => c.isoCode === formData.country)?.name || "";
      const stateName =
        states.find((s) => s.isoCode === formData.state)?.name || "";
      const cityName = formData.city;
      location = `${cityName}, ${stateName}, ${countryName}`.trim();
    }

    // Determine quotation type
    const quotationType = formData.broadcastToCategory
      ? "product-broadcast"
      : "product";

    // Prepare final data
    const finalData = {
      quotation_type: quotationType,
      userId: logedUser?._id || null,
      sellerId: seller?._id || null,
      productId: product?._id || null,
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      message: formData.message,
      timeline: formData.timeline,
      location: location,
      budgetMin: formData.budgetMin ? parseFloat(formData.budgetMin) : null,
      budgetMax: formData.budgetMax ? parseFloat(formData.budgetMax) : null,
      uploadedFiles: uploadedFiles.map((f) => ({
        name: f.name,
        type: f.type,
        file: f.file,
      })),
    };

    // Contact info — only if not logged in
    if (!isAuthenticated) {
      finalData.contactEmail = formData.contactEmail;
      finalData.contactPhone = formData.contactPhone;
    }

    // Broadcast category data
    if (formData.broadcastToCategory) {
      finalData.category = product?.category?.[0] || "";
      finalData.subcategories = product?.subCategory || [];
    }

    console.log("✅ Quotation Request Data:", finalData);

    // Dispatch
    dispatch(createQuotationRequest(finalData));

    setIsQuotationModalOpen(false);
    resetForm();
  };

  // ========== FILE UPLOAD ==========
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    if (uploadedFiles.length + files.length > 3) {
      alert("Maximum 3 files allowed");
      return;
    }

    const newFiles = files.slice(0, 3 - uploadedFiles.length).map((file) => ({
      file,
      type: file.type,
      name: file.name,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  // ========== RESET ==========
  const resetForm = () => {
    setFormData({
      quotation_type: "product",
      quantity: "",
      unit: product?.priceUnit || "sq.ft",
      message: "",
      timeline: "",
      country: "",
      state: "",
      city: "",
      budgetMin: "",
      budgetMax: "",
      broadcastToCategory: false,
      contactEmail: isAuthenticated ? logedUser?.email || "" : "",
      contactPhone: isAuthenticated ? logedUser?.mobile || "" : "",
      selectedShippingAddress: logedUser?.shipping_address?.[0] || null,
    });
    setUploadedFiles([]);
    setStates([]);
    setCities([]);
  };

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-xl text-gray-800 leading-relaxed font-medium">
          {product.productName}
        </h1>

        <div className="flex items-center gap-4 pb-4 border-b">
          <span className="text-gray-600 text-sm">
            {product.views?.toLocaleString() || 0} views
          </span>
          {seller?.varificationStatus === "Approved" && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Verified Supplier</span>
            </div>
          )}
        </div>

        <div className="pb-4 border-b">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-semibold text-gray-900">
              ₹{product.pricePerUnit?.toLocaleString()}
            </span>
            <span className="text-gray-500">/ {product.priceUnit}</span>
          </div>
        </div>

        <div className="space-y-3">
          {product.grade && (
            <div className="flex">
              <span className="text-gray-600 text-sm w-36">Grade</span>
              <span className="text-gray-900 text-sm font-medium">
                {product.grade}
              </span>
            </div>
          )}
          {product.color && (
            <div className="flex">
              <span className="text-gray-600 text-sm w-36">Color</span>
              <span className="text-gray-900 text-sm font-medium">
                {product.color}
              </span>
            </div>
          )}
          {product.origin && (
            <div className="flex">
              <span className="text-gray-600 text-sm w-36">Origin</span>
              <span className="text-gray-900 text-sm font-medium">
                {product.origin}
              </span>
            </div>
          )}
          {product.size && (
            <div className="flex">
              <span className="text-gray-600 text-sm w-36">Dimensions</span>
              <span className="text-gray-900 text-sm font-medium">
                {product.size.length} {product.size.lengthMeasurement} ×{" "}
                {product.size.width} {product.size.widthMeasurement} ×{" "}
                {product.size.thickness} {product.size.thicknessMeasurement}
              </span>
            </div>
          )}
          {product.weight && (
            <div className="flex">
              <span className="text-gray-600 text-sm w-36">Weight</span>
              <span className="text-gray-900 text-sm font-medium">
                {product.weight} {product.weightMeasurement}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {Array.isArray(product.category) &&
              product.category.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium capitalize"
                >
                  {cat}
                </span>
              ))}
            {Array.isArray(product.subCategory) &&
              product.subCategory.map((subCat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize"
                >
                  {subCat}
                </span>
              ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Trade Assurance
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Quality checked products</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Customized packaging & shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <PackageCheck className="w-4 h-4 text-orange-600" />
              <span>Sample available before bulk order</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={() => setIsQuotationModalOpen(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            REQUEST QUOTATION
          </button>

          <div className="relative group">
            <div
              className={`w-full py-2 px-3 rounded border-2 flex items-center justify-between ${
                isChatEnabled
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageCircle
                  className={`w-4 h-4 ${
                    isChatEnabled ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isChatEnabled ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {isChatEnabled ? "Chat Now Available" : "Chat"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {isChatEnabled ? "Active" : "After quotation"}
                </span>
              </div>
            </div>

            {!isChatEnabled && (
              <div className="absolute bottom-full left-0 right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-gray-900 text-white text-xs rounded px-3 py-2 text-center">
                  Chat will be enabled once you receive a quotation response
                  from the seller
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
          <p className="font-semibold mb-1">💡 Price Negotiable</p>
          <p>
            Final price depends on order quantity, customization, and delivery
            terms. Request quotation for best pricing.
          </p>
        </div>
      </div>

      {/* ==================== QUOTATION MODAL ==================== */}
      <Dialog.Root
        open={isQuotationModalOpen}
        onOpenChange={(open) => {
          setIsQuotationModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-4xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-5 md:p-6 overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sidebar-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg md:text-xl font-bold text-gray-900">
                Request Quotation
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>

            {/* Product Info */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                {product?.productImages?.[0] && (
                  <img
                    src={product.productImages[0]}
                    alt={product.productName}
                    className="w-12 h-12 object-cover rounded border border-blue-200"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {product?.productName}
                  </h3>
                  <p className="text-xs text-gray-600">
                    ₹{product?.pricePerUnit?.toLocaleString()} /{" "}
                    {product?.priceUnit}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quantity and Unit */}
              <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                    Quantity Required <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    placeholder="Enter quantity"
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="sq.ft">sq.ft</option>
                    <option value="sq.m">sq.m</option>
                    <option value="piece">piece</option>
                    <option value="ton">ton</option>
                    <option value="kg">kg</option>
                    <option value="running meter">running meter</option>
                  </select>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Expected Timeline <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.timeline}
                  onChange={(e) =>
                    setFormData({ ...formData, timeline: e.target.value })
                  }
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select timeline</option>
                  <option value="Within 1 week">Within 1 week</option>
                  <option value="Within 2 weeks">Within 2 weeks</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3+ months">3+ months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              {/* ========== LOCATION ========== */}
              <div>
                <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Delivery Location <span className="text-red-500">*</span>
                </label>

                {/* Logged in — Shipping Address Dropdown */}
                {isAuthenticated && logedUser?.shipping_address?.length > 0 ? (
                  <div>
                    <select
                      required
                      value={
                        logedUser.shipping_address.findIndex(
                          (addr) =>
                            addr._id === formData.selectedShippingAddress?._id
                        ) !== -1
                          ? logedUser.shipping_address.findIndex(
                              (addr) =>
                                addr._id ===
                                formData.selectedShippingAddress?._id
                            )
                          : 0
                      }
                      onChange={handleShippingAddressChange}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {logedUser.shipping_address.map((addr, index) => (
                        <option key={addr._id} value={index}>
                          {addr.name} — {addr.city}, {addr.state}
                        </option>
                      ))}
                    </select>

                    {/* Selected address details */}
                    {formData.selectedShippingAddress && (
                      <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium text-gray-800">
                            {formData.selectedShippingAddress.name}
                          </span>{" "}
                          — {formData.selectedShippingAddress.landmark},{" "}
                          {formData.selectedShippingAddress.city},{" "}
                          {formData.selectedShippingAddress.state},{" "}
                          {formData.selectedShippingAddress.country} -{" "}
                          {formData.selectedShippingAddress.pincode}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Not logged in — Manual country/state/city
                  <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                    {/* Country */}
                    <div>
                      <select
                        required
                        value={formData.country}
                        onChange={handleCountryChange}
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

                    {/* State */}
                    <div>
                      <select
                        required
                        value={formData.state}
                        onChange={handleStateChange}
                        disabled={!formData.country}
                        className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <select
                        required
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        disabled={!formData.state}
                        className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Budget Range (Optional) */}
              <div>
                <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Budget Range (Optional)
                </label>
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                  <input
                    type="number"
                    min="0"
                    value={formData.budgetMin}
                    onChange={(e) =>
                      setFormData({ ...formData, budgetMin: e.target.value })
                    }
                    placeholder="Min budget (₹)"
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    min="0"
                    value={formData.budgetMax}
                    onChange={(e) =>
                      setFormData({ ...formData, budgetMax: e.target.value })
                    }
                    placeholder="Max budget (₹)"
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Providing budget helps seller give relevant quotes
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                  Requirements & Specifications
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={3}
                  placeholder="Describe your requirements, dimensions, finish type, etc."
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                  Upload Files (Optional - Max 3)
                </label>

                <div className="flex gap-3 flex-wrap">
                  {uploadedFiles.map((fileObj, index) => (
                    <div key={index} className="relative group w-24 h-24">
                      {fileObj.type.startsWith("image/") ? (
                        <img
                          src={fileObj.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg">
                          <FileText className="w-8 h-8 text-red-500" />
                          <span className="text-xs text-red-600 mt-1 truncate px-1 w-full text-center">
                            PDF
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {uploadedFiles.length < 3 && (
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors flex items-center justify-center">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload-quotation"
                      />
                      <label
                        htmlFor="file-upload-quotation"
                        className="cursor-pointer flex flex-col items-center gap-1"
                      >
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-500">Upload</span>
                      </label>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Images (JPG, PNG) or PDF (Max 3 files, 5MB each)
                </p>
              </div>

              {/* ========== BROADCAST CHECKBOX ========== */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.broadcastToCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        broadcastToCategory: e.target.checked,
                      })
                    }
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Also send this request to other sellers in this category
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Get more quotations from sellers offering similar products
                      in <strong>{product?.category?.[0]}</strong> category
                    </p>
                  </div>
                </label>
              </div>

              {/* Contact Info - Only if NOT authenticated */}
              {!isAuthenticated && (
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactEmail: e.target.value,
                        })
                      }
                      placeholder="your@email.com"
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-gray-700 mb-1.5 md:mb-2 block font-medium">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPhone: e.target.value,
                        })
                      }
                      placeholder="+91-XXXXXXXXXX"
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>💡 What happens next?</strong> The seller will review
                  your requirements and send you a custom quotation within 24-48
                  hours.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base"
                >
                  Request Quotation
                </button>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm md:text-base"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default ProductInfo;
