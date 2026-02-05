import React from "react";
import { Upload, FileText, X } from "lucide-react";

const RequirementsStep = ({
  formData,
  setFormData,
  errors,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    if (uploadedFiles.length + files.length > 5) {
      alert("Maximum 5 files allowed");
      return;
    }

    const newFiles = files.slice(0, 5 - uploadedFiles.length).map((file) => ({
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

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Describe Your Requirements
        </h2>
        <p className="text-xs text-gray-600">
          Provide detailed information to help sellers understand your needs
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-900 mb-1.5">
          Requirements Description *
        </label>
        <textarea
          value={formData.requirements}
          onChange={(e) =>
            setFormData({ ...formData, requirements: e.target.value })
          }
          rows={4}
          placeholder="Describe your requirements in detail:
• What product/material do you need?
• Intended use and application
• Delivery location requirements"
          className={`w-full px-3 py-2 text-xs border-2 rounded-lg focus:outline-none resize-none ${
            errors.requirements
              ? "border-red-500"
              : "border-gray-300 focus:border-navyblue"
          }`}
        />
        {errors.requirements && (
          <p className="text-red-500 text-xs mt-1">{errors.requirements}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-900 mb-1.5">
          Additional Specifications (Optional)
        </label>
        <textarea
          value={formData.specifications}
          onChange={(e) =>
            setFormData({
              ...formData,
              specifications: e.target.value,
            })
          }
          rows={3}
          placeholder="Add specific technical details:
• Dimensions and sizes
• Any certifications needed"
          className="w-full px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:border-navyblue focus:outline-none resize-none"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-xs font-semibold text-gray-900 mb-1.5">
          <Upload className="w-3 h-3 inline mr-1" />
          Upload Reference Files (Optional - Max 5)
        </label>

        <div className="flex gap-2 flex-wrap">
          {uploadedFiles.map((fileObj, index) => (
            <div key={index} className="relative group w-20 h-20">
              {fileObj.type.startsWith("image/") ? (
                <img
                  src={fileObj.preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg">
                  <FileText className="w-6 h-6 text-red-500" />
                  <span className="text-[10px] text-red-600 mt-0.5 truncate px-1 w-full text-center">
                    PDF
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-md"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}

          {uploadedFiles.length < 5 && (
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg hover:border-navyblue transition-colors flex items-center justify-center">
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-0.5"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] text-gray-500">Upload</span>
              </label>
            </div>
          )}
        </div>
        <p className="text-[10px] text-gray-500 mt-1">
          Images (JPG, PNG) or PDF (Max 5 files, 5MB each)
        </p>
      </div>
    </div>
  );
};

export default RequirementsStep;
