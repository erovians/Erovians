// pages/CompanyProducts.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, DollarSign, MapPin, ArrowLeft } from 'lucide-react';

const CompanyProducts = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Company details
        const companyRes = await axios.get(`/api/admin/companies/${companyId}`);
        setCompany(companyRes.data.data);

        // Products of this company
        const productsRes = await axios.get(`/api/admin/companies/${companyId}/products`);
        setProducts(productsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/companies')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{company?.companyBasicInfo?.companyName}</h1>
          <p className="text-gray-600">
            {products.length} Products • {company?.companyBasicInfo?.address?.country}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products found for this company
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/admin/companies/${companyId}/products/${product._id}`)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            >
              {/* Product Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {product.productImages?.[0] ? (
                  <img
                    src={product.productImages[0]}
                    alt={product.productName}
                    className="max-h-full object-contain"
                  />
                ) : (
                  <Package className="h-16 w-16 text-gray-400" />
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {product.productName}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">
                      {product.pricePerUnit} {product.currency} / {product.priceUnit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Origin: {product.origin}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>Stock: {product.available_stock}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium">Category:</span>
                    <span className="line-clamp-1">{product.category?.join(', ')}</span>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    Grade: {product.grade} • Color: {product.color}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyProducts;



// // pages/CompanyProducts.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ArrowLeft, Package, DollarSign, MapPin, AlertCircle } from 'lucide-react';

// const CompanyProducts = () => {
//   const { companyId } = useParams();
//   const [company, setCompany] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Company info
//         const companyRes = await axios.get(`/api/admin/companies/${companyId}`);
//         setCompany(companyRes.data.data);

//         // Products
//         const productsRes = await axios.get(`/api/admin/companies/${companyId}/products`);
//         setProducts(productsRes.data.data || []);
//       } catch (error) {
//         console.error('Error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [companyId]);

//   if (loading) return <div className="flex justify-center items-center h-screen"><Package className="h-12 w-12 animate-spin text-blue-600" /></div>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Back + Header */}
//       <div className="flex items-center gap-4 mb-8">
//         <button
//           onClick={() => navigate('/admin/companies')}
//           className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
//         >
//           <ArrowLeft className="h-5 w-5" />
//         </button>
        
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//             {company?.companyBasicInfo?.companyName}
//           </h1>
//           <p className="text-gray-600 mt-1">
//             {products.length} Products • {company?.companyBasicInfo?.address?.country || 'N/A'}
//           </p>
//         </div>
//       </div>

//       {/* Products */}
//       {products.length === 0 ? (
//         <div className="text-center py-16 bg-gray-50 rounded-xl">
//           <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
//           <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
//           <p className="text-gray-500">This company has not listed any products.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <div
//               key={product._id}
//               onClick={() => navigate(`/admin/companies/${companyId}/products/${product._id}`)}
//               className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden group"
//             >
//               {/* Image */}
//               <div className="h-48 bg-gray-50 flex items-center justify-center p-4">
//                 {product.productImages?.[0] ? (
//                   <img
//                     src={product.productImages[0]}
//                     alt={product.productName}
//                     className="max-h-full object-contain group-hover:scale-105 transition-transform"
//                   />
//                 ) : (
//                   <Package className="h-16 w-16 text-gray-400 group-hover:text-blue-500 transition-colors" />
//                 )}
//               </div>

//               {/* Details */}
//               <div className="p-5">
//                 <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
//                   {product.productName}
//                 </h3>

//                 <div className="space-y-3 text-sm">
//                   <div className="flex items-center gap-2">
//                     <DollarSign className="h-4 w-4 text-green-600" />
//                     <span className="font-bold">
//                       {product.pricePerUnit} {product.currency} / {product.priceUnit}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <MapPin className="h-4 w-4 text-blue-600" />
//                     <span className="text-gray-600">Origin: {product.origin}</span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Package className="h-4 w-4 text-purple-600" />
//                     <span className="text-gray-600">Stock: {product.available_stock}</span>
//                   </div>

//                   {product.status !== 'active' && (
//                     <div className="flex items-center gap-2 text-red-600 text-xs font-medium">
//                       <AlertCircle className="h-4 w-4" />
//                       <span>Status: {product.status}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyProducts;