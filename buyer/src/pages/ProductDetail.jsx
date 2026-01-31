import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductDetails } from "../lib/redux/company/companySlice";
import Layout from "../components/common/Layout";
import ImageGallery from "../components/product/ImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import SellerInfo from "../components/product/SellerInfo";
import ComplianceSection from "../components/product/ComplianceSection";
import WarrantySection from "../components/product/WarrantySection";
import ShippingInfoSection from "../components/product/ShippingInfoSection";
import { ChevronRight, AlertCircle, FileText, Package } from "lucide-react";

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductDetails(productId));
  }, [dispatch, productId]);

  const { productDetail, loading, error } = useSelector(
    (state) => state.company
  );

  const { product, company, seller } = productDetail || {};
  const images = product?.productImages || [];

  if (error || !productDetail || !product) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || "Product Not Found"}
            </h2>
            <p className="text-gray-600 mb-4">
              The product you're looking for is not available.
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b bg-white">
          <div className="w-full mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="capitalize">
                {product.category?.[0] || "Products"}
              </span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 font-medium truncate max-w-md">
                {product.productName}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full mx-auto px-4 py-6">
          {/* Product Gallery + Info */}
          <div className="grid lg:grid-cols-2 gap-8 mb-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <ImageGallery images={images} productName={product.productName} />
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <ProductInfo product={product} seller={seller} />
            </div>
          </div>

          {/* Seller Info */}
          {company && (
            <div className="mb-6">
              <SellerInfo company={company} seller={seller} />
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Product Description
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Compliance Section */}
          <ComplianceSection product={product} />

          {/* Technical Specifications */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Technical Specifications
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  {product.category && (
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-600 font-medium bg-gray-50 w-1/4">
                        Category
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 capitalize">
                        {Array.isArray(product.category)
                          ? product.category.join(", ")
                          : product.category}
                      </td>
                    </tr>
                  )}

                  {product.subCategory && (
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-600 font-medium bg-gray-50">
                        Sub-Category
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 capitalize">
                        {Array.isArray(product.subCategory)
                          ? product.subCategory.join(", ")
                          : product.subCategory}
                      </td>
                    </tr>
                  )}

                  {product.grade && (
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-600 font-medium bg-gray-50">
                        Grade
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {product.grade}
                      </td>
                    </tr>
                  )}

                  {product.color && (
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-600 font-medium bg-gray-50">
                        Color
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {product.color}
                      </td>
                    </tr>
                  )}

                  {product.origin && (
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-600 font-medium bg-gray-50">
                        Origin / Made In
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {product.origin}
                      </td>
                    </tr>
                  )}

                  {product.size && (
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-600 font-medium bg-gray-50">
                        Dimensions (L × W × T)
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {product.size.length} {product.size.lengthMeasurement} ×{" "}
                        {product.size.width} {product.size.widthMeasurement} ×{" "}
                        {product.size.thickness}{" "}
                        {product.size.thicknessMeasurement}
                      </td>
                    </tr>
                  )}

                  {product.weight && (
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-600 font-medium bg-gray-50">
                        Weight
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {product.weight} {product.weightMeasurement}
                      </td>
                    </tr>
                  )}

                  {product.pricePerUnit && (
                    <tr>
                      <td className="py-3 px-4 text-sm text-gray-600 font-medium bg-gray-50">
                        Price
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        ₹{product.pricePerUnit.toLocaleString()} /{" "}
                        {product.priceUnit}
                        <span className="text-xs text-gray-500 ml-2">
                          (Price negotiable based on quantity)
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warranty Section */}
          <WarrantySection product={product} seller={seller} />

          {/* Shipping Info */}
          <ShippingInfoSection product={product} company={company} />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
