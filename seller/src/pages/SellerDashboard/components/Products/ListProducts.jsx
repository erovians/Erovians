// import React, { useEffect, useState } from "react";
// import api from "@/utils/axios.utils";
// import { Link } from "react-router-dom";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// import { Filter } from "../Helper/Filter";
// import { Search } from "../Helper/Search";

// const ListProducts = ({ companyId = "651234abcd5678ef90123456" }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [category, setCategory] = useState("all");
//   const [subCategory, setSubCategory] = useState("all");
//   const [search, setSearch] = useState("");

//   const [debouncedSearch, setDebouncedSearch] = useState(search);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 500);

//     return () => clearTimeout(handler);
//   }, [search]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);

//       const res = await api.get("/product/list", {
//         params: {
//           companyId,
//           category: category === "all" ? "" : category,
//           subCategory: subCategory === "all" ? "" : subCategory,
//           search: debouncedSearch,
//         },
//       });

//       setProducts(res.data.data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load products.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch when companyId, filters, or debouncedSearch changes
//   useEffect(() => {
//     if (companyId) fetchProducts();
//   }, [companyId, category, subCategory, debouncedSearch]);

//   // if (loading) return <p>Loading products...</p>;
//   if (error) return <p className="text-red-600">{error}</p>;

//   return (
//     <div className="space-y-6">
//       <div className="flex  justify-between gap-4 items-center p-5 rounded-lg sticky top-0 ">
//         <div className="flex gap-4">
//           <Filter
//             label="Categories"
//             value={category}
//             onChange={setCategory}
//             options={[
//               { label: "All Categories", value: "all" },
//               { label: "Marble", value: "Marble" },
//               { label: "Granite", value: "Granite" },
//             ]}
//             loading={loading}
//           />
//           <Filter
//             label="SubCategory"
//             value={subCategory}
//             onChange={setSubCategory}
//             options={[
//               { label: "All Subcategories", value: "all" },
//               { label: "Polished", value: "Polished" },
//               { label: "Honed", value: "Honed" },
//               { label: "Natural", value: "Natural" },
//             ]}
//             loading={loading}
//           />
//         </div>
//         <Search
//           value={search}
//           onChange={setSearch}
//           placeholder="Search product..."
//         />
//       </div>

//       {/* Products */}
//       {products.length === 0 ? (
//         <p className="text-center text-xl text-gray-500 mt-50 ">
//           No products found
//         </p>
//       ) : (
//         products.map((product) => (
//           <div
//             key={product._id}
//             className="relative flex flex-col md:flex-row rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white"
//           >
//             {/* Status Badge */}
//             <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
//               <span
//                 className={`px-3 py-1 rounded-full text-xs font-medium ${
//                   product.status === "active"
//                     ? "bg-green-100 text-green-700 border border-green-300"
//                     : "bg-red-100 text-red-700 border border-red-300"
//                 }`}
//               >
//                 {product.status === "active" ? "Active" : "Inactive"}
//               </span>
//             </div>

//             {/* Left: Images */}
//             <div className="md:w-1/3 w-full h-48 md:h-auto flex items-center justify-center bg-gray-50">
//               {product.productImages?.length > 0 ? (
//                 <Carousel className="w-full h-full">
//                   <CarouselContent>
//                     {product.productImages.map((img, idx) => (
//                       <CarouselItem
//                         key={idx}
//                         className="flex items-center justify-center"
//                       >
//                         <img
//                           src={img}
//                           alt={`${product.productName} ${idx + 1}`}
//                           className="w-full h-48 md:h-56 object-contain"
//                         />
//                       </CarouselItem>
//                     ))}
//                   </CarouselContent>
//                   <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-white" />
//                   <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-white" />
//                 </Carousel>
//               ) : (
//                 <div className="w-full h-48 flex items-center justify-center text-gray-400">
//                   No Image
//                 </div>
//               )}
//             </div>

//             {/* Right: Details */}
//             <Link
//               to={`/sellerdashboard/product/${product._id}`}
//               className="md:w-2/3 w-full p-4 flex flex-col justify-between"
//             >
//               <div>
//                 <h3 className="text-lg md:text-xl font-semibold text-gray-800">
//                   {product.productName}
//                 </h3>
//                 <ul className="mt-2 text-sm text-gray-600 space-y-1">
//                   <li>
//                     <span className="font-medium">Category:</span>{" "}
//                     {product.category}
//                   </li>
//                   <li>
//                     <span className="font-medium">Sub Category:</span>{" "}
//                     {product.subCategory}
//                   </li>
//                   <li>
//                     <span className="font-medium">Grade:</span> {product.grade}
//                   </li>
//                   <li>
//                     <span className="font-medium">Size:</span>{" "}
//                     {product.size?.length} × {product.size?.width} ×{" "}
//                     {product.size?.thickness}
//                   </li>
//                   <li>
//                     <span className="font-medium">Origin:</span>{" "}
//                     {product.origin || "N/A"}
//                   </li>
//                 </ul>
//                 <p className="mt-2 text-gray-500 text-sm line-clamp-3">
//                   {product.description}
//                 </p>
//               </div>
//               <div className="mt-3 flex items-baseline gap-2">
//                 <span className="text-xl md:text-2xl font-bold text-black">
//                   ₹{product.pricePerUnit}
//                 </span>
//                 <span className="text-sm text-gray-500">/{product.unit}</span>
//               </div>
//             </Link>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ListProducts;
import React, { useEffect, useState } from "react";
import api from "@/utils/axios.utils";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Filter } from "../Helper/Filter";
import { Search } from "../Helper/Search";

const ListProducts = ({ companyId = "651234abcd5678ef90123456" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("all");
  const [subCategory, setSubCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    violation: 0,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // 🔹 Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // 🔹 Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);

      // 1️⃣ Fetch ALL products once (to calculate counts)
      const resAll = await api.get("/product/list", {
        params: { companyId },
      });
      const allProducts = resAll.data.data || [];

      // 2️⃣ Update counts from all data
      const counts = {
        all: allProducts.length,
        active: allProducts.filter((p) => p.status === "active").length,
        inactive: allProducts.filter((p) => p.status === "inactive").length,
        pending: allProducts.filter((p) => p.status === "pending").length,
        violation: allProducts.filter((p) => p.status === "violation").length,
      };
      setStatusCounts(counts);

      // 3️⃣ Apply filters locally (category, subcategory, search, status)
      let filtered = [...allProducts];

      if (category !== "all")
        filtered = filtered.filter((p) => p.category === category);
      if (subCategory !== "all")
        filtered = filtered.filter((p) => p.subCategory === subCategory);
      if (debouncedSearch)
        filtered = filtered.filter((p) =>
          p.productName.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      if (statusFilter !== "all")
        filtered = filtered.filter((p) => p.status === statusFilter);

      setProducts(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Refetch when filters or search change
  useEffect(() => {
    if (companyId) fetchProducts();
  }, [companyId, category, subCategory, debouncedSearch, statusFilter]);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* 🔹 Combined Sticky Header (Filters + Status) */}
      <div className="sticky top-0 z-30 bg-white shadow-sm rounded-lg">
        {/* 🔸 Top Filter Ribbon */}
        <div className="flex flex-wrap justify-between gap-4 items-center p-4">
          <div className="flex gap-5 flex-wrap">
            <Filter
              label="Categories"
              value={category}
              onChange={setCategory}
              options={[
                { label: "All Categories", value: "all" },
                { label: "Marble", value: "Marble" },
                { label: "Granite", value: "Granite" },
              ]}
              loading={loading}
            />
            <Filter
              label="SubCategory"
              value={subCategory}
              onChange={setSubCategory}
              options={[
                { label: "All Subcategories", value: "all" },
                { label: "Polished", value: "Polished" },
                { label: "Honed", value: "Honed" },
                { label: "Natural", value: "Natural" },
              ]}
              loading={loading}
            />
          </div>

          <Search
            value={search}
            onChange={setSearch}
            placeholder="Search product..."
          />
        </div>

        {/* 🟢 Status Filter Ribbon with Counts */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-white border-t border-gray-100 rounded-b-lg">
          {[
            { label: "All", value: "all", color: "bg-gray-200 text-gray-800" },
            {
              label: "Online",
              value: "active",
              color: "bg-green-100 text-green-700",
            },
            {
              label: "Offline",
              value: "inactive",
              color: "bg-red-100 text-red-700",
            },
            {
              label: "Pending",
              value: "pending",
              color: "bg-yellow-100 text-yellow-700",
            },
            {
              label: "Violation",
              value: "violation",
              color: "bg-purple-100 text-purple-700",
            },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium border transition-all duration-200 ${
                statusFilter === status.value
                  ? `${status.color} border-black`
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {status.label}
              <span className="px-2 py-0.5  text-gray-600 rounded-full text-xs font-semibold">
                {statusCounts[status.value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 🧱 Scrollable Product List Section */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-xl text-gray-500 mt-10">
            No products found
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="relative flex flex-col md:flex-row rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white"
            >
              {/* Status Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === "active"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : product.status === "inactive"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : product.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      : "bg-purple-100 text-purple-700 border border-purple-300"
                  }`}
                >
                  {product.status === "active"
                    ? "Active"
                    : product.status === "inactive"
                    ? "Inactive"
                    : product.status === "pending"
                    ? "Pending"
                    : "Violation"}
                </span>
              </div>

              {/* Left: Images */}
              <div className="md:w-1/3 w-full h-48 md:h-auto flex items-center justify-center bg-gray-50">
                {product.productImages?.length > 0 ? (
                  <Carousel className="w-full h-full">
                    <CarouselContent>
                      {product.productImages.map((img, idx) => (
                        <CarouselItem
                          key={idx}
                          className="flex items-center justify-center"
                        >
                          <img
                            src={img}
                            alt={`${product.productName} ${idx + 1}`}
                            className="w-full h-48 md:h-56 object-contain"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 rounded-full shadow hover:bg-white" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 rounded-full shadow hover:bg-white" />
                  </Carousel>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <Link
                to={`/sellerdashboard/product/${product._id}`}
                className="md:w-2/3 w-full p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                    {product.productName}
                  </h3>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>
                      <span className="font-medium">Category:</span>{" "}
                      {product.category}
                    </li>
                    <li>
                      <span className="font-medium">Sub Category:</span>{" "}
                      {product.subCategory}
                    </li>
                    <li>
                      <span className="font-medium">Grade:</span>{" "}
                      {product.grade}
                    </li>
                    <li>
                      <span className="font-medium">Size:</span>{" "}
                      {product.size?.length} × {product.size?.width} ×{" "}
                      {product.size?.thickness}
                    </li>
                    <li>
                      <span className="font-medium">Origin:</span>{" "}
                      {product.origin || "N/A"}
                    </li>
                  </ul>
                  <p className="mt-2 text-gray-500 text-sm line-clamp-3">
                    {product.description}
                  </p>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-bold text-black">
                    ₹{product.pricePerUnit}
                  </span>
                  <span className="text-sm text-gray-500">/{product.unit}</span>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListProducts;
