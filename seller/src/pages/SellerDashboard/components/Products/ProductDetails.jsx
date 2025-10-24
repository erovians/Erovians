// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "@/utils/axios.utils";
// import { MoreVertical, Trash2 } from "lucide-react";
// import { Spinner } from "@/components/ui/spinner";
// import { AlertDialogMenu } from "../Helper/AlertDialogMenu";
// import { toast } from "sonner"; // recommended: any toast lib
// import { useDispatch, useSelector } from "react-redux";
// // --- Helper: isValidId (simple guard)
// const isValidId = (v) => typeof v === "string" && v.length > 0;

// const ProductDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isMountedRef = useRef(true);

//   const dispatch = useDispatch();
//   const { company } = useSelector((state) => state.company);
//   const subCategories = company?.companyBasicInfo?.subCategory
//     ? company.companyBasicInfo.subCategory.split(",").map((s) => s.trim())
//     : [];
//   const categories = company?.companyBasicInfo?.mainCategory
//     ? company.companyBasicInfo.mainCategory.split(",").map((s) => s.trim())
//     : [];

//   // Data + granular loading states
//   const [product, setProduct] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [selectedImg, setSelectedImg] = useState("");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const [newImages, setNewImages] = useState([]); // object URLs
//   const [isFetching, setIsFetching] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isTogglingStatus, setIsTogglingStatus] = useState(false);

//   // Delete dialog state
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

//   // Keep track of created object URLs to revoke them on cleanup
//   const createdObjectUrlsRef = useRef(new Set());

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMountedRef.current = false;
//       // revoke created object URLs
//       for (const url of createdObjectUrlsRef.current) {
//         try {
//           URL.revokeObjectURL(url);
//         } catch (e) {
//           /* ignore */
//         }
//       }
//       createdObjectUrlsRef.current.clear();
//     };
//   }, []);

//   // Fetch product with AbortController and mounted guard
//   useEffect(() => {
//     if (!isValidId(id)) return;

//     const controller = new AbortController();
//     const signal = controller.signal;

//     const fetchProduct = async () => {
//       try {
//         setIsFetching(true);
//         const res = await api.get(`/product/${id}`, { signal });
//         // defensive: ensure component still mounted
//         if (!isMountedRef.current) return;

//         const data = res.data?.data;
//         setProduct(data);
//         setEditData(data || {});
//         if (data?.productImages?.length) {
//           setSelectedImg(data.productImages[0]);
//         }
//       } catch (err) {
//         if (err.name === "CanceledError" || err.name === "AbortError") {
//           // fetch aborted
//           return;
//         }
//         console.error("Error fetching product:", err);
//         toast.error("Failed to load product. Try again later.");
//       } finally {
//         if (isMountedRef.current) setIsFetching(false);
//       }
//     };

//     fetchProduct();

//     return () => {
//       controller.abort();
//     };
//   }, [id]);

//   // Helper: centralized error handler for API calls
//   const handleApiError = useCallback(
//     (err, fallbackMessage = "Something went wrong") => {
//       console.error(err);
//       // If your api util throws structured errors, use them. Example:
//       const message =
//         err?.response?.data?.message || err.message || fallbackMessage;
//       toast.error(message);
//     },
//     []
//   );

//   // Toggle status (pessimistic update but with per-action loading)
//   const handleToggleStatus = useCallback(async () => {
//     if (!product || isTogglingStatus) return;
//     const newStatus = product.status === "active" ? "inactive" : "active";

//     try {
//       setIsTogglingStatus(true);
//       // Option: optimistic update:
//       // const prev = product.status;
//       // setProduct(p => ({...p, status: newStatus}));
//       await api.patch(`/product/${product.id || product._id}/status`, {
//         status: newStatus,
//       });
//       if (!isMountedRef.current) return;
//       setProduct((p) => ({ ...p, status: newStatus }));
//       setEditData((d) => ({ ...d, status: newStatus }));
//       toast.success(`Status updated to ${newStatus}`);
//     } catch (err) {
//       handleApiError(err, "Failed to update status");
//       // If optimistic rollback needed, handle here.
//     } finally {
//       if (isMountedRef.current) setIsTogglingStatus(false);
//     }
//   }, [product, isTogglingStatus, handleApiError]);

//   // Delete handler (idempotent safe, prevents double-submits)
//   const handleDeleteConfirmed = useCallback(async () => {
//     if (!product || isDeleting) return;
//     try {
//       setIsDeleting(true);
//       await api.delete(`/product/${product.id || product._id}`);
//       if (!isMountedRef.current) return;
//       toast.success("Product deleted");
//       navigate("/sellerdashboard/products/list");
//     } catch (err) {
//       handleApiError(err, "Failed to delete product");
//     } finally {
//       if (isMountedRef.current) setIsDeleting(false);
//     }
//   }, [product, isDeleting, handleApiError, navigate]);

//   // Save handler
//   const handleSave = useCallback(async () => {
//     if (!product || isSaving) return;
//     try {
//       setIsSaving(true);
//       // prepare the payload
//       const updatedData = { ...editData };

//       if (newImages.length > 0) {
//         updatedData.productImages = [
//           ...(editData.productImages || []),
//           ...newImages,
//         ];
//       }

//       const res = await api.put(
//         `/product/${product.id || product._id}`,
//         updatedData
//       );
//       const updated = res.data?.data;
//       if (!isMountedRef.current) return;
//       setProduct(updated);
//       setEditData(updated);
//       setIsEditing(false);

//       // revoke created object urls (they are no longer needed after upload)
//       for (const url of createdObjectUrlsRef.current) {
//         try {
//           URL.revokeObjectURL(url);
//         } catch (e) {}
//       }
//       createdObjectUrlsRef.current.clear();
//       setNewImages([]);
//       if (updated?.productImages?.length)
//         setSelectedImg(updated.productImages[0]);
//       toast.success("Product updated successfully");
//     } catch (err) {
//       handleApiError(err, "Failed to save product");
//     } finally {
//       if (isMountedRef.current) setIsSaving(false);
//     }
//   }, [product, editData, newImages, isSaving, handleApiError]);

//   // Image handlers: create objectURL, track them and revoke when removed
//   const handleAddImages = useCallback((e) => {
//     const files = Array.from(e.target.files || []);
//     const urls = files.map((file) => {
//       const url = URL.createObjectURL(file);
//       createdObjectUrlsRef.current.add(url);
//       return url;
//     });
//     setNewImages((prev) => [...prev, ...urls]);
//     // reset input value so same-file can be selected later if needed
//     e.target.value = "";
//   }, []);

//   const handleRemoveNewImage = useCallback((index) => {
//     setNewImages((prev) => {
//       const removed = prev[index];
//       if (removed) {
//         try {
//           URL.revokeObjectURL(removed);
//         } catch (e) {
//           /* ignore */
//         }
//         createdObjectUrlsRef.current.delete(removed);
//       }
//       return prev.filter((_, i) => i !== index);
//     });
//   }, []);

//   const handleRemoveExistingImage = useCallback(
//     (index) => {
//       // operate on editData.productImages
//       setEditData((prev) => {
//         const images = [...(prev.productImages || [])];
//         const removed = images.splice(index, 1);
//         // if the selected image was the removed one, update it
//         if (selectedImg && selectedImg === removed[0]) {
//           setSelectedImg(images[0] || "");
//         }
//         return { ...prev, productImages: images };
//       });
//     },
//     [selectedImg]
//   );

//   // UI guard for id field (backend id naming mismatch)
//   const productId = product?.id || product?._id;

//   if (isFetching || !product) {
//     return <div className="p-6 text-center text-gray-600">Loading...</div>;
//   }

//   return (
//     <div className="max-w-full  rounded-xl relative">
//       <div className="flex flex-col md:flex-row gap-8 w-full md:h-auto">
//         {/* Left: Thumbnails + Main Image */}
//         <div className="flex flex-col md:flex-row gap-4 md:w-[50%]">
//           {/* Thumbnails */}
//           <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto w-full md:w-20">
//             {editData.productImages?.map((img, idx) => (
//               <div key={idx} className="relative flex-shrink-0">
//                 <img
//                   src={img}
//                   alt={`${product.productName}-${idx}`}
//                   onClick={() => setSelectedImg(img)}
//                   className={`w-20 h-14  object-contain border rounded-lg cursor-pointer p-1 transition ${
//                     selectedImg === img
//                       ? "border-blue-600  shadow-md"
//                       : "border-gray-200"
//                   }`}
//                 />
//                 {isEditing && (
//                   <button
//                     onClick={() => handleRemoveExistingImage(idx)}
//                     className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
//                     disabled={isSaving}
//                   >
//                     <Trash2 className="w-3 h-3" />
//                   </button>
//                 )}
//               </div>
//             ))}

//             {newImages.map((img, idx) => (
//               <div key={`new-${idx}`} className="relative flex-shrink-0">
//                 <img
//                   src={img}
//                   alt={`new-${idx}`}
//                   onClick={() => setSelectedImg(img)}
//                   className="w-20 h-20 object-contain border rounded-lg p-1"
//                 />
//                 {isEditing && (
//                   <button
//                     onClick={() => handleRemoveNewImage(idx)}
//                     className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
//                     disabled={isSaving}
//                   >
//                     <Trash2 className="w-3 h-3" />
//                   </button>
//                 )}
//               </div>
//             ))}

//             {isEditing && (
//               <label className="cursor-pointer w-20 h-20 flex-shrink-0 flex items-center justify-center border rounded-lg text-gray-500 hover:bg-gray-100">
//                 + Add
//                 <input
//                   type="file"
//                   multiple
//                   className="hidden"
//                   onChange={handleAddImages}
//                 />
//               </label>
//             )}
//           </div>

//           {/* Main Image */}
//           <div className="flex-1 rounded-xl flex items-center justify-center">
//             <img
//               src={selectedImg}
//               alt={product.productName}
//               className="max-h-[450px] min-h-[250px]  object-contain p-4 w-full"
//             />
//           </div>
//         </div>

//         {/* Right: Product Info */}
//         <div className="md:w-1/2 flex flex-col p-6 rounded-2xl font-sans text-gray-800 relative">
//           {/* Header: Product Name + Status + Menu */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
//             {/* Product Title */}
//             <div className="flex-1 w-full">
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={editData.productName}
//                   onChange={(e) =>
//                     setEditData({ ...editData, productName: e.target.value })
//                   }
//                   className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 border-b p-1 w-full"
//                 />
//               ) : (
//                 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
//                   {product.productName}
//                 </h1>
//               )}
//             </div>

//             {/* Status + Menu */}
//             <div className="hidden sm:flex items-center gap-2 sm:gap-3 flex-wrap mt-2 sm:mt-0">
//               {(product.status === "active" ||
//                 product.status === "inactive") && (
//                 <button
//                   onClick={handleToggleStatus}
//                   className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 focus:outline-none ${
//                     product.status === "active" ? "bg-green-500" : "bg-red-600"
//                   }`}
//                   disabled={isTogglingStatus}
//                 >
//                   <span
//                     className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
//                       product.status === "active"
//                         ? "translate-x-6"
//                         : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               )}

//               {/* Status Label */}
//               <span
//                 className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full whitespace-nowrap ${
//                   product.status === "active"
//                     ? "bg-green-100 text-green-700 border border-green-300"
//                     : product.status === "inactive"
//                     ? "bg-red-100 text-red-700 border border-red-300"
//                     : product.status === "pending"
//                     ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
//                     : "bg-purple-100 text-purple-700 border border-purple-300"
//                 }`}
//               >
//                 {product.status.charAt(0).toUpperCase() +
//                   product.status.slice(1)}
//               </span>

//               {/* Menu */}
//               <div className="relative">
//                 <button
//                   onClick={() => setMenuOpen((v) => !v)}
//                   className="p-2 rounded-full hover:bg-gray-100"
//                 >
//                   <MoreVertical className="w-5 h-5 text-gray-600" />
//                 </button>

//                 {menuOpen && (
//                   <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
//                     {!isEditing ? (
//                       <button
//                         onClick={() => {
//                           setIsEditing(true);
//                           setMenuOpen(false);
//                         }}
//                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Edit
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => setIsEditing(false)}
//                         className="block w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                     <button
//                       onClick={() => {
//                         setDeleteDialogOpen(true);
//                         setMenuOpen(false);
//                       }}
//                       className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
//                       disabled={isDeleting}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Small screen layout (kept same) */}
//           <div className="flex sm:hidden items-center justify-between mb-4 flex-wrap gap-2">
//             {/* Price */}
//             <div className="flex items-baseline gap-2">
//               {isEditing ? (
//                 <>
//                   <input
//                     type="number"
//                     value={editData.pricePerUnit}
//                     onChange={(e) =>
//                       setEditData({ ...editData, pricePerUnit: e.target.value })
//                     }
//                     className="text-lg font-semibold border p-1 w-20"
//                   />
//                   <input
//                     type="text"
//                     value={editData.priceUnit}
//                     onChange={(e) =>
//                       setEditData({ ...editData, priceUnit: e.target.value })
//                     }
//                     className="text-sm border p-1 w-16"
//                   />
//                 </>
//               ) : (
//                 <>
//                   <span className="text-xl font-bold text-black">
//                     ₹{product.pricePerUnit}
//                   </span>
//                   <span className="text-sm text-gray-500">
//                     /{product.priceUnit}
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* Status + Menu */}
//             <div className="flex items-center gap-2">
//               {(product.status === "active" ||
//                 product.status === "inactive") && (
//                 <button
//                   onClick={handleToggleStatus}
//                   className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors duration-300 focus:outline-none ${
//                     product.status === "active" ? "bg-green-500" : "bg-red-600"
//                   }`}
//                 >
//                   <span
//                     className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
//                       product.status === "active"
//                         ? "translate-x-5"
//                         : "translate-x-0"
//                     }`}
//                   />
//                 </button>
//               )}

//               <span
//                 className={`text-xs font-medium px-2 py-1 rounded-full ${
//                   product.status === "active"
//                     ? "bg-green-100 text-green-700 border border-green-300"
//                     : product.status === "inactive"
//                     ? "bg-red-100 text-red-700 border border-red-300"
//                     : product.status === "pending"
//                     ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
//                     : "bg-purple-100 text-purple-700 border border-purple-300"
//                 }`}
//               >
//                 {product.status.charAt(0).toUpperCase() +
//                   product.status.slice(1)}
//               </span>

//               {/* Menu (same as large) */}
//               <div className="relative">
//                 <button
//                   onClick={() => setMenuOpen(!menuOpen)}
//                   className="p-1 rounded-full hover:bg-gray-100"
//                 >
//                   <MoreVertical className="w-4 h-4 text-gray-600" />
//                 </button>

//                 {menuOpen && (
//                   <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
//                     {!isEditing ? (
//                       <button
//                         onClick={() => {
//                           setIsEditing(true);
//                           setMenuOpen(false);
//                         }}
//                         className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Edit
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => setIsEditing(false)}
//                         className="block w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                     <button
//                       onClick={() => {
//                         setDeleteDialogOpen(true);
//                       }}
//                       className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-100"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* ... rest of the markup unchanged ... */}

//           <div className="flex-1 overflow-y-auto pr-2 space-y-6">
//             {/* Price */}
//             <div className="hidden sm:flex items-baseline gap-3 border-b border-gray-200 pb-3">
//               {isEditing ? (
//                 <>
//                   <input
//                     type="number"
//                     value={editData.pricePerUnit}
//                     onChange={(e) =>
//                       setEditData({ ...editData, pricePerUnit: e.target.value })
//                     }
//                     className="text-2xl font-extrabold border p-1 w-28"
//                   />
//                   <input
//                     type="text"
//                     value={editData.priceUnit}
//                     onChange={(e) =>
//                       setEditData({ ...editData, priceUnit: e.target.value })
//                     }
//                     className="text-base border p-1 w-20"
//                   />
//                 </>
//               ) : (
//                 <>
//                   <span className="text-3xl text-black">
//                     ₹{product.pricePerUnit}
//                   </span>
//                   <span className="text-base text-gray-500">
//                     /{product.priceUnit}
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* Specifications */}
//             {/* Specifications */}
//             <div className="space-y-4">
//               <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
//                 Specifications
//               </h2>
//               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-700">
//                 {[
//                   "category",
//                   "subCategory",
//                   "grade",
//                   "color",
//                   "origin",
//                   "size.length",
//                   "size.width",
//                   "size.thickness",
//                   "weight",
//                 ].map((field, idx) => {
//                   const keys = field.split(".");
//                   const value =
//                     keys.length === 2
//                       ? editData[keys[0]]?.[keys[1]]
//                       : editData[field];

//                   let unit = "";
//                   if (field === "size.length")
//                     unit = editData.size?.lengthMeasurement || "";
//                   if (field === "size.width")
//                     unit = editData.size?.widthMeasurement || "";
//                   if (field === "size.thickness")
//                     unit = editData.size?.thicknessMeasurement || "";
//                   if (field === "weight")
//                     unit = editData.weightMeasurement || "";

//                   return (
//                     <li
//                       key={idx}
//                       className="flex items-center justify-between w-fit  gap-14 capitalize"
//                     >
//                       <span className="font-medium capitalize w-24 sm:w-32 text-xs sm:text-sm">
//                         {keys.join(" ")}:
//                       </span>
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           value={value || ""}
//                           onChange={(e) => {
//                             if (keys.length === 2) {
//                               setEditData({
//                                 ...editData,
//                                 [keys[0]]: {
//                                   ...editData[keys[0]],
//                                   [keys[1]]: e.target.value,
//                                 },
//                               });
//                             } else {
//                               setEditData({
//                                 ...editData,
//                                 [field]: e.target.value,
//                               });
//                             }
//                           }}
//                           className="border p-1 text-xs sm:text-sm flex-1"
//                         />
//                       ) : (
//                         <span className="text-gray-600 text-xs sm:text-sm">
//                           {value || "N/A"} {unit}
//                         </span>
//                       )}
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>

//             {/* Description */}
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
//                 Description
//               </h2>
//               {isEditing ? (
//                 <textarea
//                   value={editData.description || ""}
//                   onChange={(e) =>
//                     setEditData({ ...editData, description: e.target.value })
//                   }
//                   className="w-full h-40 border  p-2 text-sm"
//                   rows={4}
//                 />
//               ) : (
//                 <p className="text-gray-600 hide-scrollbar leading-relaxed text-xs md:text-sm max-h-[300px] scroll-smooth  overflow-y-auto overflow-x-hidden">
//                   {product.description || "No description available."}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Sticky Save Button */}
//           {isEditing && (
//             <div className=" transform mt-10 ">
//               <button
//                 onClick={handleSave}
//                 className="flex items-center gap-3 bg-navyblue border border-navyblue text-white px-6 py-2 rounded-md shadow-lg cursor-pointer hover:bg-white hover:text-navyblue transition"
//               >
//                 {isSaving && <Spinner />}
//                 {isSaving ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           )}

//           {/* Confirmation Dialog */}
//           <AlertDialogMenu
//             open={deleteDialogOpen}
//             onOpenChange={setDeleteDialogOpen}
//             title="Are you sure you want to delete this product?"
//             description="This action cannot be undone. This will permanently remove this product from your store."
//             confirmText={isDeleting ? "Deleting..." : "Delete"}
//             variant="danger"
//             onConfirm={() => {
//               // close dialog, then delete
//               setDeleteDialogOpen(false);
//               handleDeleteConfirmed();
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "@/utils/axios.utils";
import { MoreVertical, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { AlertDialogMenu } from "../Helper/AlertDialogMenu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// --- Helper: isValidId (simple guard)
const isValidId = (v) => typeof v === "string" && v.length > 0;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  // Get company data from Redux for categories
  const { company } = useSelector((state) => state.company);
  const subCategories = company?.companyBasicInfo?.subCategory
    ? company.companyBasicInfo.subCategory.split(",").map((s) => s.trim())
    : [];
  const categories = company?.companyBasicInfo?.mainCategory
    ? company.companyBasicInfo.mainCategory.split(",").map((s) => s.trim())
    : [];

  console.log("categories", categories, "subCategories", subCategories);

  // Data + granular loading states
  const [product, setProduct] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedImg, setSelectedImg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [newImages, setNewImages] = useState([]); // object URLs
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Keep track of created object URLs to revoke them on cleanup
  const createdObjectUrlsRef = useRef(new Set());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // revoke created object URLs
      for (const url of createdObjectUrlsRef.current) {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          /* ignore */
        }
      }
      createdObjectUrlsRef.current.clear();
    };
  }, []);

  // Fetch product with AbortController and mounted guard
  useEffect(() => {
    if (!isValidId(id)) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProduct = async () => {
      try {
        setIsFetching(true);
        const res = await api.get(`/product/${id}`, { signal });
        // defensive: ensure component still mounted
        if (!isMountedRef.current) return;

        const data = res.data?.data;
        setProduct(data);
        setEditData(data || {});
        if (data?.productImages?.length) {
          setSelectedImg(data.productImages[0]);
        }
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          // fetch aborted
          return;
        }
        console.error("Error fetching product:", err);
        toast.error("Failed to load product. Try again later.");
      } finally {
        if (isMountedRef.current) setIsFetching(false);
      }
    };

    fetchProduct();

    return () => {
      controller.abort();
    };
  }, [id]);

  // Helper: centralized error handler for API calls
  const handleApiError = useCallback(
    (err, fallbackMessage = "Something went wrong") => {
      console.error(err);
      // If your api util throws structured errors, use them. Example:
      const message =
        err?.response?.data?.message || err.message || fallbackMessage;
      toast.error(message);
    },
    []
  );

  // Toggle status (pessimistic update but with per-action loading)
  const handleToggleStatus = useCallback(async () => {
    if (!product || isTogglingStatus) return;
    const newStatus = product.status === "active" ? "inactive" : "active";

    try {
      setIsTogglingStatus(true);
      await api.patch(`/product/${product.id || product._id}/status`, {
        status: newStatus,
      });
      if (!isMountedRef.current) return;
      setProduct((p) => ({ ...p, status: newStatus }));
      setEditData((d) => ({ ...d, status: newStatus }));
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      handleApiError(err, "Failed to update status");
    } finally {
      if (isMountedRef.current) setIsTogglingStatus(false);
    }
  }, [product, isTogglingStatus, handleApiError]);

  // Delete handler (idempotent safe, prevents double-submits)
  const handleDeleteConfirmed = useCallback(async () => {
    if (!product || isDeleting) return;
    try {
      setIsDeleting(true);
      await api.delete(`/product/${product.id || product._id}`);
      if (!isMountedRef.current) return;
      toast.success("Product deleted");
      navigate("/sellerdashboard/products/list");
    } catch (err) {
      handleApiError(err, "Failed to delete product");
    } finally {
      if (isMountedRef.current) setIsDeleting(false);
    }
  }, [product, isDeleting, handleApiError, navigate]);

  // Save handler
  const handleSave = useCallback(async () => {
    if (!product || isSaving) return;
    try {
      setIsSaving(true);
      // prepare the payload
      const updatedData = { ...editData };

      if (newImages.length > 0) {
        updatedData.productImages = [
          ...(editData.productImages || []),
          ...newImages,
        ];
      }

      const res = await api.put(
        `/product/${product.id || product._id}`,
        updatedData
      );
      const updated = res.data?.data;
      if (!isMountedRef.current) return;
      setProduct(updated);
      setEditData(updated);
      setIsEditing(false);

      // revoke created object urls (they are no longer needed after upload)
      for (const url of createdObjectUrlsRef.current) {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {}
      }
      createdObjectUrlsRef.current.clear();
      setNewImages([]);
      if (updated?.productImages?.length)
        setSelectedImg(updated.productImages[0]);
      toast.success("Product updated successfully");
    } catch (err) {
      handleApiError(err, "Failed to save product");
    } finally {
      if (isMountedRef.current) setIsSaving(false);
    }
  }, [product, editData, newImages, isSaving, handleApiError]);

  // Image handlers: create objectURL, track them and revoke when removed
  const handleAddImages = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => {
      const url = URL.createObjectURL(file);
      createdObjectUrlsRef.current.add(url);
      return url;
    });
    setNewImages((prev) => [...prev, ...urls]);
    // reset input value so same-file can be selected later if needed
    e.target.value = "";
  }, []);

  const handleRemoveNewImage = useCallback((index) => {
    setNewImages((prev) => {
      const removed = prev[index];
      if (removed) {
        try {
          URL.revokeObjectURL(removed);
        } catch (e) {
          /* ignore */
        }
        createdObjectUrlsRef.current.delete(removed);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleRemoveExistingImage = useCallback(
    (index) => {
      // operate on editData.productImages
      setEditData((prev) => {
        const images = [...(prev.productImages || [])];
        const removed = images.splice(index, 1);
        // if the selected image was the removed one, update it
        if (selectedImg && selectedImg === removed[0]) {
          setSelectedImg(images[0] || "");
        }
        return { ...prev, productImages: images };
      });
    },
    [selectedImg]
  );

  // Handle select changes for category and subcategory
  const handleSelectChange = useCallback((field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // UI guard for id field (backend id naming mismatch)
  const productId = product?.id || product?._id;

  if (isFetching || !product) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-full rounded-xl relative">
      <div className="flex flex-col md:flex-row gap-8 w-full md:h-auto">
        {/* Left: Thumbnails + Main Image */}
        <div className="flex flex-col md:flex-row gap-4 md:w-[50%]">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto w-full md:w-20">
            {editData.productImages?.map((img, idx) => (
              <div key={idx} className="relative flex-shrink-0">
                <img
                  src={img}
                  alt={`${product.productName}-${idx}`}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-14 object-contain border rounded-lg cursor-pointer p-1 transition ${
                    selectedImg === img
                      ? "border-blue-600 shadow-md"
                      : "border-gray-200"
                  }`}
                />
                {isEditing && (
                  <button
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                    disabled={isSaving}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {newImages.map((img, idx) => (
              <div key={`new-${idx}`} className="relative flex-shrink-0">
                <img
                  src={img}
                  alt={`new-${idx}`}
                  onClick={() => setSelectedImg(img)}
                  className="w-20 h-20 object-contain border rounded-lg p-1"
                />
                {isEditing && (
                  <button
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                    disabled={isSaving}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {isEditing && (
              <label className="cursor-pointer w-20 h-20 flex-shrink-0 flex items-center justify-center border rounded-lg text-gray-500 hover:bg-gray-100">
                + Add
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleAddImages}
                />
              </label>
            )}
          </div>

          {/* Main Image */}
          <div className="flex-1 rounded-xl flex items-center justify-center">
            <img
              src={selectedImg}
              alt={product.productName}
              className="max-h-[450px] min-h-[250px] object-contain p-4 w-full"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:w-1/2 flex flex-col p-6 rounded-2xl font-sans text-gray-800 relative">
          {/* Header: Product Name + Status + Menu */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
            {/* Product Title */}
            <div className="flex-1 w-full">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.productName}
                  onChange={(e) =>
                    setEditData({ ...editData, productName: e.target.value })
                  }
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 border-b p-1 w-full"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  {product.productName}
                </h1>
              )}
            </div>

            {/* Status + Menu */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 flex-wrap mt-2 sm:mt-0">
              {(product.status === "active" ||
                product.status === "inactive") && (
                <button
                  onClick={handleToggleStatus}
                  className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 focus:outline-none ${
                    product.status === "active" ? "bg-green-500" : "bg-red-600"
                  }`}
                  disabled={isTogglingStatus}
                >
                  <span
                    className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
                      product.status === "active"
                        ? "translate-x-6"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              )}

              {/* Status Label */}
              <span
                className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                  product.status === "active"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : product.status === "inactive"
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : product.status === "pending"
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    : "bg-purple-100 text-purple-700 border border-purple-300"
                }`}
              >
                {product.status.charAt(0).toUpperCase() +
                  product.status.slice(1)}
              </span>

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setDeleteDialogOpen(true);
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Small screen layout */}
          <div className="flex sm:hidden items-center justify-between mb-4 flex-wrap gap-2">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              {isEditing ? (
                <>
                  <input
                    type="number"
                    value={editData.pricePerUnit}
                    onChange={(e) =>
                      setEditData({ ...editData, pricePerUnit: e.target.value })
                    }
                    className="text-lg font-semibold border p-1 w-20"
                  />
                  <input
                    type="text"
                    value={editData.priceUnit}
                    onChange={(e) =>
                      setEditData({ ...editData, priceUnit: e.target.value })
                    }
                    className="text-sm border p-1 w-16"
                  />
                </>
              ) : (
                <>
                  <span className="text-xl font-bold text-black">
                    ₹{product.pricePerUnit}
                  </span>
                  <span className="text-sm text-gray-500">
                    /{product.priceUnit}
                  </span>
                </>
              )}
            </div>

            {/* Status + Menu */}
            <div className="flex items-center gap-2">
              {(product.status === "active" ||
                product.status === "inactive") && (
                <button
                  onClick={handleToggleStatus}
                  className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors duration-300 focus:outline-none ${
                    product.status === "active" ? "bg-green-500" : "bg-red-600"
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
                      product.status === "active"
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              )}

              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  product.status === "active"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : product.status === "inactive"
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : product.status === "pending"
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    : "bg-purple-100 text-purple-700 border border-purple-300"
                }`}
              >
                {product.status.charAt(0).toUpperCase() +
                  product.status.slice(1)}
              </span>

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(false)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setDeleteDialogOpen(true);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {/* Price */}
            <div className="hidden sm:flex items-baseline gap-3 border-b border-gray-200 pb-3">
              {isEditing ? (
                <>
                  {/* Price Input */}
                  <input
                    type="number"
                    value={editData.pricePerUnit}
                    onChange={(e) =>
                      setEditData({ ...editData, pricePerUnit: e.target.value })
                    }
                    className="text-2xl font-extrabold border p-1 w-28"
                  />

                  {/* Dropdown for priceUnit */}
                  <select
                    value={editData.priceUnit}
                    onChange={(e) =>
                      setEditData({ ...editData, priceUnit: e.target.value })
                    }
                    className="text-base border p-1 w-28"
                  >
                    <option value="sq.ft">sq.ft</option>
                    <option value="sq.m">sq.m</option>
                    <option value="piece">piece</option>
                  </select>
                </>
              ) : (
                <>
                  <span className="text-3xl text-black">
                    ₹{product.pricePerUnit}
                  </span>
                  <span className="text-base text-gray-500">
                    /{product.priceUnit}
                  </span>
                </>
              )}
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Specifications
              </h2>

              <ul className="grid  grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-gray-700">
                {/* Category */}
                <li className="grid grid-cols-[8rem,1fr] items-center gap-2">
                  <span className="font-medium">Category:</span>
                  {isEditing ? (
                    <Select
                      value={editData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger className="border p-2 rounded w-full">
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-gray-600">
                      {editData.category || "N/A"}
                    </span>
                  )}
                </li>

                {/* Sub Category */}
                <li className="grid grid-cols-[8rem,1fr] items-center gap-2">
                  <span className="font-medium">Sub Category:</span>
                  {isEditing ? (
                    <Select
                      value={editData.subCategory}
                      onValueChange={(value) =>
                        handleSelectChange("subCategory", value)
                      }
                    >
                      <SelectTrigger className="border p-2 rounded w-full">
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
                  ) : (
                    <span className="text-gray-600">
                      {editData.subCategory || "N/A"}
                    </span>
                  )}
                </li>

                {/* Grade */}
                <li className="grid grid-cols-[8rem,1fr] items-center gap-2">
                  <span className="font-medium">Grade:</span>
                  {isEditing ? (
                    <Select
                      value={editData.grade}
                      onValueChange={(value) =>
                        handleSelectChange("grade", value)
                      }
                    >
                      <SelectTrigger className="border p-2 rounded w-full">
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Grade A</SelectItem>
                        <SelectItem value="B">Grade B</SelectItem>
                        <SelectItem value="C">Grade C</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-gray-600">
                      {editData.grade || "N/A"}
                    </span>
                  )}
                </li>

                {/* Color & Origin (Text fields) */}
                {["color", "origin"].map((field) => (
                  <li
                    key={field}
                    className="grid grid-cols-[8rem,1fr] items-center gap-2"
                  >
                    <span className="font-medium capitalize">{field}:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData[field] || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, [field]: e.target.value })
                        }
                        className="border p-2 rounded w-full"
                      />
                    ) : (
                      <span className="text-gray-600">
                        {editData[field] || "N/A"}
                      </span>
                    )}
                  </li>
                ))}

                {/* Size fields (Length, Width, Thickness) */}
                {[
                  {
                    label: "Length",
                    key: "length",
                    unitKey: "lengthMeasurement",
                    units: ["ft", "m"],
                  },
                  {
                    label: "Width",
                    key: "width",
                    unitKey: "widthMeasurement",
                    units: ["ft", "m"],
                  },
                  {
                    label: "Thickness",
                    key: "thickness",
                    unitKey: "thicknessMeasurement",
                    units: ["inch", "cm"],
                  },
                ].map(({ label, key, unitKey, units }) => (
                  <li
                    key={key}
                    className="grid grid-cols-[8rem,1fr] items-center gap-2"
                  >
                    <span className="font-medium">{label}:</span>

                    {isEditing ? (
                      <div className="flex gap-2 w-full">
                        <input
                          type="text"
                          value={editData.size?.[key] || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              size: { ...editData.size, [key]: e.target.value },
                            })
                          }
                          className="border p-2 rounded w-full"
                        />
                        <select
                          value={editData.size?.[unitKey] || units[0]}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              size: {
                                ...editData.size,
                                [unitKey]: e.target.value,
                              },
                            })
                          }
                          className="border p-2 rounded"
                        >
                          {units.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className="text-gray-600">
                        {editData.size?.[key] || "N/A"}{" "}
                        {editData.size?.[unitKey]}
                      </span>
                    )}
                  </li>
                ))}

                {/* Weight */}
                <li className="grid grid-cols-[8rem,1fr] items-center gap-2">
                  <span className="font-medium">Weight:</span>
                  {isEditing ? (
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        value={editData.weight || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, weight: e.target.value })
                        }
                        className="border p-2 rounded w-full"
                      />
                      <select
                        value={editData.weightMeasurement || "kg"}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            weightMeasurement: e.target.value,
                          })
                        }
                        className="border p-2 rounded"
                      >
                        <option value="kg">kg</option>
                        <option value="ton">ton</option>
                      </select>
                    </div>
                  ) : (
                    <span className="text-gray-600">
                      {editData.weight || "N/A"} {editData.weightMeasurement}
                    </span>
                  )}
                </li>
              </ul>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                Description
              </h2>
              {isEditing ? (
                <textarea
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full h-40 border p-2 text-sm"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600 hide-scrollbar leading-relaxed text-xs md:text-sm max-h-[300px] scroll-smooth overflow-y-auto overflow-x-hidden">
                  {product.description || "No description available."}
                </p>
              )}
            </div>
          </div>

          {/* Sticky Save Button */}
          {isEditing && (
            <div className="transform mt-10">
              <button
                onClick={handleSave}
                className="flex items-center gap-3 bg-navyblue border border-navyblue text-white px-6 py-2 rounded-md shadow-lg cursor-pointer hover:bg-white hover:text-navyblue transition"
              >
                {isSaving && <Spinner />}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {/* Confirmation Dialog */}
          <AlertDialogMenu
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Are you sure you want to delete this product?"
            description="This action cannot be undone. This will permanently remove this product from your store."
            confirmText={isDeleting ? "Deleting..." : "Delete"}
            variant="danger"
            onConfirm={() => {
              // close dialog, then delete
              setDeleteDialogOpen(false);
              handleDeleteConfirmed();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
