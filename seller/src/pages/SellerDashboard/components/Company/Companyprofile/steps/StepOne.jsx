// import React from "react";
// import CountryStateSelect from "../../Helper/CountryStateSelect";
// import {
//   User,
//   MapPin,
//   Calendar,
//   Building,
//   Layers,
//   X,
//   Plus,
//   DollarSign,
//   CreditCard,
//   Globe,
// } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";

// const currencies = [
//   "USD",
//   "EUR",
//   "JPY",
//   "CAD",
//   "AUD",
//   "HKD",
//   "GBP",
//   "CNY",
//   "CHF",
// ];
// const paymentTypes = [
//   "T/T",
//   "L/C",
//   "D/P D/A",
//   "MoneyGram",
//   "Credit Card",
//   "PayPal",
//   "Western Union",
//   "Cash",
//   "Escrow",
// ];
// const languages = [
//   "English",
//   "Chinese",
//   "Spanish",
//   "Japanese",
//   "Portuguese",
//   "German",
//   "Arabic",
//   "French",
//   "Russian",
//   "Korean",
//   "Hindi",
//   "Italian",
// ];
// const categories = [
//   "Natural Stones",
//   "Ceramic & Tiles",
//   "Alternatives & Finishes",
// ];

// export default function StepOne({
//   formData = {
//     companyName: "",
//     legalowner: "",
//     locationOfRegistration: "",
//     companyRegistrationYear: "",
//     address: {},
//     mainCategory: [""],
//     mainProduct: [""],
//     acceptedCurrency: [],
//     acceptedPaymentType: [],
//     languageSpoken: [],
//   },
//   setFormData = () => {},
//   errors = {},
// }) {
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       address: { ...(prev.address || {}), [name]: value },
//     }));
//   };

//   const handleCheckboxGroupChange = (field, value) => {
//     setFormData((prev) => {
//       const current = prev[field] || [];
//       const updated = current.includes(value)
//         ? current.filter((i) => i !== value)
//         : [...current, value];
//       return { ...prev, [field]: updated };
//     });
//   };

//   const inputClass = (hasErr) =>
//     `text-sm w-full pl-3 pr-3 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navyblue focus:border-transparent ${
//       hasErr
//         ? "border-red-400"
//         : "border-gray-300 bg-white hover:border-gray-400"
//     }`;

//   return (
//     <div className="max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg">
//       <div className="space-y-8">
//         {/* Basic Information Card */}
//         <div className="bg-white rounded-xl p-2 md:p-6 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
//             <Building className="text-navyblue" size={22} />
//             Basic Information
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Company Name */}
//             <div className="flex flex-col">
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                   <User className="text-gray-400" size={20} />
//                 </div>
//                 <input
//                   type="text"
//                   name="companyName"
//                   value={formData.companyName}
//                   onChange={handleChange}
//                   placeholder=" "
//                   className={`${inputClass(
//                     Boolean(errors.companyName)
//                   )} pl-10 peer`}
//                 />
//                 <label className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600">
//                   Company name <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <p className="text-gray-500 text-xs mt-1 ml-1">
//                 Enter your registered business or trading name.
//               </p>
//               {errors.companyName && (
//                 <p className="text-red-500 text-xs mt-1 ml-1">
//                   ⚠ {errors.companyName}
//                 </p>
//               )}
//             </div>

//             {/* Legal Owner */}
//             <div className="flex flex-col">
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                   <User className="text-gray-400" size={20} />
//                 </div>
//                 <input
//                   type="text"
//                   name="legalowner"
//                   value={formData.legalowner}
//                   onChange={handleChange}
//                   placeholder=" "
//                   className={`${inputClass(
//                     Boolean(errors.legalowner)
//                   )} pl-10 peer`}
//                 />
//                 <label className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600">
//                   Legal owner <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <p className="text-gray-500 text-xs mt-1 ml-1">
//                 Mention the full legal name of the company’s owner or director.
//               </p>
//               {errors.legalowner && (
//                 <p className="text-red-500 text-xs mt-1 ml-1">
//                   ⚠ {errors.legalowner}
//                 </p>
//               )}
//             </div>

//             {/* Location of Registration */}
//             <div className="flex flex-col">
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                   <MapPin className="text-gray-400" size={20} />
//                 </div>
//                 <input
//                   type="text"
//                   name="locationOfRegistration"
//                   value={formData.locationOfRegistration}
//                   onChange={handleChange}
//                   placeholder=" "
//                   className={`${inputClass(
//                     Boolean(errors.locationOfRegistration)
//                   )} pl-10 peer`}
//                 />
//                 <label className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600">
//                   Location of registration{" "}
//                   <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <p className="text-gray-500 text-xs mt-1 ml-1">
//                 Enter the city or country where your business is officially
//                 registered.
//               </p>
//               {errors.locationOfRegistration && (
//                 <p className="text-red-500 text-xs mt-1 ml-1">
//                   ⚠ {errors.locationOfRegistration}
//                 </p>
//               )}
//             </div>

//             {/* Registration Year */}
//             <div className="flex flex-col">
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                   <Calendar className="text-gray-400" size={20} />
//                 </div>

//                 <Select
//                   value={formData.companyRegistrationYear}
//                   onValueChange={(value) =>
//                     handleChange({
//                       target: { name: "companyRegistrationYear", value },
//                     })
//                   }
//                 >
//                   <SelectTrigger
//                     className={`${inputClass(
//                       Boolean(errors.companyRegistrationYear)
//                     )} p-5.5 pl-10`}
//                   >
//                     <SelectValue placeholder="Select year" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Array.from(
//                       { length: 100 },
//                       (_, i) => new Date().getFullYear() - i
//                     ).map((year) => (
//                       <SelectItem key={year} value={year.toString()}>
//                         {year}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <label className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600">
//                   Year Company Registered{" "}
//                   <span className="text-red-500">*</span>
//                 </label>
//               </div>

//               <p className="text-gray-500 text-xs mt-1 ml-1">
//                 Select the year when your business was legally registered.
//               </p>

//               {errors.companyRegistrationYear && (
//                 <p className="text-red-500 text-xs mt-1 ml-1">
//                   ⚠ {errors.companyRegistrationYear}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Address Card */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
//             <MapPin className="text-navyblue" size={22} />
//             Company Operational Address <span className="text-red-500">*</span>
//           </h3>

//           {/* Country + State Dropdown */}
//           <div className="mb-6">
//             <CountryStateSelect
//               formData={formData}
//               setFormData={setFormData}
//               errors={errors}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               {
//                 field: "street",
//                 label: "Street Address",
//                 hint: "Enter building number, area, or road name.",
//               },
//               {
//                 field: "city",
//                 label: "City",
//                 hint: "Enter the city where your company operates.",
//               },
//               {
//                 field: "postalCode",
//                 label: "Postal Code",
//                 hint: "Enter your area's ZIP or postal code.",
//               },
//             ].map(({ field, label, hint }) => {
//               const errorKey = `address.${field}`;
//               return (
//                 <div key={field} className="flex flex-col">
//                   <label className="font-medium text-gray-700 text-sm mb-2">
//                     {label} <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                       <MapPin className="text-gray-400" size={18} />
//                     </div>
//                     <input
//                       type="text"
//                       name={field}
//                       value={formData.address?.[field] || ""}
//                       onChange={handleAddressChange}
//                       placeholder={`Enter ${label.toLowerCase()}`}
//                       className={`${inputClass(
//                         Boolean(errors[errorKey])
//                       )} pl-10 pr-3`}
//                     />
//                   </div>

//                   <p className="text-gray-500 text-xs mt-1 ml-1">{hint}</p>

//                   {errors[errorKey] && (
//                     <p className="text-red-500 text-xs mt-1 ml-1">
//                       ⚠ {errors[errorKey]}
//                     </p>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Products Card */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
//             <Layers className="text-navyblue" size={22} />
//             Products & Categories
//           </h3>

//           {/* Main Categories */}
//           <div className="mb-6">
//             <label className="block font-medium text-gray-700 mb-4">
//               Main Categories <span className="text-red-500">*</span>
//             </label>
//             <p className="text-gray-500 text-xs mb-3 ml-1">
//               Select the product categories that best describe your company
//               offerings.
//             </p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {(formData.mainCategory?.length > 0
//                 ? formData.mainCategory
//                 : [""]
//               ).map((cat, index) => (
//                 <div
//                   key={index}
//                   className="relative flex flex-col gap-1 group transition-all"
//                 >
//                   <div className="flex items-center gap-2">
//                     <div className="flex-1 relative">
//                       <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
//                         <Layers size={18} />
//                       </div>

//                       <Select
//                         value={cat}
//                         onValueChange={(value) => {
//                           const newCategories = [
//                             ...(formData.mainCategory || []),
//                           ];
//                           newCategories[index] = value;
//                           setFormData((prev) => ({
//                             ...prev,
//                             mainCategory: newCategories,
//                           }));
//                         }}
//                       >
//                         <SelectTrigger
//                           className={`w-full p-6 pl-10 h-14 text-sm rounded-lg border transition-all ${
//                             errors[`mainCategory.${index}`]
//                               ? "border-red-500 focus:ring-red-500"
//                               : "border-gray-300 focus:ring-navyblue focus:border-navyblue"
//                           }`}
//                         >
//                           <SelectValue placeholder="Select Category" />
//                         </SelectTrigger>

//                         <SelectContent>
//                           <SelectGroup>
//                             {categories.map((category) => (
//                               <SelectItem key={category} value={category}>
//                                 {category}
//                               </SelectItem>
//                             ))}
//                           </SelectGroup>
//                         </SelectContent>
//                       </Select>

//                       {/* ❌ Remove button */}
//                       {index > 0 && (
//                         <button
//                           type="button"
//                           onClick={() => {
//                             const newCategories = formData.mainCategory.filter(
//                               (_, i) => i !== index
//                             );
//                             setFormData((prev) => ({
//                               ...prev,
//                               mainCategory: newCategories,
//                             }));
//                           }}
//                           className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-1"
//                         >
//                           <X size={16} />
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* ✅ Per-item error display */}
//                   {errors[`mainCategory.${index}`] && (
//                     <p className="text-xs text-red-500 ml-1">
//                       ⚠ {errors[`mainCategory.${index}`]}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <Button
//               type="button"
//               onClick={() =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   mainCategory: [...(prev.mainCategory || []), ""],
//                 }))
//               }
//               variant="secondary"
//             >
//               <Plus size={16} /> Add another category
//             </Button>

//             {errors.mainCategory && (
//               <p className="text-xs text-red-500 mt-1">{errors.mainCategory}</p>
//             )}
//           </div>

//           {/* Main Products */}
//           <div>
//             <label className="block font-medium text-gray-700 mb-4">
//               Main Products <span className="text-red-500">*</span>
//             </label>
//             <p className="text-gray-500 text-xs mb-3 ml-1">
//               Enter your top-selling or key products relevant to your category.
//             </p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {(formData.mainProduct.length > 0
//                 ? formData.mainProduct
//                 : [""]
//               ).map((sub, index) => (
//                 <div key={index} className="relative flex flex-col gap-1 group">
//                   <div className="flex items-center gap-2">
//                     <div className="flex-1 relative">
//                       <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                         <Building className="text-gray-400" size={18} />
//                       </div>

//                       <input
//                         type="text"
//                         value={sub}
//                         onChange={(e) => {
//                           const newSubs = [...formData.mainProduct];
//                           newSubs[index] = e.target.value;
//                           setFormData((prev) => ({
//                             ...prev,
//                             mainProduct: newSubs,
//                           }));
//                         }}
//                         placeholder={`Product ${index + 1}`}
//                         className={`pl-9 pr-10 ${inputClass(
//                           Boolean(errors[`mainProduct.${index}`])
//                         )}`}
//                       />

//                       {index > 0 && (
//                         <button
//                           type="button"
//                           onClick={() => {
//                             const newSubs = formData.mainProduct.filter(
//                               (_, i) => i !== index
//                             );
//                             setFormData((prev) => ({
//                               ...prev,
//                               mainProduct: newSubs,
//                             }));
//                           }}
//                           className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors opacity-0 group-hover:opacity-100"
//                         >
//                           <X size={16} />
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* ✅ Per-item error display */}
//                   {errors[`mainProduct.${index}`] && (
//                     <p className="text-xs text-red-500 ml-1">
//                       ⚠ {errors[`mainProduct.${index}`]}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <Button
//               type="button"
//               onClick={() =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   mainProduct: [...prev.mainProduct, ""],
//                 }))
//               }
//               variant="secondary"
//             >
//               <Plus size={16} />
//               Add another product
//             </Button>

//             {errors.mainProduct && (
//               <p className="text-red-500 text-xs mt-2 ml-1">
//                 ⚠ {errors.mainProduct}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Payment & Languages */}
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
//             <CreditCard className="text-navyblue" size={22} />
//             Payment & Communication
//           </h3>

//           {/* Accepted Currencies */}
//           <div className="mb-6">
//             <label className="font-medium text-gray-700 mb-3 flex items-center gap-2">
//               <DollarSign size={18} className="text-gray-600" />
//               Accepted Currencies
//             </label>
//             <p className="text-gray-500 text-xs mb-3 ml-1">
//               Select currencies you accept for trade or transactions.
//             </p>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
//               {currencies.map((c) => (
//                 <label
//                   key={c}
//                   className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
//                     (formData.acceptedCurrency || []).includes(c)
//                       ? "border-navyblue bg-blue-50"
//                       : "border-gray-200 hover:border-gray-300 bg-white"
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={(formData.acceptedCurrency || []).includes(c)}
//                     onChange={() =>
//                       handleCheckboxGroupChange("acceptedCurrency", c)
//                     }
//                     className="hidden"
//                   />
//                   <span className="text-sm text-gray-700">{c}</span>
//                 </label>
//               ))}
//             </div>
//             {errors.acceptedCurrency && (
//               <p className="text-xs text-red-500 mt-1">
//                 {errors.acceptedCurrency}
//               </p>
//             )}
//           </div>

//           {/* Accepted Payment Types */}
//           <div className="mb-6">
//             <label className="font-medium text-gray-700 mb-3 flex items-center gap-2">
//               <CreditCard size={18} className="text-gray-600" />
//               Accepted Payment Types
//             </label>
//             <p className="text-gray-500 text-xs mb-3 ml-1">
//               Choose all payment methods your company supports.
//             </p>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//               {paymentTypes.map((type) => (
//                 <label
//                   key={type}
//                   className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
//                     (formData.acceptedPaymentType || []).includes(type)
//                       ? "border-navyblue bg-blue-50"
//                       : "border-gray-200 hover:border-gray-300 bg-white"
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={(formData.acceptedPaymentType || []).includes(
//                       type
//                     )}
//                     onChange={() =>
//                       handleCheckboxGroupChange("acceptedPaymentType", type)
//                     }
//                     className="hidden"
//                   />
//                   <span className="text-sm text-gray-700">{type}</span>
//                 </label>
//               ))}
//             </div>
//             {errors.acceptedPaymentType && (
//               <p className="text-xs text-red-500 mt-1">
//                 {errors.acceptedPaymentType}
//               </p>
//             )}
//           </div>

//           {/* Languages Spoken */}
//           <div>
//             <label className="font-medium text-gray-700 mb-3 flex items-center gap-2">
//               <Globe size={18} className="text-gray-600" />
//               Languages Spoken
//             </label>
//             <p className="text-gray-500 text-xs mb-3 ml-1">
//               Select the languages your team can communicate in.
//             </p>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//               {languages.map((lang) => (
//                 <label
//                   key={lang}
//                   className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
//                     (formData.languageSpoken || []).includes(lang)
//                       ? "border-navyblue bg-blue-50"
//                       : "border-gray-200 hover:border-gray-300 bg-white"
//                   }`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={(formData.languageSpoken || []).includes(lang)}
//                     onChange={() =>
//                       handleCheckboxGroupChange("languageSpoken", lang)
//                     }
//                     className="hidden"
//                   />
//                   <span className="text-sm text-gray-700">{lang}</span>
//                 </label>
//               ))}
//             </div>
//             {errors.languageSpoken && (
//               <p className="text-xs text-red-500 mt-1">
//                 {errors.languageSpoken}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useMemo, useCallback } from "react";
import CountryStateSelect from "../../../Helper/CountryStateSelect";
import {
  User,
  MapPin,
  Calendar,
  Building,
  Layers,
  X,
  Plus,
  DollarSign,
  CreditCard,
  Globe,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// ============================================================================
// CONSTANTS - Extract for maintainability and reusability
// ============================================================================
const CURRENCIES = [
  "USD",
  "EUR",
  "JPY",
  "CAD",
  "AUD",
  "HKD",
  "GBP",
  "CNY",
  "CHF",
];

const PAYMENT_TYPES = [
  "T/T",
  "L/C",
  "D/P D/A",
  "MoneyGram",
  "Credit Card",
  "PayPal",
  "Western Union",
  "Cash",
  "Escrow",
];

const LANGUAGES = [
  "English",
  "Chinese",
  "Spanish",
  "Japanese",
  "Portuguese",
  "German",
  "Arabic",
  "French",
  "Russian",
  "Korean",
  "Hindi",
  "Italian",
];

const CATEGORIES = [
  "Natural Stones",
  "Ceramic & Tiles",
  "Alternatives & Finishes",
];

const YEAR_RANGE = 100;
const CURRENT_YEAR = new Date().getFullYear();

const DEFAULT_FORM_DATA = {
  companyName: "",
  legalowner: "",
  locationOfRegistration: "",
  companyRegistrationYear: "",
  address: {
    country: "",
    state: "",
    street: "",
    city: "",
    postalCode: "",
  },
  mainCategory: [""],
  mainProduct: [""],
  acceptedCurrency: [],
  acceptedPaymentType: [],
  languageSpoken: [],
};

// ============================================================================
// UTILITY FUNCTIONS - Pure functions for better testability
// ============================================================================
const generateYearOptions = (range, currentYear) => {
  return Array.from({ length: range }, (_, i) => currentYear - i);
};

const getErrorClass = (hasError) =>
  hasError
    ? "border-red-400 focus:ring-red-500"
    : "border-gray-300 hover:border-gray-400";

const extractFieldErrors = (errors, prefix) => {
  const fieldErrors = {};
  Object.keys(errors).forEach((key) => {
    if (key.startsWith(prefix)) {
      const index = key.split(".")[1];
      fieldErrors[index] = errors[key];
    }
  });
  return fieldErrors;
};

// ============================================================================
// SUB-COMPONENTS - Better separation of concerns
// ============================================================================

/**
 * Reusable form field with icon, label, and error handling
 * @param {Object} props
 * @param {string} props.name - Field name
 * @param {string} props.value - Field value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Field label
 * @param {React.Component} props.icon - Icon component
 * @param {string} [props.error] - Error message
 * @param {string} [props.hint] - Helper text
 * @param {boolean} [props.required=false] - Is field required
 * @param {string} [props.type="text"] - Input type
 * @param {string} [props.placeholder=""] - Placeholder text
 */
const FormField = ({
  name,
  value,
  onChange,
  label,
  icon: Icon,
  error,
  hint,
  required = false,
  type = "text",
  placeholder = "",
}) => (
  <div className="flex flex-col">
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon className="text-gray-400" size={20} aria-hidden="true" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || " "}
        aria-label={label}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : `${name}-hint`}
        className={`text-sm w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navyblue focus:border-transparent ${getErrorClass(
          !!error
        )} bg-white peer`}
      />
      <label className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600 pointer-events-none">
        {label}{" "}
        {required && (
          <span className="text-red-500" aria-label="required">
            *
          </span>
        )}
      </label>
    </div>
    {hint && (
      <p id={`${name}-hint`} className="text-gray-500 text-xs mt-1 ml-1">
        {hint}
      </p>
    )}
    {error && (
      <p
        id={`${name}-error`}
        className="text-red-500 text-xs mt-1 ml-1"
        role="alert"
      >
        ⚠ {error}
      </p>
    )}
  </div>
);

/**
 * Checkbox group with multi-select functionality
 * @param {Object} props
 * @param {string[]} props.options - Available options
 * @param {string[]} props.selected - Selected values
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Group label
 * @param {React.Component} props.icon - Icon component
 * @param {string} [props.hint] - Helper text
 * @param {string} [props.error] - Error message
 * @param {string} [props.gridCols] - Grid column classes
 */
const CheckboxGroup = ({
  options,
  selected,
  onChange,
  label,
  icon: Icon,
  hint,
  error,
  gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
}) => (
  <div className="mb-6">
    <label className="font-medium text-gray-700 mb-3 flex items-center gap-2">
      <Icon size={18} className="text-gray-600" aria-hidden="true" />
      {label}
    </label>
    {hint && <p className="text-gray-500 text-xs mb-3 ml-1">{hint}</p>}
    <div className={`grid ${gridCols} gap-3`} role="group" aria-label={label}>
      {options.map((option) => {
        const isChecked = selected.includes(option);
        const checkboxId = `checkbox-${label}-${option}`
          .replace(/\s+/g, "-")
          .toLowerCase();

        return (
          <label
            key={option}
            htmlFor={checkboxId}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
              isChecked
                ? "border-navyblue bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <input
              id={checkboxId}
              type="checkbox"
              checked={isChecked}
              onChange={() => onChange(option)}
              className="sr-only"
              aria-checked={isChecked}
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        );
      })}
    </div>
    {error && (
      <p className="text-xs text-red-500 mt-2" role="alert">
        ⚠ {error}
      </p>
    )}
  </div>
);

/**
 * Dynamic array field for adding/removing items
 * @param {Object} props
 * @param {string[]} props.items - Array items
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Field label
 * @param {React.Component} props.icon - Icon component
 * @param {string} [props.hint] - Helper text
 * @param {string} [props.error] - General error message
 * @param {Object} [props.errors] - Per-item errors
 * @param {string} [props.placeholder] - Placeholder text
 * @param {"input"|"select"} [props.type="input"] - Field type
 */
const DynamicArrayField = ({
  items,
  onChange,
  label,
  icon: Icon,
  hint,
  error,
  errors = {},
  placeholder,
  type = "input",
}) => {
  const handleItemChange = useCallback(
    (index, value) => {
      const newItems = [...items];
      newItems[index] = value;
      onChange(newItems);
    },
    [items, onChange]
  );

  const handleRemove = useCallback(
    (index) => {
      const newItems = items.filter((_, i) => i !== index);
      onChange(newItems);
    },
    [items, onChange]
  );

  const handleAdd = useCallback(() => {
    onChange([...items, ""]);
  }, [items, onChange]);

  return (
    <div className="mb-6">
      <label className="block font-medium text-gray-700 mb-4">
        {label}{" "}
        <span className="text-red-500" aria-label="required">
          *
        </span>
      </label>
      {hint && <p className="text-gray-500 text-xs mb-3 ml-1">{hint}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div key={index} className="relative flex flex-col gap-1 group">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Icon
                    className="text-gray-400"
                    size={18}
                    aria-hidden="true"
                  />
                </div>

                {type === "select" ? (
                  <Select
                    value={item}
                    onValueChange={(value) => handleItemChange(index, value)}
                  >
                    <SelectTrigger
                      className={`w-full p-6 pl-10 h-14 text-sm rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                        errors[index]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-navyblue focus:border-navyblue"
                      }`}
                      aria-label={`${label} ${index + 1}`}
                      aria-invalid={!!errors[index]}
                    >
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    placeholder={`${placeholder} ${index + 1}`}
                    aria-label={`${label} ${index + 1}`}
                    aria-invalid={!!errors[index]}
                    className={`pl-10 pr-10 text-sm w-full py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navyblue focus:border-transparent ${getErrorClass(
                      !!errors[index]
                    )} bg-white`}
                  />
                )}

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    aria-label={`Remove ${label} ${index + 1}`}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-1 rounded-full hover:bg-red-50 z-10"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {errors[index] && (
              <p className="text-xs text-red-500 ml-1" role="alert">
                ⚠ {errors[index]}
              </p>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={handleAdd}
        variant="secondary"
        className="mt-4"
        aria-label={`Add another ${label}`}
      >
        <Plus size={16} />
        Add another {label.toLowerCase()}
      </Button>

      {error && (
        <p className="text-xs text-red-500 mt-2" role="alert">
          ⚠ {error}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Step One of company registration form
 * @param {Object} props
 * @param {Object} props.formData - Form data object
 * @param {Function} props.setFormData - State setter function
 * @param {Object} props.errors - Validation errors
 */
const StepOne = ({
  formData = DEFAULT_FORM_DATA,
  setFormData = () => {},
  errors = {},
}) => {
  // Merge with defaults to prevent undefined errors
  const safeFormData = useMemo(
    () => ({
      ...DEFAULT_FORM_DATA,
      ...formData,
      address: {
        ...DEFAULT_FORM_DATA.address,
        ...(formData?.address || {}),
      },
      // Ensure arrays are never empty
      mainCategory:
        formData?.mainCategory?.length > 0 ? formData.mainCategory : [""],
      mainProduct:
        formData?.mainProduct?.length > 0 ? formData.mainProduct : [""],
    }),
    [formData]
  );

  // Memoize year options for performance
  const yearOptions = useMemo(
    () => generateYearOptions(YEAR_RANGE, CURRENT_YEAR),
    []
  );

  // ============================================================================
  // EVENT HANDLERS - All memoized to prevent unnecessary re-renders
  // ============================================================================

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setFormData]
  );

  const handleAddressChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        address: { ...(prev.address || {}), [name]: value },
      }));
    },
    [setFormData]
  );

  const handleCheckboxGroupChange = useCallback(
    (field, value) => {
      setFormData((prev) => {
        const current = prev[field] || [];
        const updated = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];
        return { ...prev, [field]: updated };
      });
    },
    [setFormData]
  );

  const handleArrayFieldChange = useCallback(
    (field, newArray) => {
      setFormData((prev) => ({ ...prev, [field]: newArray }));
    },
    [setFormData]
  );

  // Process errors for dynamic fields
  const categoryErrors = useMemo(
    () => extractFieldErrors(errors, "mainCategory."),
    [errors]
  );

  const productErrors = useMemo(
    () => extractFieldErrors(errors, "mainProduct."),
    [errors]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="max-w-full mx-auto rounded-2xl">
      <div className="flex flex-col gap-8">
        {/* Basic Information Card */}
        <section
          className="bg-white rounded-xl p-2 md:p-6 shadow-sm"
          aria-labelledby="basic-info-heading"
        >
          <h3
            id="basic-info-heading"
            className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2"
          >
            <Building className="text-navyblue" size={22} aria-hidden="true" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="companyName"
              value={safeFormData.companyName}
              onChange={handleChange}
              label="Company name"
              icon={User}
              error={errors.companyName}
              hint="Enter your registered business or trading name."
              required
            />

            <FormField
              name="legalowner"
              value={safeFormData.legalowner}
              onChange={handleChange}
              label="Legal owner"
              icon={User}
              error={errors.legalowner}
              hint="Mention the full legal name of the company's owner or director."
              required
            />

            <FormField
              name="locationOfRegistration"
              value={safeFormData.locationOfRegistration}
              onChange={handleChange}
              label="Location of registration"
              icon={MapPin}
              error={errors.locationOfRegistration}
              hint="Enter the city or country where your business is officially registered."
              required
            />

            {/* Registration Year Select */}
            <div className="flex flex-col">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Calendar
                    className="text-gray-400"
                    size={20}
                    aria-hidden="true"
                  />
                </div>

                <Select
                  value={safeFormData.companyRegistrationYear}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "companyRegistrationYear", value },
                    })
                  }
                >
                  <SelectTrigger
                    className={`text-sm w-full pl-10 pr-4 py-5.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navyblue focus:border-transparent ${getErrorClass(
                      !!errors.companyRegistrationYear
                    )} bg-white`}
                    aria-label="Year Company Registered"
                    aria-required="true"
                    aria-invalid={!!errors.companyRegistrationYear}
                  >
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <label className="absolute left-10 -top-2.5 bg-white px-2 text-xs font-medium text-gray-600 pointer-events-none z-10">
                  Year Company Registered{" "}
                  <span className="text-red-500" aria-label="required">
                    *
                  </span>
                </label>
              </div>

              <p className="text-gray-500 text-xs mt-1 ml-1">
                Select the year when your business was legally registered.
              </p>

              {errors.companyRegistrationYear && (
                <p className="text-red-500 text-xs mt-1 ml-1" role="alert">
                  ⚠ {errors.companyRegistrationYear}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Address Card */}
        <section
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          aria-labelledby="address-heading"
        >
          <h3
            id="address-heading"
            className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2"
          >
            <MapPin className="text-navyblue" size={22} aria-hidden="true" />
            Company Operational Address{" "}
            <span className="text-red-500" aria-label="required">
              *
            </span>
          </h3>

          <div className="mb-6">
            <CountryStateSelect
              formData={safeFormData}
              setFormData={setFormData}
              errors={errors}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="street"
              value={safeFormData.address.street || ""}
              onChange={handleAddressChange}
              label="Street Address"
              icon={MapPin}
              error={errors["address.street"]}
              hint="Enter building number, area, or road name."
              placeholder="Enter street address"
              required
            />

            <FormField
              name="city"
              value={safeFormData.address.city || ""}
              onChange={handleAddressChange}
              label="City"
              icon={MapPin}
              error={errors["address.city"]}
              hint="Enter the city where your company operates."
              placeholder="Enter city"
              required
            />

            <FormField
              name="postalCode"
              value={safeFormData.address.postalCode || ""}
              onChange={handleAddressChange}
              label="Postal Code"
              icon={MapPin}
              error={errors["address.postalCode"]}
              hint="Enter your area's ZIP or postal code."
              placeholder="Enter postal code"
              required
            />
          </div>
        </section>

        {/* Products Card */}
        <section
          className="bg-white rounded-xl p-6 shadow-sm"
          aria-labelledby="products-heading"
        >
          <h3
            id="products-heading"
            className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2"
          >
            <Layers className="text-navyblue" size={22} aria-hidden="true" />
            Products & Categories
          </h3>

          <DynamicArrayField
            items={safeFormData.mainCategory}
            onChange={(items) => handleArrayFieldChange("mainCategory", items)}
            label="Main Categories"
            icon={Layers}
            hint="Select the product categories that best describe your company offerings."
            error={errors.mainCategory}
            errors={categoryErrors}
            type="select"
          />

          <DynamicArrayField
            items={safeFormData.mainProduct}
            onChange={(items) => handleArrayFieldChange("mainProduct", items)}
            label="Main Products"
            icon={Building}
            hint="Enter your top-selling or key products relevant to your category. eg( natural stone - marble, ceramic & tiels - cermaic)."
            error={errors.mainProduct}
            errors={productErrors}
            placeholder="Product"
            type="input"
          />
        </section>

        {/* Payment & Languages */}
        <section
          className="bg-white rounded-xl p-6 shadow-sm"
          aria-labelledby="payment-heading"
        >
          <h3
            id="payment-heading"
            className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2"
          >
            <CreditCard
              className="text-navyblue"
              size={22}
              aria-hidden="true"
            />
            Payment & Communication
          </h3>

          <CheckboxGroup
            options={CURRENCIES}
            selected={safeFormData.acceptedCurrency}
            onChange={(value) =>
              handleCheckboxGroupChange("acceptedCurrency", value)
            }
            label="Accepted Currencies"
            icon={DollarSign}
            hint="Select currencies you accept for trade or transactions."
            error={errors.acceptedCurrency}
            gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          />

          <CheckboxGroup
            options={PAYMENT_TYPES}
            selected={safeFormData.acceptedPaymentType}
            onChange={(value) =>
              handleCheckboxGroupChange("acceptedPaymentType", value)
            }
            label="Accepted Payment Types"
            icon={CreditCard}
            hint="Choose all payment methods your company supports."
            error={errors.acceptedPaymentType}
          />

          <CheckboxGroup
            options={LANGUAGES}
            selected={safeFormData.languageSpoken}
            onChange={(value) =>
              handleCheckboxGroupChange("languageSpoken", value)
            }
            label="Languages Spoken"
            icon={Globe}
            hint="Select the languages your team can communicate in."
            error={errors.languageSpoken}
          />
        </section>
      </div>
    </div>
  );
};

export default StepOne;
