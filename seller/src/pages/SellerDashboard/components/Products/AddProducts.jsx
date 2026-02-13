// AddProduct.jsx - Updated with category fetch

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, clearMessage } from "../../../../redux/slice/productSlice";
import { fetchCategories } from "@/redux/slice/categorySlice";
import { Package, ChevronRight, Upload } from "lucide-react";
import { toast } from "sonner";
import ProductForm from "./ProductForm";
import BuyerPreview from "./BuyerPreview";
import BulkUploadModal from "./BulkUploadModal";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { company } = useSelector((state) => state.company);
  const { seller } = useSelector((state) => state.seller);
  const { loading, message, error } = useSelector(
    (state) => state.products || {}
  );
  const { categories, loading: categoryLoading } = useSelector(
    (state) => state.category
  );

  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    productName: "",
    product_sku: "",
    productImages: [],
    product_type: "ready-to-go",
    category: "",
    subCategory: "",
    grade: "",
    color: "",
    origin: "",
    product_material: "",
    size: {
      length: "",
      lengthMeasurement: "mm",
      width: "",
      widthMeasurement: "mm",
      thickness: "",
      thicknessMeasurement: "mm",
    },
    weight: "",
    weightMeasurement: "kg",
    pricePerUnit: "",
    priceUnit: "sq.ft",
    available_stock: "",
    expected_shipping_time: "7",
    batch_number: "",
    compliance_standards: {
      ce_marking: false,
      material_standard: "",
      technical_sheets: [],
      certificates: [],
    },
    description: "",
  });

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const handleFormChange = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      product_sku: "",
      productImages: [],
      product_type: "ready-to-go",
      category: "",
      subCategory: "",
      grade: "",
      color: "",
      origin: "",
      product_material: "",
      size: {
        length: "",
        lengthMeasurement: "mm",
        width: "",
        widthMeasurement: "mm",
        thickness: "",
        thicknessMeasurement: "mm",
      },
      weight: "",
      weightMeasurement: "kg",
      pricePerUnit: "",
      priceUnit: "sq.ft",
      available_stock: "",
      expected_shipping_time: "7",
      batch_number: "",
      compliance_standards: {
        ce_marking: false,
        material_standard: "",
        technical_sheets: [],
        certificates: [],
      },
      description: "",
    });
    setSelectedPreviewImage(0);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.productName || formData.productName.length < 2) {
        setErrors({
          productName: "Product name must be at least 2 characters",
        });
        toast.error("Please fix the errors in the form");
        return;
      }

      if (formData.productImages.length < 3) {
        setErrors({ productImages: "Minimum 3 images required" });
        toast.error("Please upload at least 3 product images");
        return;
      }

      if (!formData.category || !formData.subCategory || !formData.grade) {
        toast.error("Please fill all required category fields");
        return;
      }

      if (!formData.product_material || !formData.color || !formData.origin) {
        toast.error("Please fill all required product details");
        return;
      }

      if (
        !formData.size.length ||
        !formData.size.width ||
        !formData.size.thickness
      ) {
        toast.error("Please fill all dimension fields");
        return;
      }

      if (!formData.weight || !formData.pricePerUnit) {
        toast.error("Please fill weight and price fields");
        return;
      }

      if (!formData.description || formData.description.length < 50) {
        setErrors({
          description: "Description must be at least 50 characters",
        });
        toast.error("Please add a detailed product description");
        return;
      }

      setErrors({});

      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "size" || key === "compliance_standards") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "productImages") {
          formData[key].forEach((file) =>
            formDataToSend.append("productImages", file)
          );
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const resultAction = await dispatch(addProduct(formDataToSend)).unwrap();

      resetForm();
      toast.success(resultAction.message || "Product added successfully!");
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 z-10">
        <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span>Seller Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span>Products</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-900 font-medium">Add Product</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-900" />
                Add New Product
              </h1>
            </div>

            <button
              onClick={() => setShowBulkUpload(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 border-blue-900 text-blue-900 hover:bg-blue-50 rounded-lg font-medium transition-all text-sm"
            >
              <Upload className="w-4 h-4" />
              Bulk Upload
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT: Product Form */}
          <ProductForm
            formData={formData}
            errors={errors}
            loading={loading}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            categories={categories}
            categoryLoading={categoryLoading}
          />

          {/* RIGHT: Buyer Preview */}
          <BuyerPreview
            formData={formData}
            selectedPreviewImage={selectedPreviewImage}
            setSelectedPreviewImage={setSelectedPreviewImage}
            company={company}
            seller={seller}
          />
        </div>
      </div>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
      />
    </div>
  );
};

export default AddProduct;
