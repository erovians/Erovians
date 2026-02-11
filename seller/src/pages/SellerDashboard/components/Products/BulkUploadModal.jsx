import React, { useState } from "react";
import { Upload, X, Download } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";

const BulkUploadModal = ({ isOpen, onClose }) => {
  const [bulkFile, setBulkFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "text/csv" ||
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      setBulkFile(file);
    } else {
      toast.error("Please upload a valid CSV or Excel file");
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "productName",
      "product_sku",
      "product_type",
      "category",
      "subCategory",
      "grade",
      "color",
      "origin",
      "product_material",
      "length",
      "lengthMeasurement",
      "width",
      "widthMeasurement",
      "thickness",
      "thicknessMeasurement",
      "weight",
      "weightMeasurement",
      "pricePerUnit",
      "priceUnit",
      "available_stock",
      "expected_shipping_time",
      "description",
    ];

    const sampleRow = [
      "Italian Marble Slab",
      "MAR-001",
      "ready-to-go",
      "natural stones",
      "marble",
      "A",
      "White",
      "Italy",
      "Carrara Marble",
      "2400",
      "mm",
      "1200",
      "mm",
      "20",
      "mm",
      "45",
      "kg",
      "1500",
      "sq.ft",
      "100",
      "7",
      "Premium quality Italian Carrara marble with beautiful white veining...",
    ];

    const csvContent = headers.join(",") + "\n" + sampleRow.join(",");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_upload_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    if (!bulkFile) {
      toast.error("Please select a file first");
      return;
    }

    // TODO: Implement bulk upload API call
    toast.info("Bulk upload functionality will be implemented with backend");
    onClose();
    setBulkFile(null);
  };

  const handleClose = () => {
    setBulkFile(null);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-[90vw] max-w-md z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-900" />
              Bulk Product Upload
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-2">
                Step 1: Download Template
              </p>
              <p className="text-xs text-blue-800 mb-3">
                Download the CSV template with sample data and required format
              </p>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 font-medium bg-white px-3 py-2 rounded border border-blue-300 hover:border-blue-400 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 font-medium mb-2">
                Step 2: Fill Product Data
              </p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Each row = one product</li>
                <li>Fill all required fields (marked with *)</li>
                <li>Use exact values for category, grade, units</li>
                <li>Save as CSV or Excel (.xlsx)</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div>
              <p className="text-sm text-gray-700 font-medium mb-3">
                Step 3: Upload File
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-900 transition-colors">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="bulk-upload-input"
                />
                <label htmlFor="bulk-upload-input" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    {bulkFile ? (
                      <span className="text-blue-900">{bulkFile.name}</span>
                    ) : (
                      "Click to upload CSV/Excel file"
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Max file size: 5MB
                  </p>
                </label>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-900 font-medium mb-1">
                📌 Important Notes:
              </p>
              <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                <li>Product images must be uploaded separately</li>
                <li>Invalid rows will be skipped with error report</li>
                <li>Processing may take a few minutes for large files</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleUpload}
                disabled={!bulkFile}
                className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Products
              </button>
              <Dialog.Close asChild>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BulkUploadModal;
