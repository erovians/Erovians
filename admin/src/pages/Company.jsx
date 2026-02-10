// // // src/pages/Company.jsx
// // import { useState } from 'react';
// // import { 
// //   Building2, 
// //   Search, 
// //   Filter, 
// //   Eye, 
// //   Package,
// //   Star,
// //   TrendingUp,
// //   Users,
// //   Globe,
// //   Phone,
// //   Mail,
// //   MapPin,
// //   Grid,
// //   List,
// //   CheckCircle,
// //   Clock,
// //   XCircle,
// //   FileText,
// //   Shield,
// //   ArrowLeft,
// //   Box,
// //   ChevronRight
// // } from 'lucide-react';
// // import { companiesData, getIndustries, getStatusCounts } from '../data/companiesData';

// // export default function Company() {
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [selectedCategory, setSelectedCategory] = useState('All');
// //   const [selectedStatus, setSelectedStatus] = useState('All');
// //   const [viewMode, setViewMode] = useState('grid');
// //   const [selectedCompany, setSelectedCompany] = useState(null);
// //   const [showAllCompanies, setShowAllCompanies] = useState(true);

// //   const categories = getIndustries();
// //   const statusCounts = getStatusCounts();
// //   const statusOptions = ['All', 'Active', 'Pending', 'Blocked'];

// //   const filteredCompanies = companiesData.filter(company => {
// //     const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                          company.description.toLowerCase().includes(searchQuery.toLowerCase());
    
// //     const matchesCategory = selectedCategory === 'All' || 
// //                            company.products.some(product => product.category === selectedCategory);
    
// //     const matchesStatus = selectedStatus === 'All' || company.status === selectedStatus;
    
// //     return matchesSearch && matchesCategory && matchesStatus;
// //   });

// //   const getStatusBadge = (status) => {
// //     switch(status) {
// //       case 'Active': 
// //         return (
// //           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-200">
// //             <CheckCircle className="w-3.5 h-3.5" />
// //             Verified
// //           </span>
// //         );
// //       case 'Pending': 
// //         return (
// //           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium border border-amber-200">
// //             <Clock className="w-3.5 h-3.5" />
// //             Pending
// //           </span>
// //         );
// //       case 'Blocked': 
// //         return (
// //           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium border border-red-200">
// //             <XCircle className="w-3.5 h-3.5" />
// //             Blocked
// //           </span>
// //         );
// //       default: return null;
// //     }
// //   };

// //   const handleViewProducts = (company) => {
// //     setSelectedCompany(company);
// //     setShowAllCompanies(false);
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   const handleBackToCompanies = () => {
// //     setSelectedCompany(null);
// //     setShowAllCompanies(true);
// //   };

// //   // Product View
// //   const ProductView = ({ company, onBack }) => {
// //     return (
// //       <div className="space-y-5">
// //         {/* Back Button */}
// //         <button
// //           onClick={onBack}
// //           className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
// //         >
// //           <ArrowLeft className="w-4 h-4" />
// //           Back to all companies
// //         </button>

// //         {/* Company Header */}
// //         <div className="bg-white border border-gray-200 rounded-lg p-6">
// //           <div className="flex items-start gap-5">
// //             <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
// //               <Building2 className="w-8 h-8 text-gray-600" />
// //             </div>
            
// //             <div className="flex-1">
// //               <div className="flex items-start justify-between mb-2">
// //                 <div>
// //                   <h1 className="text-2xl font-semibold text-gray-900 mb-1">{company.name}</h1>
// //                   <div className="flex items-center gap-3 text-sm text-gray-600">
// //                     <span className="flex items-center gap-1">
// //                       <MapPin className="w-4 h-4" />
// //                       {company.country}
// //                     </span>
// //                     <span className="flex items-center gap-1">
// //                       <Globe className="w-4 h-4" />
// //                       {company.regType}
// //                     </span>
// //                   </div>
// //                 </div>
// //                 {getStatusBadge(company.status)}
// //               </div>
              
// //               <p className="text-gray-600 text-sm mb-4">{company.description}</p>
              
// //               <div className="flex items-center gap-4 text-sm">
// //                 <div className="flex items-center gap-1">
// //                   <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
// //                   <span className="font-medium">{company.rating}</span>
// //                 </div>
// //                 <span className="text-gray-400">•</span>
// //                 <span className="text-gray-600">{company.employees} employees</span>
// //                 <span className="text-gray-400">•</span>
// //                 <span className="text-gray-600">{company.products.length} products</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Products Section */}
// //         <div>
// //           <div className="flex items-center justify-between mb-4">
// //             <h2 className="text-lg font-semibold text-gray-900">
// //               Products ({company.products.length})
// //             </h2>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
// //             {company.products.map((product) => (
// //               <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
// //                 {/* Product Image Placeholder */}
// //                 <div className="h-48 bg-gray-100 flex items-center justify-center">
// //                   <Package className="w-12 h-12 text-gray-300" />
// //                 </div>
                
// //                 <div className="p-4">
// //                   <div className="flex items-start justify-between mb-2">
// //                     <div className="flex-1">
// //                       <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
// //                       <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
// //                         {product.category}
// //                       </span>
// //                     </div>
// //                     <div className="flex items-center gap-1 text-sm">
// //                       <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
// //                       <span className="font-medium">{product.rating}</span>
// //                     </div>
// //                   </div>
                  
// //                   <div className="mt-3 pt-3 border-t border-gray-100">
// //                     <div className="flex items-center justify-between">
// //                       <div>
// //                         <div className="text-xl font-semibold text-gray-900">{product.price}</div>
// //                         <div className="text-xs text-gray-500">per unit</div>
// //                       </div>
// //                       <div className="text-right">
// //                         <div className="text-sm font-medium text-gray-900">{product.unitsSold.toLocaleString()}</div>
// //                         <div className="text-xs text-gray-500">units sold</div>
// //                       </div>
// //                     </div>
// //                   </div>
                  
// //                   <button className="w-full mt-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors">
// //                     View Details
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <div className="bg-white border-b border-gray-200">
// //         <div className="max-w-7xl mx-auto px-6 py-8">
// //           <div className="flex items-center justify-between mb-6">
// //             <div>
// //               <h1 className="text-3xl font-semibold text-gray-900 mb-2">
// //                 {selectedCompany ? selectedCompany.name : 'Company Directory'}
// //               </h1>
// //               <p className="text-gray-600">
// //                 {selectedCompany 
// //                   ? `Browse ${selectedCompany.products.length} products from this seller`
// //                   : `Showing ${filteredCompanies.length} of ${companiesData.length} companies`
// //                 }
// //               </p>
// //             </div>
// //           </div>

// //           {/* Stats - Only when showing all companies */}
// //           {showAllCompanies && (
// //             <div className="grid grid-cols-4 gap-4">
// //               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
// //                 <div className="text-2xl font-semibold text-gray-900 mb-1">{companiesData.length}</div>
// //                 <div className="text-sm text-gray-600">Total Companies</div>
// //               </div>
// //               <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
// //                 <div className="text-2xl font-semibold text-emerald-900 mb-1">{statusCounts.Active}</div>
// //                 <div className="text-sm text-emerald-700">Active</div>
// //               </div>
// //               <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
// //                 <div className="text-2xl font-semibold text-amber-900 mb-1">{statusCounts.Pending}</div>
// //                 <div className="text-sm text-amber-700">Pending</div>
// //               </div>
// //               <div className="bg-red-50 rounded-lg p-4 border border-red-200">
// //                 <div className="text-2xl font-semibold text-red-900 mb-1">{statusCounts.Blocked}</div>
// //                 <div className="text-sm text-red-700">Blocked</div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="max-w-7xl mx-auto px-6 py-6">
// //         {selectedCompany ? (
// //           <ProductView company={selectedCompany} onBack={handleBackToCompanies} />
// //         ) : (
// //           <>
// //             {/* Search and Filters */}
// //             <div className="mb-6">
// //               <div className="flex gap-3">
// //                 <div className="flex-1 relative">
// //                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                   <input
// //                     type="text"
// //                     placeholder="Search companies..."
// //                     value={searchQuery}
// //                     onChange={(e) => setSearchQuery(e.target.value)}
// //                     className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
// //                   />
// //                 </div>
                
// //                 <select
// //                   value={selectedCategory}
// //                   onChange={(e) => setSelectedCategory(e.target.value)}
// //                   className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
// //                 >
// //                   {categories.map(cat => (
// //                     <option key={cat} value={cat}>{cat}</option>
// //                   ))}
// //                 </select>

// //                 <select
// //                   value={selectedStatus}
// //                   onChange={(e) => setSelectedStatus(e.target.value)}
// //                   className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
// //                 >
// //                   {statusOptions.map(status => (
// //                     <option key={status} value={status}>{status}</option>
// //                   ))}
// //                 </select>

// //                 <div className="flex border border-gray-300 rounded-lg overflow-hidden">
// //                   <button
// //                     onClick={() => setViewMode('grid')}
// //                     className={`px-4 py-2 text-sm font-medium transition-colors ${
// //                       viewMode === 'grid' 
// //                         ? 'bg-gray-900 text-white' 
// //                         : 'bg-white text-gray-700 hover:bg-gray-50'
// //                     }`}
// //                   >
// //                     <Grid className="w-4 h-4" />
// //                   </button>
// //                   <button
// //                     onClick={() => setViewMode('list')}
// //                     className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
// //                       viewMode === 'list' 
// //                         ? 'bg-gray-900 text-white' 
// //                         : 'bg-white text-gray-700 hover:bg-gray-50'
// //                     }`}
// //                   >
// //                     <List className="w-4 h-4" />
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Companies Grid */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
// //               {filteredCompanies.map((company) => (
// //                 <CompanyCard
// //                   key={company.id}
// //                   company={company}
// //                   onViewProducts={() => handleViewProducts(company)}
// //                   getStatusBadge={getStatusBadge}
// //                 />
// //               ))}
// //             </div>

// //             {/* Empty State */}
// //             {filteredCompanies.length === 0 && (
// //               <div className="text-center py-16">
// //                 <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
// //                   <Building2 className="w-8 h-8 text-gray-400" />
// //                 </div>
// //                 <h3 className="text-lg font-semibold text-gray-900 mb-1">No companies found</h3>
// //                 <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // // Company Card Component
// // function CompanyCard({ company, onViewProducts, getStatusBadge }) {
// //   return (
// //     <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
// //       {/* Company Image/Logo Area */}
// //       <div className="h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden">
// //         <Building2 className="w-16 h-16 text-gray-300" />
// //         <div className="absolute top-3 right-3">
// //           {getStatusBadge(company.status)}
// //         </div>
// //       </div>

// //       <div className="p-5">
// //         {/* Company Name & Location */}
// //         <div className="mb-3">
// //           <h3 className="font-semibold text-gray-900 text-lg mb-1">{company.name}</h3>
// //           <div className="flex items-center gap-2 text-sm text-gray-600">
// //             <MapPin className="w-4 h-4" />
// //             <span>{company.country}</span>
// //           </div>
// //         </div>

// //         {/* Description */}
// //         <p className="text-sm text-gray-600 mb-4 line-clamp-2">{company.description}</p>

// //         {/* Category Tags */}
// //         <div className="flex flex-wrap gap-1.5 mb-4">
// //           {company.products.slice(0, 3).map((product, idx) => (
// //             <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
// //               {product.category}
// //             </span>
// //           ))}
// //           {company.products.length > 3 && (
// //             <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
// //               +{company.products.length - 3}
// //             </span>
// //           )}
// //         </div>

// //         {/* Stats */}
// //         <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 text-sm">
// //           <div className="flex items-center gap-1">
// //             <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
// //             <span className="font-medium">{company.rating}</span>
// //           </div>
// //           <span className="text-gray-300">|</span>
// //           <div className="flex items-center gap-1 text-gray-600">
// //             <Package className="w-4 h-4" />
// //             <span>{company.products.length} products</span>
// //           </div>
// //         </div>

// //         {/* Contact Info */}
// //         <div className="space-y-2 mb-4 text-sm">
// //           <div className="flex items-center gap-2 text-gray-600">
// //             <Mail className="w-4 h-4" />
// //             <span className="truncate">{company.contact.email}</span>
// //           </div>
// //           <div className="flex items-center gap-2 text-gray-600">
// //             <Phone className="w-4 h-4" />
// //             <span>{company.contact.phone}</span>
// //           </div>
// //         </div>

// //         {/* View Products Button */}
// //         <button
// //           onClick={() => onViewProducts(company)}
// //           disabled={company.status === 'Blocked'}
// //           className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
// //         >
// //           View Products
// //           <ChevronRight className="w-4 h-4" />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }




// // pages/Company.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Building2, MapPin, CheckCircle, AlertCircle, Search } from 'lucide-react';

// const Company = () => {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const res = await axios.get('/api/admin/companies'); // tumhara backend route
//         setCompanies(res.data.data || []);
//       } catch (error) {
//         console.error('Error fetching companies:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   // Search filter
//   const filteredCompanies = companies.filter(company =>
//     company.companyBasicInfo?.companyName
//       ?.toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   const handleCompanyClick = (companyId) => {
//     navigate(`/admin/companies/${companyId}/products`);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Header + Search */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         <h1 className="text-2xl font-bold text-gray-800">Registered Companies</h1>
        
//         <div className="relative w-full md:w-64">
//           <input
//             type="text"
//             placeholder="Search companies..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//         </div>
//       </div>

//       {/* Companies Grid */}
//       {filteredCompanies.length === 0 ? (
//         <div className="text-center py-10 text-gray-500">
//           No companies found {searchTerm && `matching "${searchTerm}"`}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredCompanies.map((company) => (
//             <div
//               key={company._id}
//               onClick={() => handleCompanyClick(company._id)}
//               className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
//             >
//               {/* Company Logo / Placeholder */}
//               <div className="h-40 bg-gray-100 flex items-center justify-center">
//                 {company.companyIntro?.logo ? (
//                   <img
//                     src={company.companyIntro.logo}
//                     alt={company.companyBasicInfo.companyName}
//                     className="max-h-full object-contain"
//                   />
//                 ) : (
//                   <Building2 className="h-16 w-16 text-gray-400" />
//                 )}
//               </div>

//               {/* Content */}
//               <div className="p-4">
//                 <h3 className="font-semibold text-lg mb-1 line-clamp-1">
//                   {company.companyBasicInfo.companyName}
//                 </h3>

//                 <div className="space-y-2 text-sm text-gray-600">
//                   <div className="flex items-center gap-2">
//                     <MapPin className="h-4 w-4" />
//                     <span className="line-clamp-1">
//                       {company.companyBasicInfo.address?.city || 'N/A'},{' '}
//                       {company.companyBasicInfo.address?.country || 'N/A'}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <span className="font-medium">Status:</span>
//                     {company.status === 'active' ? (
//                       <CheckCircle className="h-4 w-4 text-green-600" />
//                     ) : company.status === 'pending' ? (
//                       <AlertCircle className="h-4 w-4 text-yellow-600" />
//                     ) : (
//                       <AlertCircle className="h-4 w-4 text-red-600" />
//                     )}
//                     <span className="capitalize">{company.status}</span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <span className="font-medium">Reg. No:</span>
//                     <span>{company.companyBasicInfo.company_registration_number || 'N/A'}</span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <span className="font-medium">Category:</span>
//                     <span className="line-clamp-1">
//                       {company.companyBasicInfo.mainCategory?.join(', ') || 'N/A'}
//                     </span>
//                   </div>

//                   <div className="text-xs text-gray-500 mt-2">
//                     {company.companyBasicInfo.totalEmployees || 0} employees
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Company;



// pages/Companies.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, MapPin, CheckCircle, AlertCircle, Search, Loader2 } from 'lucide-react';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('/api/admin/companies');
        setCompanies(res.data.data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.companyBasicInfo?.companyName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Registered Companies</h1>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
          {searchTerm 
            ? `No companies found matching "${searchTerm}"`
            : "No registered companies yet"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company._id}
              onClick={() => navigate(`/admin/companies/${company._id}/products`)}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden group"
            >
              {/* Header / Logo */}
              <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                {company.companyIntro?.logo ? (
                  <img
                    src={company.companyIntro.logo}
                    alt={company.companyBasicInfo.companyName}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <Building2 className="h-20 w-20 text-gray-400 group-hover:text-blue-500 transition-colors" />
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {company.companyBasicInfo.companyName}
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1">
                      {company.companyBasicInfo.address?.city || 'N/A'}, {company.companyBasicInfo.address?.country || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Status:</span>
                    {company.status === 'active' ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Active</span>
                      </div>
                    ) : company.status === 'pending' ? (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Pending</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Suspended</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    Reg. No: {company.companyBasicInfo.company_registration_number || 'N/A'}
                  </div>

                  <div className="text-xs text-gray-500">
                    Categories: {company.companyBasicInfo.mainCategory?.join(', ') || 'N/A'}
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

export default Companies;