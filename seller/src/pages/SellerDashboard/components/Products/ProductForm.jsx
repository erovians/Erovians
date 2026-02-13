// ProductForm.jsx - Updated to use categories from Redux

import React, { useMemo } from "react";
import {
  Layers,
  FileText,
  ImageUp,
  Tag,
  Ruler,
  DollarSign,
  Shield,
  Upload,
  X,
  Check,
  PackageCheck,
  Box,
  Hash,
  Weight,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const ProductForm = ({
  formData,
  errors,
  loading,
  onFormChange,
  onSubmit,
  categories = [],
  categoryLoading = false,
}) => {
  // Get subcategories based on selected category
  const availableSubcategories = useMemo(() => {
    if (!formData.category || categories.length === 0) {
      return [];
    }

    const selectedCategory = categories.find(
      (cat) => cat.slug === formData.category
    );
    return selectedCategory?.subcategories || [];
  }, [formData.category, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["length", "width", "thickness"].includes(name)) {
      onFormChange({
        size: { ...formData.size, [name]: value },
      });
    } else if (name.startsWith("compliance_")) {
      const field = name.replace("compliance_", "");
      onFormChange({
        compliance_standards: {
          ...formData.compliance_standards,
          [field]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      onFormChange({ [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onFormChange({
      productImages: [...formData.productImages, ...files],
    });
  };

  const removeImage = (idx) => {
    onFormChange({
      productImages: formData.productImages.filter((_, i) => i !== idx),
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Product Type */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-blue-900" />
          <h2 className="text-base font-semibold text-gray-900">
            Product Type
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "ready-to-go", label: "Ready to Go", icon: PackageCheck },
            { value: "made-to-order", label: "Made to Order", icon: Ruler },
            { value: "CNC", label: "CNC Machined", icon: Box },
            { value: "stone-cutting", label: "Stone Cutting", icon: Layers },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onFormChange({ product_type: value })}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.product_type === value
                  ? "border-blue-900 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Icon
                className={`w-6 h-6 mx-auto mb-2 ${
                  formData.product_type === value
                    ? "text-blue-900"
                    : "text-gray-400"
                }`}
              />
              <span
                className={`text-xs font-medium block ${
                  formData.product_type === value
                    ? "text-blue-900"
                    : "text-gray-600"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-900" />
          <h2 className="text-base font-semibold text-gray-900">
            Basic Information
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="productName"
                placeholder="Enter product name"
                value={formData.productName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm ${
                  errors.productName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.productName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.productName}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Hash className="w-4 h-4" />
                Product SKU
              </label>
              <input
                type="text"
                name="product_sku"
                placeholder="SKU-12345"
                value={formData.product_sku}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Box className="w-4 h-4" />
                Material <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="product_material"
                placeholder="e.g., Carrara Marble, Black Granite"
                value={formData.product_material}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm ${
                  errors.product_material ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <ImageUp className="w-5 h-5 text-blue-900" />
          <h2 className="text-base font-semibold text-gray-900">
            Product Images
          </h2>
        </div>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-900 hover:bg-blue-50/50 transition-all">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-700">
            Click to upload images
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Minimum 3 images required (JPG, PNG - Max 200KB each)
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {formData.productImages.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            {formData.productImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={typeof img === "string" ? img : URL.createObjectURL(img)}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-20 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {formData.productImages.length > 0 &&
          formData.productImages.length < 3 && (
            <p className="text-red-500 text-xs mt-2">
              At least 3 images required
            </p>
          )}
        {errors.productImages && (
          <p className="text-red-500 text-xs mt-2">{errors.productImages}</p>
        )}
      </div>

      {/* Category & Classification */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-blue-900" />
          <h2 className="text-base font-semibold text-gray-900">
            Category & Classification
          </h2>
        </div>

        {categoryLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner className="w-6 h-6" />
            <span className="ml-2 text-sm text-gray-500">
              Loading categories...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Category <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  onFormChange({ category: value, subCategory: "" });
                }}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.category ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Sub-Category <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.subCategory}
                onValueChange={(value) => onFormChange({ subCategory: value })}
                disabled={
                  !formData.category || availableSubcategories.length === 0
                }
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.subCategory ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select Sub-Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {availableSubcategories.map((subCat) => (
                      <SelectItem key={subCat} value={subCat.toLowerCase()}>
                        {subCat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Grade <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.grade}
                onValueChange={(value) => onFormChange({ grade: value })}
              >
                <SelectTrigger
                  className={`w-full ${errors.grade ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Grade A (Premium)</SelectItem>
                  <SelectItem value="B">Grade B (Standard)</SelectItem>
                  <SelectItem value="C">Grade C (Economy)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="color"
                placeholder="e.g., White, Black"
                value={formData.color}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm ${
                  errors.color ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Origin <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="origin"
                placeholder="e.g., India, Italy"
                value={formData.origin}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm ${
                  errors.origin ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dimensions & Weight */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="w-5 h-5 text-blue-900" />
          <h2 className="text-base font-semibold text-gray-900">
            Dimensions & Weight
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["length", "width", "thickness"].map((field) => (
              <div key={field}>
                <label className="text-sm font-medium text-gray-700 mb-2 block capitalize">
                  {field} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name={field}
                    placeholder="0"
                    value={formData.size[field]}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm ${
                      errors[`size.${field}`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <Select
                    value={formData.size[`${field}Measurement`]}
                    onValueChange={(value) =>
                      onFormChange({
                        size: {
                          ...formData.size,
                          [`${field}Measurement`]: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {field === "thickness" ? (
                        <>
                          <SelectItem value="mm">mm</SelectItem>
                          <SelectItem value="cm">cm</SelectItem>
                          <SelectItem value="inch">inch</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="mm">mm</SelectItem>
                          <SelectItem value="m">m</SelectItem>
                          <SelectItem value="ft">ft</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Weight className="w-4 h-4" />
              Weight <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="weight"
                placeholder="0"
                value={formData.weight}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm ${
                  errors.weight ? "border-red-500" : "border-gray-300"
                }`}
              />
              <Select
                value={formData.weightMeasurement}
                onValueChange={(value) =>
                  onFormChange({ weightMeasurement: value })
                }
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="ton">ton</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-blue-900" />
          <h2 className="text-base font-semibold text-gray-900">
            Pricing & Inventory
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Price Per Unit <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="pricePerUnit"
                placeholder="0.00"
                value={formData.pricePerUnit}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm ${
                  errors.pricePerUnit ? "border-red-500" : "border-gray-300"
                }`}
              />
              <Select
                value={formData.priceUnit}
                onValueChange={(value) => onFormChange({ priceUnit: value })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sq.ft">sq.ft</SelectItem>
                  <SelectItem value="sq.m">sq.m</SelectItem>
                  <SelectItem value="piece">piece</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <PackageCheck className="w-4 h-4" />
              Available Stock
            </label>
            <input
              type="number"
              name="available_stock"
              placeholder="0"
              value={formData.available_stock}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Shipping Time (Days)
            </label>
            <input
              type="number"
              name="expected_shipping_time"
              placeholder="7"
              value={formData.expected_shipping_time}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Batch Number
            </label>
            <input
              type="text"
              name="batch_number"
              placeholder="BATCH-001"
              value={formData.batch_number}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Compliance Standards */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-900" />
          <h2 className="text-base font-semibold text-gray-900">
            Compliance Standards{" "}
            <span className="text-xs text-gray-500 font-normal">
              (Optional)
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="compliance_ce_marking"
              checked={formData.compliance_standards.ce_marking}
              onChange={handleChange}
              className="w-4 h-4 text-blue-900 rounded focus:ring-2 focus:ring-blue-900"
            />
            <span className="text-sm text-gray-700">CE Marking Certified</span>
          </label>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Material Standard
            </label>
            <input
              type="text"
              name="compliance_material_standard"
              placeholder="e.g., ISO 9001, ASTM"
              value={formData.compliance_standards.material_standard}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-900" />
          <h2 className="text-base font-semibold text-gray-900">
            Product Description
          </h2>
        </div>

        <textarea
          name="description"
          placeholder="Describe your product in detail... (Minimum 50 characters)"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        <div className="flex justify-between items-center mt-2">
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description}</p>
          )}
          <span
            className={`text-xs ml-auto ${
              formData.description.length >= 50
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {formData.description.length} / 50 characters
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-navyblue text-white py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Spinner />
            <span>Publishing Product...</span>
          </>
        ) : (
          <>
            <Check className="w-5 h-5" />
            <span>Publish Product</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ProductForm;
