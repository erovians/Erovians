// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getCompany } from "@/redux/slice/companySlice";
// import {
//   Factory,
//   Users,
//   TrendingUp,
//   Award,
//   Globe,
//   BadgeCheckIcon,
//   Dot,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// const CompanyOverview = () => {
//   const dispatch = useDispatch();
//   const { company, loading, error } = useSelector((state) => state.company);
//   const products = company?.products || [];
//   const [activeSection, setActiveSection] = useState("overview");
//   const [currentProductIndex, setCurrentProductIndex] = useState(0);

//   useEffect(() => {
//      dispatch(getCompany());
//   }, [dispatch]);

//   if (loading)
//     return <p className="text-center py-20">Loading company details...</p>;

//   if (error)
//     return (
//       <div className="text-center py-20">
//         <p className="text-red-500 mb-4">{error}</p>
//         <button
//           className="px-4 py-2 bg-orange-500 text-white rounded-lg"
//           onClick={() => dispatch(getCompany())}
//         >
//           Retry
//         </button>
//       </div>
//     );

//   if (!company) return null;

//   const companyData = {
//     name:
//       company?.companyBasicInfo.companyName ||
//       "No name found",
//     verified: true,
//     yearEstablished:
//       company?.companyBasicInfo.companyRegistrationYear || "2011",
//     location: company?.companyBasicInfo.locationOfRegistration,
//     employees: "11 - 50 People",
//     businessType: "Manufacturer",
//     revenue: "Below US$1 Million",
//     description: company?.companyIntro.companyDescription,
//     mainProducts: company?.companyBasicInfo?.subCategory || [
//       "PESTICIDES",
//       "HERBICIDES",
//       "FUNGICIDES",
//       "BIO STIMULANTS",
//       "PLANT GROWTH PROMOTERS",
//     ],
//     mainMarkets: [
//       { region: "Northern Europe", percentage: "10.00%" },
//       { region: "Western Europe", percentage: "10.00%" },
//       { region: "Eastern Asia", percentage: "10.00%" },
//     ],
//     factory: {
//       size: "10,000-30,000 sqm",
//       location:
//         "PLOT NO1SURVEY NO 264, BHAYLA, DHANVADA, Ahmedabad, Gujarat, 382210",
//       productionLines: 6,
//       contractManufacturing: "OEM Service Offered, Design Service Offered",
//       annualOutput: "Below US$1 Million",
//     },
//     rndTeam: "Less than 5 People",
//   };

//   const productItems =
//     products?.map((product, idx) => ({
//       id: product._id || idx,
//       name: product.productName,
//       image: product.productImages?.[0] || "/api/placeholder/200/250",
//       grade: product.grade,
//       description: product.description,
//       status: product.status,
//     })) || [];

//   const nextProduct = () =>
//     setCurrentProductIndex((prev) => (prev + 1) % products.length);
//   const prevProduct = () =>
//     setCurrentProductIndex(
//       (prev) => (prev - 1 + products.length) % products.length
//     );
//   const visibleProducts = () =>
//     Array.from(
//       { length: 4 },
//       (_, i) => productItems[(currentProductIndex + i) % productItems.length]
//     );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white py-6 px-4 sticky -top-5 z-20 shadow">
//         <div className="max-w-7xl mx-auto text-center">
//           <div className="flex justify-center mb-3">
//             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
//               <img src={company?.companyIntro.logo} alt="Company Logo" />
//             </div>
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold mb-2">
//             {companyData.name}.
//           </h1>
//           <div className="flex justify-center items-center gap-2 text-sm flex-wrap">
//             <Badge
//               className="bg-yellow-500  text-gray-900 font-semibold h-5 min-w-5 rounded-lg px-4 py-3  tabular-nums text-xs"
//               variant="outline"
//             >
//               20 YR
//             </Badge>
//             {companyData.verified && (
//               <div className="flex">
//                 <Badge
//                   variant="secondary"
//                   className="bg-blue-500 text-white dark:bg-blue-600"
//                 >
//                   <BadgeCheckIcon />
//                   Verified
//                 </Badge>
//               </div>
//             )}
//             <span>{companyData.location}</span>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto md:py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Sidebar */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden lg:sticky lg:top-50">
//             {/* Outer wrapper makes it scrollable horizontally on small screens */}
//             <div className="p-2 lg:p-4 overflow-x-auto">
//               {/* Use flex-row on small screens, flex-col on large */}
//               <div className="flex flex-row lg:flex-col gap-2 min-w-max lg:min-w-0">
//                 {[
//                   {
//                     icon: <Factory className="w-5 h-5" />,
//                     label: "Company Overview",
//                     section: "overview",
//                   },
//                   {
//                     icon: <Award className="w-5 h-5" />,
//                     label: "Selected Products",
//                     section: "products",
//                   },
//                   {
//                     icon: <TrendingUp className="w-5 h-5" />,
//                     label: "Production Capacity",
//                     section: "capacity",
//                   },
//                   {
//                     icon: <Users className="w-5 h-5" />,
//                     label: "R&D Capacity",
//                     section: "r&d",
//                   },
//                   {
//                     icon: <Globe className="w-5 h-5" />,
//                     label: "Trade Capacity",
//                     section: "trade",
//                   },
//                 ].map((item) => (
//                   <button
//                     key={item.section}
//                     onClick={() => setActiveSection(item.section)}
//                     className={`flex items-center gap-3 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
//                       activeSection === item.section
//                         ? "bg-navyblue text-white"
//                         : "hover:bg-gray-100 text-gray-700"
//                     }`}
//                   >
//                     {item.icon}
//                     <span className="font-medium text-sm">{item.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content Area */}
//         <div className="lg:col-span-3 space-y-6">
//           {activeSection === "overview" && (
//             <OverviewSection companyData={companyData} company={company} />
//           )}
//           {activeSection === "products" && (
//             <ProductCarousel
//               productItems={productItems}
//               next={nextProduct}
//               prev={prevProduct}
//             />
//           )}
//           {activeSection === "capacity" && (
//             <CapacitySection factory={companyData.factory} />
//           )}
//           {activeSection === "r&d" && (
//             <RDSection rndTeam={companyData.rndTeam} />
//           )}
//           {activeSection === "trade" && (
//             <TradeSection mainMarkets={companyData.mainMarkets} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---------------- Reusable Components ----------------
// const Detail = ({ label, value, blue }) => (
//   <div>
//     <h4 className="text-sm font-semibold text-gray-500 mb-2">{label}</h4>
//     <p className={blue ? "text-blue-600" : "text-gray-900"}>{value}</p>
//   </div>
// );

// const OverviewSection = ({ companyData, company }) => (
//   <div className="bg-white rounded-lg shadow-md overflow-hidden">
//     <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4">
//       <h2 className="text-2xl font-bold">COMPANY OVERVIEW</h2>
//     </div>
//     <div className="p-6 space-y-6">
//       <div className="flex gap-4 overflow-x-auto py-2">
//         {company?.companyIntro?.companyPhotos?.map((img, idx) => (
//           <img
//             key={idx}
//             src={img}
//             alt={`Company ${idx + 1}`}
//             className="w-64 h-48 object-cover rounded-lg flex-shrink-0"
//           />
//         ))}
//       </div>
//       <div>
//         <h3 className="text-xl font-bold mb-4">Basic Information</h3>
//         <p className="text-gray-700 leading-relaxed">
//           {companyData.description}
//         </p>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Detail label="Business Type" value={companyData.businessType} />
//         <Detail label="Country / Region" value={companyData.location} />
//         <Detail
//           label="Main Products"
//           value={companyData.mainProducts.join(", ")}
//           blue
//         />
//         <Detail label="Total Employees" value={companyData.employees} />
//         <Detail label="Total Annual Revenue" value={companyData.revenue} />
//         <Detail label="Year Established" value={companyData.yearEstablished} />
//         <div>
//           <h4 className="text-sm font-semibold text-gray-500 mb-2">
//             Main Markets
//           </h4>
//           <div className="space-y-1">
//             {companyData.mainMarkets.map((market, idx) => (
//               <p key={idx} className="text-blue-600">
//                 {market.region} {market.percentage}
//               </p>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const ProductCarousel = ({ productItems, next, prev }) => (
//   <div className="bg-white rounded-lg shadow-md overflow-hidden ">
//     <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4 flex justify-between items-center">
//       <h2 className="text-xl md:text-2xl font-bold">PRODUCTS</h2>
//       <p className="text-xs md:text-sm opacity-80">
//         Showing {productItems.length} products
//       </p>
//     </div>

//     <div className="pt-6 md:p-6 relative">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 ">
//         {productItems.map((product) => (
//           <div
//             key={product.id}
//             className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
//           >
//             <img
//               src={product.image}
//               alt={product.name}
//               className="w-full h-48 object-contain"
//               loading="lazy"
//             />
//             <div className="p-3">
//               <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
//                 {product.name}
//               </h4>
//               <div className="flex justify-between">
//                 {product.grade && (
//                   <p className="text-xs text-gray-500">
//                     Grade: {product.grade}
//                   </p>
//                 )}
//                 {product.status && (
//                   <p className="text-xs text-gray-500">
//                     <Dot
//                       size={15}
//                       strokeWidth={10}
//                       className={
//                         product.status === "active"
//                           ? "text-green-400"
//                           : product.status === "pending"
//                           ? "text-yellow-400"
//                           : "text-red-400"
//                       }
//                     />
//                   </p>
//                 )}
//               </div>
//               <p className="text-xs text-gray-600 line-clamp-3">
//                 {product.description}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// const CapacitySection = ({ factory }) => (
//   <div className="bg-white rounded-lg shadow-md overflow-hidden">
//     <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4">
//       <h2 className="text-2xl font-bold">PRODUCT CAPACITY</h2>
//     </div>
//     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//       <Detail label="Factory Size" value={factory.size} />
//       <Detail label="No. of Production Lines" value={factory.productionLines} />
//       <Detail label="Factory Country/Region" value={factory.location} />
//       <Detail
//         label="Contract Manufacturing"
//         value={factory.contractManufacturing}
//       />
//       <Detail label="Annual Output Value" value={factory.annualOutput} />
//     </div>
//   </div>
// );

// const RDSection = ({ rndTeam }) => (
//   <div className="bg-white rounded-lg shadow-md overflow-hidden">
//     <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4">
//       <h2 className="text-2xl font-bold">RESEARCH & DEVELOPMENT</h2>
//     </div>
//     <div className="p-6">
//       <h3 className="text-xl font-bold mb-4">Research & Development</h3>
//       <p className="text-gray-900">{rndTeam}</p>
//     </div>
//   </div>
// );

// const TradeSection = ({ mainMarkets }) => (
//   <div className="bg-white rounded-lg shadow-md overflow-hidden">
//     <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4">
//       <h2 className="text-2xl font-bold">TRADE CAPABILITIES</h2>
//     </div>
//     <div className="p-6 overflow-x-auto">
//       <table className="w-full">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//               Main markets
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//               Total Revenue(%)
//             </th>
//             <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//               Main Product(s)
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y">
//           {mainMarkets.map((market, idx) => (
//             <tr key={idx}>
//               <td className="px-4 py-3 text-gray-900">{market.region}</td>
//               <td className="px-4 py-3 text-gray-900">{market.percentage}</td>
//               <td className="px-4 py-3 text-gray-900">-</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

// export default CompanyOverview;



//best *************** appproch and latest approch 


import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompany } from "@/redux/slice/companySlice";
import {
  Factory,
  Users,
  TrendingUp,
  Award,
  Globe,
  BadgeCheck,
  Dot,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ============================================================================
// CONSTANTS
// ============================================================================
const NAVIGATION_ITEMS = [
  {
    icon: Factory,
    label: "Company Overview",
    section: "overview",
  },
  {
    icon: Award,
    label: "Selected Products",
    section: "products",
  },
  {
    icon: TrendingUp,
    label: "Production Capacity",
    section: "capacity",
  },
  {
    icon: Users,
    label: "R&D Capacity",
    section: "r&d",
  },
  {
    icon: Globe,
    label: "Trade Capacity",
    section: "trade",
  },
];

const PRODUCTS_PER_PAGE = 4;
const DEFAULT_COMPANY_DATA = {
  name: "Company Name",
  verified: false,
  yearEstablished: "N/A",
  location: "N/A",
  employees: "N/A",
  businessType: "N/A",
  revenue: "N/A",
  description: "No description available",
  mainProducts: [],
  mainMarkets: [],
  factory: {
    size: "N/A",
    location: "N/A",
    productionLines: 0,
    contractManufacturing: "N/A",
    annualOutput: "N/A",
  },
  rndTeam: "N/A",
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const getProductStatus = (status) => {
  const statusMap = {
    active: { color: "text-green-500", label: "Active" },
    pending: { color: "text-yellow-500", label: "Pending" },
    inactive: { color: "text-red-500", label: "Inactive" },
  };
  return statusMap[status?.toLowerCase()] || statusMap.inactive;
};

const calculateYearsInBusiness = (yearEstablished) => {
  if (!yearEstablished || yearEstablished === "N/A") return 0;
  return new Date().getFullYear() - parseInt(yearEstablished);
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Loading state component
 */
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navyblue mx-auto mb-4"></div>
      <p className="text-gray-600">Loading company details...</p>
    </div>
  </div>
);

/**
 * Error state component with retry functionality
 */
const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-md mx-auto p-6">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Failed to Load Company Details
      </h2>
      <p className="text-red-500 mb-6">{error}</p>
      <Button
        onClick={onRetry}
        className="bg-orange-500 hover:bg-orange-600 text-white"
      >
        Try Again
      </Button>
    </div>
  </div>
);

/**
 * Company header with logo, name, and verification badge
 */
const CompanyHeader = ({ company, yearsInBusiness }) => (
  <header className="bg-gradient-to-r from-gray-700 to-gray-600 text-white py-6 px-4 shadow-lg">
    <div className="max-w-7xl mx-auto text-center">
      {/* Company Logo */}
      {company?.companyIntro?.logo && (
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
            <img
              src={company.companyIntro.logo}
              alt={`${company.companyBasicInfo?.companyName} logo`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Company Name */}
      <h1 className="text-3xl md:text-4xl font-bold mb-3">
        {company?.companyBasicInfo?.companyName || "Company Name"}
      </h1>

      {/* Badges and Location */}
      <div className="flex justify-center items-center gap-3 text-sm flex-wrap">
        {yearsInBusiness > 0 && (
          <Badge
            className="bg-yellow-500 text-gray-900 font-semibold rounded-lg px-3 py-1"
            variant="outline"
          >
            {yearsInBusiness} YR
          </Badge>
        )}

        {company?.verified && (
          <Badge
            variant="secondary"
            className="bg-blue-500 text-white flex items-center gap-1"
          >
            <BadgeCheck className="w-4 h-4" />
            Verified
          </Badge>
        )}

        {company?.companyBasicInfo?.locationOfRegistration && (
          <span className="text-gray-200">
            {company.companyBasicInfo.locationOfRegistration}
          </span>
        )}
      </div>
    </div>
  </header>
);

/**
 * Sidebar navigation for different sections
 */
const Sidebar = ({ activeSection, onSectionChange }) => (
  <aside className="lg:col-span-1">
    <div className="bg-white rounded-lg shadow-md overflow-hidden lg:sticky lg:top-24">
      <nav
        className="p-2 lg:p-4 overflow-x-auto"
        aria-label="Company section navigation"
      >
        <div className="flex flex-row lg:flex-col gap-2 min-w-max lg:min-w-0">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;

            return (
              <button
                key={item.section}
                onClick={() => onSectionChange(item.section)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-navyblue text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-700 hover:shadow-sm"
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  </aside>
);

/**
 * Reusable detail display component
 */
const DetailItem = ({ label, value, highlight = false, className = "" }) => (
  <div className={className}>
    <h4 className="text-sm font-semibold text-gray-500 mb-2">{label}</h4>
    <p
      className={`${
        highlight ? "text-blue-600 font-medium" : "text-gray-900"
      } break-words`}
    >
      {value || "N/A"}
    </p>
  </div>
);

/**
 * Company overview section with photos and basic information
 */
const OverviewSection = ({ companyData, company }) => (
  <section className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4">
      <h2 className="text-2xl font-bold">COMPANY OVERVIEW</h2>
    </div>

    <div className="p-6 space-y-6">
      {/* Company Photos */}
      {company?.companyIntro?.companyPhotos?.length > 0 && (
        <div className="flex gap-4 overflow-x-auto py-2 snap-x snap-mandatory">
          {company.companyIntro.companyPhotos.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${companyData.name} facility ${idx + 1}`}
              className="w-64 h-48 object-cover rounded-lg flex-shrink-0 snap-center shadow-sm hover:shadow-md transition-shadow"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* Company Description */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Basic Information
        </h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {companyData.description}
        </p>
      </div>

      {/* Company Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailItem label="Business Type" value={companyData.businessType} />
        <DetailItem label="Country / Region" value={companyData.location} />
        <DetailItem
          label="Main Products"
          value={companyData.mainProducts.join(", ")}
          highlight
        />
        <DetailItem label="Total Employees" value={companyData.employees} />
        <DetailItem
          label="Total Annual Revenue"
          value={companyData.revenue}
        />
        <DetailItem
          label="Year Established"
          value={companyData.yearEstablished}
        />

        {/* Main Markets */}
        {companyData.mainMarkets.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-500 mb-2">
              Main Markets
            </h4>
            <div className="space-y-1">
              {companyData.mainMarkets.map((market, idx) => (
                <p key={idx} className="text-blue-600 font-medium">
                  {market.region} - {market.percentage}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
);

/**
 * Product display card
 */
const ProductCard = ({ product }) => {
  const statusInfo = getProductStatus(product.status);

  return (
    <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 bg-white h-full flex flex-col">
      <div className="relative w-full h-48 bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 flex-1">
          {product.name}
        </h4>

        <div className="space-y-1 text-xs text-gray-600">
          {product.grade && (
            <p>
              <span className="font-medium">Grade:</span> {product.grade}
            </p>
          )}

          {product.description && (
            <p className="line-clamp-2">{product.description}</p>
          )}

          {product.status && (
            <div className="flex items-center gap-1 pt-1">
              <Dot
                size={20}
                strokeWidth={10}
                className={statusInfo.color}
                aria-hidden="true"
              />
              <span className={`${statusInfo.color} font-medium`}>
                {statusInfo.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

/**
 * Products grid section
 */
const ProductsSection = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <section className="bg-white rounded-lg shadow-md overflow-hidden p-12 text-center">
        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No products available</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold">PRODUCTS</h2>
        <p className="text-xs md:text-sm opacity-90">
          Showing {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Production capacity section
 */
const CapacitySection = ({ factory }) => (
  <section className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4">
      <h2 className="text-2xl font-bold">PRODUCTION CAPACITY</h2>
    </div>

    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <DetailItem label="Factory Size" value={factory.size} />
      <DetailItem
        label="No. of Production Lines"
        value={factory.productionLines}
      />
      <DetailItem
        label="Factory Country/Region"
        value={factory.location}
        className="md:col-span-2"
      />
      <DetailItem
        label="Contract Manufacturing"
        value={factory.contractManufacturing}
      />
      <DetailItem label="Annual Output Value" value={factory.annualOutput} />
    </div>
  </section>
);

/**
 * R&D section
 */
const RDSection = ({ rndTeam }) => (
  <section className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4">
      <h2 className="text-2xl font-bold">RESEARCH & DEVELOPMENT</h2>
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">R&D Team Size</h3>
      <p className="text-gray-900 text-lg">{rndTeam}</p>
    </div>
  </section>
);

/**
 * Trade capabilities section with markets table
 */
const TradeSection = ({ mainMarkets }) => (
  <section className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-4">
      <h2 className="text-2xl font-bold">TRADE CAPABILITIES</h2>
    </div>

    <div className="p-6 overflow-x-auto">
      {mainMarkets.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No trade data available
        </p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                Main Markets
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                Total Revenue (%)
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                Main Product(s)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mainMarkets.map((market, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-900">{market.region}</td>
                <td className="px-4 py-3 text-gray-900">{market.percentage}</td>
                <td className="px-4 py-3 text-gray-500">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </section>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Company Overview Page - Main component
 */
const CompanyOverview = () => {
  const dispatch = useDispatch();
  const { company, loading, error } = useSelector((state) => state.company);

  const [activeSection, setActiveSection] = useState("overview");

  // Fetch company data on mount
  useEffect(() => {
    dispatch(getCompany());
  }, [dispatch]);

  // Handle section change
  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    // Scroll to top of content area
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    dispatch(getCompany());
  }, [dispatch]);

  // Memoize company data transformation
  const companyData = useMemo(() => {
    if (!company) return DEFAULT_COMPANY_DATA;

    return {
      name: company.companyBasicInfo?.companyName || DEFAULT_COMPANY_DATA.name,
      verified: company.verified ?? false,
      yearEstablished:
        company.companyBasicInfo?.companyRegistrationYear ||
        DEFAULT_COMPANY_DATA.yearEstablished,
      location:
        company.companyBasicInfo?.locationOfRegistration ||
        DEFAULT_COMPANY_DATA.location,
      employees: DEFAULT_COMPANY_DATA.employees,
      businessType: DEFAULT_COMPANY_DATA.businessType,
      revenue: DEFAULT_COMPANY_DATA.revenue,
      description:
        company.companyIntro?.companyDescription ||
        DEFAULT_COMPANY_DATA.description,
      mainProducts:
        company.companyBasicInfo?.subCategory || DEFAULT_COMPANY_DATA.mainProducts,
      mainMarkets: DEFAULT_COMPANY_DATA.mainMarkets,
      factory: DEFAULT_COMPANY_DATA.factory,
      rndTeam: DEFAULT_COMPANY_DATA.rndTeam,
    };
  }, [company]);

  // Memoize products transformation
  const products = useMemo(() => {
    if (!company?.products || company.products.length === 0) return [];

    return company.products.map((product, idx) => ({
      id: product._id || `product-${idx}`,
      name: product.productName || "Unnamed Product",
      image: product.productImages?.[0] || "/api/placeholder/200/250",
      grade: product.grade,
      description: product.description,
      status: product.status,
    }));
  }, [company?.products]);

  // Calculate years in business
  const yearsInBusiness = useMemo(
    () => calculateYearsInBusiness(companyData.yearEstablished),
    [companyData.yearEstablished]
  );

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  // No company data
  if (!company) {
    return (
      <ErrorState
        error="No company data found"
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader company={company} yearsInBusiness={yearsInBusiness} />

      <main className="max-w-7xl mx-auto py-6 px-4 md:py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        <div className="lg:col-span-3 space-y-6">
          {activeSection === "overview" && (
            <OverviewSection companyData={companyData} company={company} />
          )}
          {activeSection === "products" && (
            <ProductsSection products={products} />
          )}
          {activeSection === "capacity" && (
            <CapacitySection factory={companyData.factory} />
          )}
          {activeSection === "r&d" && (
            <RDSection rndTeam={companyData.rndTeam} />
          )}
          {activeSection === "trade" && (
            <TradeSection mainMarkets={companyData.mainMarkets} />
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyOverview;