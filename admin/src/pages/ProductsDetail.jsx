// // pages/ProductDetail.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { DollarSign, MapPin, Package, ArrowLeft, Image as ImageIcon } from 'lucide-react';

// const ProductDetail = () => {
//   const { companyId, productId } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(`/api/admin/companies/${companyId}/products/${productId}`);
//         setProduct(res.data.data);
//       } catch (error) {
//         console.error('Error fetching product:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [companyId, productId]);

//   if (loading) return <div className="text-center py-10">Loading...</div>;
//   if (!product) return <div className="text-center py-10 text-red-600">Product not found</div>;

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(`/admin/companies/${companyId}/products`)}
//         className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
//       >
//         <ArrowLeft className="h-5 w-5" />
//         Back to Products
//       </button>

//       <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="p-6 border-b">
//           <h1 className="text-2xl font-bold text-gray-800">{product.productName}</h1>
//           <p className="text-gray-600 mt-1">{product.description}</p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6 p-6">
//           {/* Images */}
//           <div>
//             {product.productImages?.length > 0 ? (
//               <div className="grid grid-cols-2 gap-3">
//                 {product.productImages.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img}
//                     alt={`${product.productName} - ${idx + 1}`}
//                     className="w-full h-48 object-cover rounded-lg border"
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
//                 <ImageIcon className="h-16 w-16 text-gray-400" />
//               </div>
//             )}
//           </div>

//           {/* Details */}
//           <div className="space-y-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 text-green-600 mb-1">
//                   <DollarSign className="h-5 w-5" />
//                   <span className="font-medium">Price</span>
//                 </div>
//                 <p className="text-xl font-bold">
//                   {product.pricePerUnit} {product.currency} / {product.priceUnit}
//                 </p>
//               </div>

//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 text-blue-600 mb-1">
//                   <MapPin className="h-5 w-5" />
//                   <span className="font-medium">Origin</span>
//                 </div>
//                 <p className="text-lg">{product.origin}</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 text-purple-600 mb-1">
//                   <Package className="h-5 w-5" />
//                   <span className="font-medium">Stock</span>
//                 </div>
//                 <p className="text-xl font-bold">{product.available_stock}</p>
//               </div>

//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 text-amber-600 mb-1">
//                   <span className="font-medium">Grade / Color</span>
//                 </div>
//                 <p className="text-lg">
//                   Grade: {product.grade} • Color: {product.color}
//                 </p>
//               </div>
//             </div>

//             {/* Size */}
//             {product.size && (
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-medium mb-2">Dimensions</h3>
//                 <p>
//                   Length: {product.size.length} {product.size.lengthMeasurement}
//                   <br />
//                   Width: {product.size.width} {product.size.widthMeasurement}
//                   <br />
//                   Thickness: {product.size.thickness} {product.size.thicknessMeasurement}
//                 </p>
//               </div>
//             )}

//             {/* Compliance */}
//             {product.compliance_standards && (
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-medium mb-2">Compliance & Certificates</h3>
//                 <ul className="list-disc pl-5 space-y-1">
//                   {product.compliance_standards.ce_marking && <li>CE Marking: Yes</li>}
//                   {product.compliance_standards.material_standard && (
//                     <li>Material Standard: {product.compliance_standards.material_standard}</li>
//                   )}
//                   {product.compliance_standards.technical_sheets?.length > 0 && (
//                     <li>Technical Sheets: {product.compliance_standards.technical_sheets.length}</li>
//                   )}
//                   {product.compliance_standards.certificates?.length > 0 && (
//                     <li>Certificates: {product.compliance_standards.certificates.length}</li>
//                   )}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;


// pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DollarSign, MapPin, Package, ArrowLeft, Image as ImageIcon, AlertCircle } from 'lucide-react';

const ProductDetail = () => {
  const { companyId, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/admin/companies/${companyId}/products/${productId}`);
        setProduct(res.data.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [companyId, productId]);

  if (loading) return <div className="flex justify-center items-center h-screen"><Package className="h-12 w-12 animate-spin text-blue-600" /></div>;
  if (!product) return <div className="text-center py-20 text-red-600">Product not found</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(`/admin/companies/${companyId}/products`)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 font-medium"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to {company?.companyBasicInfo?.companyName || 'Company'} Products
      </button>

      {/* Main Content */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 border-b bg-gradient-to-r from-gray-50 to-white">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {product.productName}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Images Section */}
          <div className="space-y-4">
            {product.productImages?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.productImages.map((img, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden border bg-gray-50">
                    <img
                      src={img}
                      alt={`${product.productName} - ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-20 w-20 text-gray-400" />
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-5 rounded-xl">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-medium">Price</span>
                </div>
                <p className="text-2xl font-bold text-green-800">
                  {product.pricePerUnit} {product.currency}
                  <span className="text-lg font-normal"> / {product.priceUnit}</span>
                </p>
              </div>

              <div className="bg-blue-50 p-5 rounded-xl">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <Package className="h-5 w-5" />
                  <span className="font-medium">Stock</span>
                </div>
                <p className="text-2xl font-bold text-blue-800">
                  {product.available_stock}
                </p>
              </div>
            </div>

            {/* Origin & Grade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 p-5 rounded-xl">
                <div className="flex items-center gap-2 text-amber-700 mb-1">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">Origin</span>
                </div>
                <p className="text-lg font-medium">{product.origin}</p>
              </div>

              <div className="bg-purple-50 p-5 rounded-xl">
                <div className="flex items-center gap-2 text-purple-700 mb-1">
                  <span className="font-medium">Grade / Color</span>
                </div>
                <p className="text-lg font-medium">
                  {product.grade} • {product.color}
                </p>
              </div>
            </div>

            {/* Size */}
            {product.size && (
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-medium text-gray-800 mb-3">Dimensions</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Length</span>
                    <p className="font-medium">
                      {product.size.length} {product.size.lengthMeasurement}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Width</span>
                    <p className="font-medium">
                      {product.size.width} {product.size.widthMeasurement}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Thickness</span>
                    <p className="font-medium">
                      {product.size.thickness} {product.size.thicknessMeasurement}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Compliance */}
            {product.compliance_standards && Object.keys(product.compliance_standards).length > 0 && (
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-medium text-gray-800 mb-3">Compliance & Certificates</h3>
                <ul className="space-y-2 text-sm">
                  {product.compliance_standards.ce_marking && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>CE Marking: Yes</span>
                    </li>
                  )}
                  {product.compliance_standards.material_standard && (
                    <li>Material Standard: {product.compliance_standards.material_standard}</li>
                  )}
                  {product.compliance_standards.technical_sheets?.length > 0 && (
                    <li>Technical Sheets: {product.compliance_standards.technical_sheets.length}</li>
                  )}
                  {product.compliance_standards.certificates?.length > 0 && (
                    <li>Certificates: {product.compliance_standards.certificates.length}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;