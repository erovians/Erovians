import React, { useEffect, useState, useRef } from "react";
import { Info, FileText, Upload } from "lucide-react";

const InfoTooltip = ({ text }) => (
  <div className="relative flex items-center group">
    <Info size={14} className="text-gray-400" />
    <div className="absolute left-0 w-48 p-2 ml-4 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1/2 top-1/2 z-10">
      {text}
    </div>
  </div>
);

export default function StepTwo({ formData, setFormData, errors }) {
  const [logoPreview, setLogoPreview] = useState("");
  const logoInputRef = useRef(null);
  const photosInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const docsInputRef = useRef(null); // ✅ NEW
  const MAX_DESC_LENGTH = 4000;

  useEffect(() => {
    let url;
    if (formData.logo instanceof File) {
      url = URL.createObjectURL(formData.logo);
      setLogoPreview(url);
    } else {
      setLogoPreview("");
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [formData.logo]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    if (name === "logo") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, logo: file }));
    } else if (
      name === "companyPhotos" ||
      name === "companyVideos" ||
      name === "registration_documents" // ✅ NEW
    ) {
      const arr = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        [name]: [...(prev[name] || []), ...arr],
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const removeFile = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const removeAllPhotos = () => {
    setFormData((prev) => ({ ...prev, companyPhotos: [] }));
  };

  const removeAllDocs = () => {
    setFormData((prev) => ({ ...prev, registration_documents: [] }));
  };

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logo: null }));
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const formRowClass =
    "flex flex-col sm:flex-row items-start py-4 border-b last:border-b-0";
  const labelClass =
    "w-full sm:w-1/4 text-sm font-medium text-gray-600 sm:text-right pr-4 mb-2 sm:mb-0";
  const controlClass = "w-full sm:w-3/4 flex flex-col";

  return (
    <div className="space-y-0">
      {/* Company Logo */}
      <div className={formRowClass}>
        <label className={`${labelClass} pt-1`}>
          <span className="text-red-500">*</span> Company Logo:
        </label>
        <div className={controlClass}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-cover border border-gray-500 rounded-md"
              />
            )}
            <div className="flex flex-col items-start gap-2">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 w-fit transition-colors"
              >
                Browse
              </button>
              <input
                ref={logoInputRef}
                type="file"
                name="logo"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 text-xs text-gray-500">
                <span>300KB max. JPEG, PNG format. Suggested: 160*100px.</span>
                <InfoTooltip text="For best results, upload a logo with the recommended dimensions." />
              </div>
              {formData.logo && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="text-blue-500 hover:text-blue-600 text-xs transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          {errors.logo && (
            <p className="text-xs text-red-500 mt-1">{errors.logo}</p>
          )}
        </div>
      </div>

      {/* Detailed Company Introduction */}
      <div className={formRowClass}>
        <label htmlFor="companyDescription" className={`${labelClass} pt-1`}>
          <span className="text-red-500">*</span> Detailed Company <br />
          Introduction:
        </label>
        <div className={controlClass}>
          <textarea
            id="companyDescription"
            value={formData.companyDescription || ""}
            onChange={handleInputChange}
            name="companyDescription"
            className={`w-full h-32 sm:h-40 px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-navyblue transition-colors ${
              errors.companyDescription ? "border-red-500" : "border-gray-300"
            }`}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            Remaining:{" "}
            {MAX_DESC_LENGTH - (formData.companyDescription?.length || 0)}
          </p>
          {errors.companyDescription && (
            <p className="text-xs text-red-500 mt-1">
              {errors.companyDescription}
            </p>
          )}
        </div>
      </div>

      {/* Company Photos */}
      <div className={formRowClass}>
        <label className={`${labelClass} pt-1`}>
          <span className="text-red-500">*</span> Company Photo:
        </label>
        <div className={controlClass}>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => photosInputRef.current?.click()}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Browse
            </button>
            <input
              ref={photosInputRef}
              type="file"
              multiple
              name="companyPhotos"
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={removeAllPhotos}
              className="text-blue-500 hover:text-blue-600 text-xs transition-colors"
            >
              Remove All
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 mt-2 text-xs text-gray-500">
            <span>200KB max. JPEG/PNG. Suggested: 1200*675px.</span>
            <InfoTooltip text="High-quality photos of your products, factory, or team can increase buyer trust." />
          </div>
          {Array.isArray(formData.companyPhotos) &&
            formData.companyPhotos.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {formData.companyPhotos.map((file, index) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div
                      key={index}
                      className="relative aspect-square border rounded-md overflow-hidden group"
                    >
                      <img
                        src={url}
                        alt={file.name}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("companyPhotos", index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          {errors.companyPhotos && (
            <p className="text-xs text-red-500 mt-1">{errors.companyPhotos}</p>
          )}
        </div>
      </div>

      {/* Company Video */}
      <div className={formRowClass}>
        <label className={`${labelClass} pt-1`}>Company Video:</label>
        <div className={controlClass}>
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 w-fit transition-colors"
          >
            Upload Video
          </button>
          <input
            ref={videoInputRef}
            type="file"
            name="companyVideos"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="mt-2 text-xs text-gray-500 max-w-full sm:max-w-xl">
            <p>Video must be less than 35 seconds. Max size: 2.5MB.</p>
            <p>File types: mp4, mov, wmv, flv. Do not use Erovians logo.</p>
          </div>
          {Array.isArray(formData.companyVideos) &&
            formData.companyVideos.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {formData.companyVideos.map((file, index) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div
                      key={index}
                      className="relative w-full border rounded-lg overflow-hidden shadow-sm group"
                    >
                      <video
                        src={url}
                        className="object-cover w-full h-full"
                        controls
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("companyVideos", index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* ✅ NEW: Registration Documents */}
      <div className={formRowClass}>
        <label className={`${labelClass} pt-1`}>
          <span className="text-red-500">*</span> Registration Documents:
        </label>
        <div className={controlClass}>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => docsInputRef.current?.click()}
              className="px-4 py-2 text-sm bg-navyblue text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Upload size={16} />
              Upload Documents
            </button>
            <input
              ref={docsInputRef}
              type="file"
              multiple
              name="registration_documents"
              accept="application/pdf, image/jpeg, image/png, image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
            {formData.registration_documents?.length > 0 && (
              <button
                type="button"
                onClick={removeAllDocs}
                className="text-blue-500 hover:text-blue-600 text-xs transition-colors"
              >
                Remove All
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 mt-2 text-xs text-gray-500">
            <span>5MB max per file. PDF, JPEG, PNG format.</span>
            <InfoTooltip text="Upload your company registration certificate, VAT certificate, or other official documents." />
          </div>

          {/* Document List */}
          {Array.isArray(formData.registration_documents) &&
            formData.registration_documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.registration_documents.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="text-navyblue shrink-0" size={20} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeFile("registration_documents", index)
                      }
                      className="ml-2 text-red-500 hover:text-red-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

          {errors.registration_documents && (
            <p className="text-xs text-red-500 mt-1">
              {errors.registration_documents}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
