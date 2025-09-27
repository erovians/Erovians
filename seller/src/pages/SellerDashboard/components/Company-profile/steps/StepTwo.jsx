import React, { useEffect, useState } from "react";

export default function StepTwo({ formData, setFormData, errors }) {
  const [logoPreview, setLogoPreview] = useState("");

  // Logo preview
  useEffect(() => {
    let url;
    if (formData.logo) {
      url = URL.createObjectURL(formData.logo);
      setLogoPreview(url);
    } else {
      setLogoPreview("");
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [formData.logo]);

  // Handle file input
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files) return;

    if (name === "logo") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, logo: file }));
    } else if (name === "companyPhotos" || name === "companyVideos") {
      const arr = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        [name]: [...(prev[name] || []), ...arr],
      }));
    }
  };

  // Remove file from array
  const removeFile = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
        Company Introduction
      </h3>

      {/* Logo Upload */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Comapny Logo
        </label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-gray-600"
        />
        {logoPreview && (
          <div className="mt-3 relative w-32 h-32 border rounded-lg shadow-sm overflow-hidden">
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="object-contain w-full h-full"
            />
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, logo: null }))}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
        {errors.logo && (
          <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
        )}
      </div>

      {/* Company Description */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Company Description
        </label>
        <textarea
          value={formData.companyDescription || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              companyDescription: e.target.value,
            }))
          }
          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm ${
            errors.companyDescription ? "border-red-500" : "border-gray-300"
          }`}
          rows={6}
          placeholder="Describe your company in detail..."
        />
        {errors.companyDescription && (
          <p className="text    -red-500 text-sm mt-1">
            {errors.companyDescription}
          </p>
        )}
      </div>

      {/* Company Photos */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Company Photos
        </label>
        <input
          type="file"
          multiple
          name="companyPhotos"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-gray-600"
        />
        {Array.isArray(formData.companyPhotos) &&
          formData.companyPhotos.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {formData.companyPhotos.map((file, index) => {
                const url = URL.createObjectURL(file);
                return (
                  <div
                    key={index}
                    className="relative w-full h-28 border rounded-lg overflow-hidden shadow-sm"
                  >
                    <img
                      src={url}
                      alt={file.name}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("companyPhotos", index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        {errors.companyPhotos && (
          <p className="text-red-500 text-sm mt-1">{errors.companyPhotos}</p>
        )}
      </div>

      {/* Company Videos */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Company Videos
        </label>
        <input
          type="file"
          multiple
          name="companyVideos"
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full text-gray-600"
        />
        {Array.isArray(formData.companyVideos) &&
          formData.companyVideos.length > 0 && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {formData.companyVideos.map((file, index) => {
                const url = URL.createObjectURL(file);
                return (
                  <div
                    key={index}
                    className="relative w-full h-28 border rounded-lg overflow-hidden shadow-sm"
                  >
                    <video
                      src={url}
                      className="object-cover w-full h-full"
                      controls
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("companyVideos", index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
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
  );
}
