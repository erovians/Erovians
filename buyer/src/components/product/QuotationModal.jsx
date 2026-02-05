import React, { useState } from "react";
import { useSelector } from "react-redux";
import { X, FileText, Upload, Mail, Phone, Package } from "lucide-react";

const QuotationModal = ({ isOpen, onClose, product }) => {
  const { user: logedUser, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    quantity: "",
    unit: product?.priceUnit || "sq.ft",
    message: "",
    contactEmail: isAuthenticated ? logedUser?.email || "" : "",
    contactPhone: isAuthenticated ? logedUser?.phone || "" : "",
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Backend integration later
    console.log("Quotation Request:", { ...formData, files: uploadedFiles });
    alert("Quotation request sent! Seller will respond soon.");
    onClose();
  };

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

  if (!isOpen) return null;

  return (
    <>
      {/* Lighter Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-9999"
        onClick={onClose}
      />

      {/* Modal - Rectangle shape, no scroll */}
      <div className="fixed inset-0 flex items-center justify-center z-10000 p-4 pointer-events-none">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col pointer-events-auto">
          {/* Header - Not Sticky */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Request Quotation
                </h2>
                <p className="text-sm text-gray-500">
                  Get custom pricing for your requirements
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto sidebar-scrollbar">
            {/* Product Info - Compact */}
            <div className="p-4 bg-blue-50 border-b border-blue-100">
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Row 1: Quantity and Unit side by side */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Package className="w-4 h-4 inline mr-2" />
                    Quantity Required *
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
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                  >
                    <option value="sq.ft">sq.ft</option>
                    <option value="sq.m">sq.m</option>
                    <option value="piece">piece</option>
                    <option value="ton">ton</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Message (compact) */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Requirements & Specifications
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={3}
                  placeholder="Describe your requirements, dimensions, finish type, delivery location, expected timeline, etc."
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-sm"
                />
              </div>

              {/* Row 3: File Upload - Images & PDF - Compact */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload Files (Optional - Max 3)
                </label>

                <div className="flex gap-3 flex-wrap">
                  {/* File Preview */}
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

                  {/* Upload Button - Compact */}
                  {uploadedFiles.length < 3 && (
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors flex items-center justify-center">
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

              {/* Row 4: Contact Info - Only if NOT authenticated */}
              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address *
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
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
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
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Info Box - Compact */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>💡 What happens next?</strong> The seller will review
                  your requirements and send you a custom quotation within 24-48
                  hours.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuotationModal;
