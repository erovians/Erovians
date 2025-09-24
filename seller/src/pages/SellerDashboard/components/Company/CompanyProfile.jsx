import React, { useState, useEffect } from "react";

// --- Reusable Icons & UI Components ---

const UploadIcon = () => (
  <svg
    className="w-6 h-6 mr-2 text-gray-500"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 16"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
    />
  </svg>
);

const SuccessMessage = ({ children }) => (
  <div className="flex items-center text-sm text-green-600 animate-fadeIn">
    <svg
      className="w-4 h-4 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      ></path>
    </svg>
    {children}
  </div>
);

// New Progress Bar Component (shadcn/ui inspired)
const ProgressBar = ({ value }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">Completeness</span>
      <span className="text-sm font-medium text-gray-700">{value}%</span>
    </div>
    <div className="w-full bg-gray-200  h-3">
      <div
        className="bg-green-500 h-3  transition-all duration-500"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

// New Business Type Modal
const BusinessTypeModal = ({ isOpen, onClose, currentType, onSave }) => {
  if (!isOpen) return null;
  const [selectedType, setSelectedType] = useState(currentType);
  const businessTypes = [
    "Manufacturer",
    "Trading Company",
    "Distributor/Wholesaler",
    "Buying Office",
  ];

  const handleSave = () => {
    onSave(selectedType);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white-500/40 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold text-gray-900">
          Select Business Type
        </h3>
        <div className="mt-4 space-y-3">
          {businessTypes.map((type) => (
            <label
              key={type}
              className="flex items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="radio"
                name="businessType"
                value={type}
                checked={selectedType === type}
                onChange={() => setSelectedType(type)}
                className="h-4 w-4 text-navblue border-gray-300 focus:ring-navyblue"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                {type}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-navyblue rounded-md cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Form Components (Modified to report submission success) ---

const BasicCompanyDetailsForm = ({ onFormSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    address: {
      street: "",
      city: "",
      stateOrProvince: "",
      countryOrRegion: "",
      postalCode: "",
    },
    locationOfRegistration: "",
    mainCategory: "",
    subCategory: "",
    acceptedCurrency: ["USD", "EUR", "JPY"], // Changed to array
    acceptedPaymentType: ["T/T", "L/C"], // Updated
    languageSpoken: ["English", "Hindi"], // Changed to array
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  // Generic handler for all checkbox groups
  const handleCheckboxGroupChange = (fieldName, value) => {
    setFormData((prev) => {
      const currentValues = prev[fieldName];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...prev, [fieldName]: newValues };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    console.log("Submitting Basic Details:", formData);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      onFormSubmitSuccess("basicDetails"); // Notify parent of success
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1000);
  };

  // Data for the checkbox grids
  const currencies = [
    "USD",
    "EUR",
    "JPY",
    "CAD",
    "AUD",
    "HKD",
    "GBP",
    "CNY",
    "CHF",
  ];
  const paymentTypes = [
    "T/T",
    "L/C",
    "D/P D/A",
    "MoneyGram",
    "Credit Card",
    "PayPal",
    "Western Union",
    "Cash",
    "Escrow",
  ];
  const languages = [
    "English",
    "Chinese",
    "Spanish",
    "Japanese",
    "Portuguese",
    "German",
    "Arabic",
    "French",
    "Russian",
    "Korean",
    "Hindi",
    "Italian",
  ];

  return (
    <div className="animate-fadeIn p-2">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Basic Company Details
      </h3>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Name, Location, Address, Category fields remain the same */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="companyName"
            >
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="locationOfRegistration"
            >
              Location of Registration <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="locationOfRegistration"
              name="locationOfRegistration"
              value={formData.locationOfRegistration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-4 border-b pb-2">
            Address
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="street"
              >
                Street <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="city"
              >
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.address.city}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="stateOrProvince"
              >
                State / Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="stateOrProvince"
                name="stateOrProvince"
                value={formData.address.stateOrProvince}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="countryOrRegion"
              >
                Country / Region <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="countryOrRegion"
                name="countryOrRegion"
                value={formData.address.countryOrRegion}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="postalCode"
              >
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.address.postalCode}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="mainCategory"
            >
              Main Category <span className="text-red-500">*</span>
            </label>
            <select
              id="mainCategory"
              name="mainCategory"
              value={formData.mainCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              <option value="">Select Category</option>
              <option value="Marble">Marble</option>
              <option value="Granite">Granite</option>
            </select>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="subCategory"
            >
              Sub Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* UPDATED SECTION */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accepted Payment Currency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {currencies.map((currency) => (
                <div key={currency} className="flex items-center">
                  <input
                    id={`currency-${currency}`}
                    type="checkbox"
                    value={currency}
                    checked={formData.acceptedCurrency.includes(currency)}
                    onChange={(e) =>
                      handleCheckboxGroupChange(
                        "acceptedCurrency",
                        e.target.value
                      )
                    }
                    className="h-4 w-4 text-navyblue border-gray-300 rounded focus:ring-navyblue"
                  />
                  <label
                    htmlFor={`currency-${currency}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {currency}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accepted Payment Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {paymentTypes.map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    id={`payment-${type}`}
                    type="checkbox"
                    value={type}
                    checked={formData.acceptedPaymentType.includes(type)}
                    onChange={(e) =>
                      handleCheckboxGroupChange(
                        "acceptedPaymentType",
                        e.target.value
                      )
                    }
                    className="h-4 w-4 text-navyblue border-gray-300 rounded focus:ring-navyblue"
                  />
                  <label
                    htmlFor={`payment-${type}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language Spoken
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {languages.map((language) => (
                <div key={language} className="flex items-center">
                  <input
                    id={`language-${language}`}
                    type="checkbox"
                    value={language}
                    checked={formData.languageSpoken.includes(language)}
                    onChange={(e) =>
                      handleCheckboxGroupChange(
                        "languageSpoken",
                        e.target.value
                      )
                    }
                    className="h-4 w-4 text-navyblue border-gray-300 rounded focus:ring-navyblue"
                  />
                  <label
                    htmlFor={`language-${language}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {language}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end items-center gap-4 border-t">
          {submitStatus === "success" && (
            <SuccessMessage>Details saved successfully!</SuccessMessage>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-navyblue border border-navyblue text-white rounded-md hover:bg-white hover:text-navyblue disabled:bg-blue-300 cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

const CompanyIntroductionForm = ({ onFormSubmitSuccess }) => {
  // ... same state as before ...
  const [formData, setFormData] = useState({
    companyDescription: "",
    logo: null,
    companyPhotos: [],
    companyVideos: [],
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    console.log("Submitting Introduction:", formData);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      onFormSubmitSuccess("introduction"); // Notify parent of success
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1000);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "logo" && files[0]) {
      setFormData((prev) => ({ ...prev, logo: files[0] }));
      setLogoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: [...prev[name], ...Array.from(files)],
      }));
    }
  };

  return (
    <div className="animate-fadeIn p-2">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Company Introduction
      </h3>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ... form fields remain the same ... */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Logo <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 flex items-center gap-5">
            <div className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-xs text-gray-400 text-center">
                  Logo Preview
                </span>
              )}
            </div>
            <input
              name="logo"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-navyblue hover:file:bg-blue-100"
              required
            />
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="companyDescription"
          >
            Company Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="companyDescription"
            rows="6"
            value={formData.companyDescription}
            onChange={(e) =>
              setFormData((p) => ({ ...p, companyDescription: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            minLength="50"
          ></textarea>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Photos <span className="text-red-500">*</span>
            </label>
            <input
              name="companyPhotos"
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-navyblue hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Videos
            </label>
            <input
              name="companyVideos"
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-navyblue hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end items-center gap-4 border-t">
          {submitStatus === "success" && (
            <SuccessMessage>Introduction saved successfully!</SuccessMessage>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 border border-navyblue bg-navyblue text-white rounded-md hover:bg-white hover:text-navyblue disabled:bg-blue-300 cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save Introduction"}
          </button>
        </div>
      </form>
    </div>
  );
};

const CertificateCenterForm = ({ onFormSubmitSuccess }) => {
  // ... same state as before ...
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    setIsUploading(true);
    setUploadStatus(null);
    console.log(
      "Uploading Certificates:",
      files.map((f) => f.name)
    );
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus("success");
      setFiles([]);
      onFormSubmitSuccess("certificates"); // Notify parent of success
      setTimeout(() => setUploadStatus(null), 3000);
    }, 1500);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  return (
    <div className="animate-fadeIn p-2">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Certificate Center
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... form fields remain the same ... */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Certifications
          </label>
          <div className="mt-1 p-8 border-2 border-gray-300 border-dashed rounded-md text-center">
            <UploadIcon />
            <label
              htmlFor="certificates"
              className="relative cursor-pointer bg-white rounded-md font-medium text-navyblue"
            >
              <span>Select files to upload</span>
              <input
                id="certificates"
                name="certificates"
                type="file"
                className="sr-only"
                multiple
                onChange={handleFileChange}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG accepted</p>
          </div>
        </div>
        {files.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-600">
              Selected files:
            </h4>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-500">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="pt-4 flex justify-end items-center gap-4 border-t">
          {uploadStatus === "success" && (
            <SuccessMessage>Certificates uploaded!</SuccessMessage>
          )}
          <button
            type="submit"
            disabled={isUploading || files.length === 0}
            className="px-5 py-2 border border-navyblue bg-navyblue text-white rounded-md hover:bg-white hover:text-navyblue"
          >
            {isUploading ? "Uploading..." : "Upload Selected Files"}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Main Form Component (Controls Navigation, Progress, and Business Type) ---
function CompanyProfileForm() {
  const [activeTab, setActiveTab] = useState("basicDetails");
  const [businessType, setBusinessType] = useState("Manufacturer");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completionStatus, setCompletionStatus] = useState({
    basicDetails: false,
    introduction: false,
    certificates: false,
  });
  const [progress, setProgress] = useState(0);

  // Calculate progress whenever completion status changes
  useEffect(() => {
    const completedCount =
      Object.values(completionStatus).filter(Boolean).length;
    const totalCount = Object.keys(completionStatus).length;
    const newProgress =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    setProgress(newProgress);
  }, [completionStatus]);

  const handleFormSuccess = (formName) => {
    setCompletionStatus((prev) => ({ ...prev, [formName]: true }));
  };

  const renderContent = () => {
    const props = { onFormSubmitSuccess: handleFormSuccess };
    switch (activeTab) {
      case "basicDetails":
        return <BasicCompanyDetailsForm {...props} />;
      case "introduction":
        return <CompanyIntroductionForm {...props} />;
      case "certificates":
        return <CertificateCenterForm {...props} />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: "basicDetails", title: "Basic Company Details" },
    { id: "introduction", title: "Company Introduction" },
    { id: "certificates", title: "Certificate Center" },
  ];

  return (
    <div className="w-full ">
      <BusinessTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentType={businessType}
        onSave={setBusinessType}
      />

      <div className="p-4  border-b bg-gray-50 space-y-4">
        <ProgressBar value={progress} />
        <div className="flex items-center text-sm">
          <span className="text-gray-600">Business type selected:</span>
          <span className="font-semibold text-gray-800 ml-2">
            {businessType}
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-4 px-3 py-1 text-xs font-semibold text-navblue bg-blue-100 rounded-md hover:bg-blue-200"
          >
            Modify
          </button>
        </div>
      </div>

      <div className="">
        <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-navyblue text-navyblue"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 md:p-8">{renderContent()}</div>
    </div>
  );
}

// --- Parent Dashboard Component ---
export default function Dashboard() {
  return (
    <div className=" w-full min-h-screen font-sans">
      <main className="p-4 md:p-8 w-full flex justify-center">
        <CompanyProfileForm />
      </main>
    </div>
  );
}
