import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, clearMessage } from "../../../../redux/slice/productSlice";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productFormSchema } from "../../schema/productForm.schema";
import { Eye, Package, Tag, DollarSign, ImageUp } from "lucide-react";
import { toast } from "sonner"

const AddProduct = () => {
  const dispatch = useDispatch();
  const { company } = useSelector((state) => state.company);
  const subCategories = company?.companyBasicInfo?.subCategory
    ? company.companyBasicInfo.subCategory.split(",").map((s) => s.trim())
    : [];
  const categories = company?.companyBasicInfo?.mainCategory
    ? company.companyBasicInfo.mainCategory.split(",").map((s) => s.trim())
    : [];

  const { product, loading, message, error } = useSelector(
    (state) => state.products || {}
  );

  const [errors, setErrors] = useState({});
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(0);
  const [formData, setFormData] = useState({
    productName: "",
    productImages: [],
    category: "",
    subCategory: "",
    grade: "",
    color: "",
    origin: "",
    size: {
      length: "",
      lengthMeasurement: "",
      width: "",
      widthMeasurement: "",
      thickness: "",
      thicknessMeasurement: "",
    },
    weight: "",
    weightMeasurement: "",
    pricePerUnit: "",
    priceUnit: "",
    description: "",
  });

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["length", "width", "thickness"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        size: { ...prev.size, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      productImages: [...prev.productImages, ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = productFormSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setErrors({});

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "size") {
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

      setFormData({
        productName: "",
        productImages: [],
        category: "",
        subCategory: "",
        grade: "",
        color: "",
        origin: "",
        size: {
          length: "",
          lengthMeasurement: "",
          width: "",
          widthMeasurement: "",
          thickness: "",
          thicknessMeasurement: "",
        },
        weight: "",
        weightMeasurement: "",
        pricePerUnit: "",
        priceUnit: "",
        description: "",
      });

      // alert(resultAction.message || "Product added successfully!");
      toast.success(resultAction.message);
    } catch (err) {
      alert(err || "Something went wrong");
    }
  };

  return (
    <div className="w-full mx-auto grid lg:grid-cols-2 gap-8 md:p-6">
      {/* Left: Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Add New Product
        </h2>

        {message && (
          <div className="p-3 text-sm rounded bg-green-100 text-green-700 border border-green-300 text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 text-sm rounded bg-red-100 text-red-700 border border-red-300 text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col">
          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            onChange={handleChange}
            aria-invalid={!!errors.productName}
            aria-describedby="error-productName"
            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-navyblue focus:outline-none focus:border-none ${
              errors.productName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.productName && (
            <p id="error-productName" className="text-red-500 text-xs mt-1">
              {errors.productName}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            Product Images
          </h4>
          <label className="flex items-center gap-2 border border-gray-300 p-3 mt-2 rounded-lg cursor-pointer focus-within:ring-2 focus-within:ring-navyblue">
            <ImageUp className="w-5 h-5 text-gray-500" />
            <span className="text-gray-500 text-sm">Upload Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-gray-500 text-xs mt-1">
            Minimum 3 images are required. Recommended dimensions: 500x340
            pixels and size should be less than 200kb for each image.
          </p>
          {formData.productImages.length > 0 &&
            formData.productImages.length < 3 && (
              <p className="text-red-500 text-sm mt-1">
                Please select at least 3 images.
              </p>
            )}
          {errors.productImages && (
            <p id="error-productImages" className="text-red-500 text-xs mt-1">
              {errors.productImages}
            </p>
          )}
          {formData.productImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {formData.productImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img)
                    }
                    alt={`Preview ${idx + 1}`}
                    className="h-20 w-20 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        productImages: prev.productImages.filter(
                          (_, i) => i !== idx
                        ),
                      }))
                    }
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger
                className={`w-full border p-6 rounded-lg ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          <div className="flex flex-col">
            <Select
              value={formData.subCategory}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, subCategory: value }))
              }
            >
              <SelectTrigger className={`w-full border p-6 rounded-lg ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}>
                <SelectValue placeholder="Select Sub Category" />
              </SelectTrigger>
              <SelectContent>
                {subCategories.map((subCat) => (
                  <SelectItem key={subCat} value={subCat}>
                    {subCat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subCategory && (
              <p id="error-subCategory" className="text-red-500 text-xs mt-1">
                {errors.subCategory}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <Select
            value={formData.grade}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, grade: value }))
            }
          >
            <SelectTrigger
              className={`w-full border p-6 rounded-lg ${
                errors.grade ? "border-red-500" : "border-gray-300"
              }`}
            >
              <SelectValue placeholder="Select a Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="A">Grade A</SelectItem>
                <SelectItem value="B">Grade B</SelectItem>
                <SelectItem value="C">Grade C</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
           <p className="text-gray-500 text-xs mt-1">
            Please write the accurate grade for product.
          </p>
          {errors.grade && (
            <p className="text-red-500 text-xs mt-1">{errors.grade}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["color", "origin"].map((field) => (
            <div key={field} className="flex flex-col">
              <input
                type="text"
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                aria-invalid={!!errors[field]}
                aria-describedby={`error-${field}`}
                className={`border p-3 rounded-lg focus:ring-2 focus:ring-navyblue focus:outline-none focus:border-none ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors[field] && (
                <p id={`error-${field}`} className="text-red-500 text-xs mt-1">
                  {errors[field]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Size Details
          </h3>
          <p className="text-gray-500 text-xs mb-2">
            Product Length, Width, Thickness, Weight must match the sizes defined by you.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {["length", "width", "thickness"].map((field) => (
              <div key={field} className="flex flex-col">
                <div className="flex gap-2">
                  <input
                    type="number"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData.size[field]}
                    onChange={handleChange}
                    aria-invalid={!!errors[`size.${field}`]}
                    aria-describedby={`error-size-${field}`}
                    className={`border p-3 rounded-lg w-2/3 focus:ring-2 focus:ring-navyblue focus:outline-none focus:border-none ${
                      errors[`size.${field}`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <Select
                    value={formData.size[`${field}Measurement`]}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        size: { ...prev.size, [`${field}Measurement`]: value },
                      }))
                    }
                  >
                    <SelectTrigger className="w-[50%] border p-6 rounded-lg">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {field === "thickness" ? (
                        <>
                          <SelectItem value="inch">inch</SelectItem>
                          <SelectItem value="cm">cm</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="ft">ft</SelectItem>
                          <SelectItem value="m">m</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {errors[`size.${field}`] && (
                  <p
                    id={`error-size-${field}`}
                    className="text-red-500 text-xs mt-1 ml-1"
                  >
                    {errors[`size.${field}`]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {[
            { field: "weight", unitOptions: ["kg", "ton"] },
            { field: "pricePerUnit", unitOptions: ["sq.ft", "sq.m", "piece"] },
          ].map(({ field, unitOptions }) => (
            <div key={field} className="flex flex-col">
              <div className="flex gap-2">
                <input
                  type="number"
                  name={field}
                  placeholder={field === "weight" ? "Weight" : "Price Per Unit"}
                  value={formData[field]}
                  onChange={handleChange}
                  aria-invalid={!!errors[field]}
                  aria-describedby={`error-${field}`}
                  className={`border p-3 rounded-lg w-2/3 focus:ring-2 focus:ring-navyblue focus:outline-none focus:border-none ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <Select
                  value={
                    field === "weight"
                      ? formData.weightMeasurement
                      : formData.priceUnit
                  }
                  onValueChange={(value) =>
                    setFormData((prev) =>
                      field === "weight"
                        ? { ...prev, weightMeasurement: value }
                        : { ...prev, priceUnit: value }
                    )
                  }
                >
                  <SelectTrigger className="w-[50%] border p-6 rounded-lg">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors[field] && (
                <p
                  id={`error-${field}`}
                  className="text-red-500 text-xs mt-1 ml-1"
                >
                  {errors[field]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col h-50">
          <textarea
            name="description"
            placeholder="Product description..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            aria-invalid={!!errors.description}
            aria-describedby="error-description"
            className={`w-full h-full border p-3 rounded-lg focus:ring-2 focus:ring-navyblue focus:outline-none focus:border-none ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p id="error-description" className="text-red-500 text-xs mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex justify-center items-center gap-3 w-full border border-navyblue bg-navyblue text-white py-3 rounded-lg shadow hover:bg-white hover:text-navyblue transition disabled:opacity-50 cursor-pointer"
        >
          {loading && <Spinner />}
          {loading ? "Submitting" : "Add Product"}
        </button>
      </form>

      {/* Right: Enhanced Preview Panel */}
      <div className="hidden lg:block sticky top-6 h-fit">
        <div className="=rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Preview Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-navyblue" />
              <h3 className="text-lg font-semibold text-navyblue">
                Live Preview
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              See how your product will appear
            </p>
          </div>

          {/* Image Gallery Section */}
          <div className="bg-white p-2 border-b border-gray-200">
            <div className="relative  rounded-lg p-8 mb-4 flex items-center justify-center min-h-[300px]">
              {formData.productImages.length > 0 ? (
                <img
                  src={
                    typeof formData.productImages[selectedPreviewImage] ===
                    "string"
                      ? formData.productImages[selectedPreviewImage]
                      : URL.createObjectURL(
                          formData.productImages[selectedPreviewImage]
                        )
                  }
                  alt="Product Preview"
                  className="max-h-[280px] max-w-full object-contain rounded-lg shadow-md"
                />
              ) : (
                <div className="text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No image uploaded</p>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {formData.productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {formData.productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPreviewImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                      selectedPreviewImage === idx
                        ? "border-navyblue ring-2 ring-indigo-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={
                        typeof img === "string" ? img : URL.createObjectURL(img)
                      }
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="p-6 space-y-4">
            {/* Product Name */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {formData.productName || "Product Name"}
              </h2>

              {/* Category Tags */}
              <div className="flex flex-wrap gap-2">
                {formData.category && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    <Tag className="w-3 h-3" />
                    {formData.category}
                  </span>
                )}
                {formData.subCategory && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {formData.subCategory}
                  </span>
                )}
                {formData.grade && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                    Grade {formData.grade}
                  </span>
                )}
              </div>
            </div>

            {/* Price Display */}
            {formData.pricePerUnit && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700 font-medium">
                    Price
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  ₹{formData.pricePerUnit}
                  <span className="text-sm font-normal text-green-600 ml-1">
                    per {formData.priceUnit || "unit"}
                  </span>
                </p>
              </div>
            )}

            {/* Specifications Grid */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Specifications
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {formData.color && (
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Color</p>
                    <p className="font-medium text-gray-900">
                      {formData.color}
                    </p>
                  </div>
                )}
                {formData.origin && (
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Origin</p>
                    <p className="font-medium text-gray-900">
                      {formData.origin}
                    </p>
                  </div>
                )}
                {formData.weight && (
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Weight</p>
                    <p className="font-medium text-gray-900">
                      {formData.weight} {formData.weightMeasurement}
                    </p>
                  </div>
                )}
                {(formData.size.length ||
                  formData.size.width ||
                  formData.size.thickness) && (
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs">Dimensions</p>
                    <p className="font-medium text-gray-900 text-xs">
                      {formData.size.length &&
                        `L: ${formData.size.length}${formData.size.lengthMeasurement} `}
                      {formData.size.width &&
                        `W: ${formData.size.width}${formData.size.widthMeasurement} `}
                      {formData.size.thickness &&
                        `T: ${formData.size.thickness}${formData.size.thicknessMeasurement}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Show placeholder if no specs */}
              {!formData.color &&
                !formData.origin &&
                !formData.weight &&
                !formData.size.length && (
                  <p className="text-gray-400 text-xs text-center py-2">
                    Specifications will appear here
                  </p>
                )}
            </div>

            {/* Description */}
            {formData.description && (
              <div className="bg-gray-50 border border-gray-500 rounded-lg p-4 h-50 overflow-y-auto">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {formData.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
