// import React, { useEffect, useState } from "react";
// import { CheckCircle, ArrowRight, Search } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import api from "@/utils/axios.utils";

// const OrderCompletedList = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await api.get("/orders/status/completed");
//         setOrders(res.data.orders);
//       } catch (error) {
//         console.error("Error fetching completed orders", error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleViewDetails = (productId) => {
//     navigate(`/product/${productId}`);
//   };

//   const filteredOrders = orders.filter((order) =>
//     order.productId?.productName
//       ?.toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="w-full h-screen sm:h-[85vh] p-3 flex flex-col">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 ">
//           <CheckCircle className="h-7 w-7 text-green-500" />
//           Completed Orders
//         </h2>

//         {/* Search Bar */}
//         <div className="relative w-full sm:w-64">
//           <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search product..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-700"
//           />
//         </div>
//       </div>

//       {/* Scrollable Order List */}
//       <div className="overflow-y-auto flex-1 hide-scrollbar flex flex-col gap-4">
//         {filteredOrders.length > 0 ? (
//           filteredOrders.map((order) => {
//             const product = order.productId;

//             return (
//               <div
//                 key={order._id}
//                 className="grid grid-cols-1 sm:grid-cols-5 items-center border-b py-4 hover:bg-gray-50 transition"
//               >
//                 {/* ----------------------------------------------------
//             1️⃣ Product Images (left section - clickable)
//         ---------------------------------------------------- */}
//                 <div className="flex items-center gap-3 px-2">
//                   <div className="flex flex-col gap-2">
//                     {product.productImages?.slice(0, 2).map((img, idx) => (
//                       <img
//                         key={idx}
//                         src={img}
//                         className="w-16 h-16 object-cover rounded border cursor-pointer hover:scale-105 transition"
//                         alt="product-img"
//                         onClick={() => window.open(img, "_blank")}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 {/* ----------------------------------------------------
//             2️⃣ Product Details
//         ---------------------------------------------------- */}
//                 <div className="px-2">
//                   <h3 className="font-semibold text-gray-900 text-sm">
//                     {product.productName}
//                   </h3>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Category: {product.category?.join(", ")}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Sub Category: {product.subCategory?.join(", ")}
//                   </p>

//                   <p className="text-xs text-gray-500">
//                     Grade: {product.grade}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Color: {product.color}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Origin: {product.origin}
//                   </p>

//                   <p className="text-xs text-gray-500">
//                     Size: {product.size.length}
//                     {product.size.lengthMeasurement} × {product.size.width}
//                     {product.size.widthMeasurement} × {product.size.thickness}
//                     {product.size.thicknessMeasurement}
//                   </p>

//                   <p className="text-xs text-gray-500">
//                     Weight: {product.weight} {product.weightMeasurement}
//                   </p>

//                   <p className="text-xs text-gray-500">
//                     Price: ₹{product.pricePerUnit}/{product.priceUnit}
//                   </p>
//                 </div>

//                 {/* ----------------------------------------------------
//             3️⃣ Metrics / Price / Views
//         ---------------------------------------------------- */}
//                 <div className="px-2 text-sm text-gray-700">
//                   <p>Total Price: ₹{order.totalPrice}</p>
//                   <p className="text-xs text-gray-500">
//                     Views: {product.views}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Ordered Qty: {order.quantity}
//                   </p>
//                 </div>

//                 {/* ----------------------------------------------------
//             4️⃣ Buyer (User) Details
//         ---------------------------------------------------- */}
//                 <div className="px-2 text-sm">
//                   <p className="font-medium">{order.userId?.name}</p>
//                   <p className="text-xs text-gray-600">{order.userId?.email}</p>
//                   <p className="text-xs text-gray-600">
//                     {order.userId?.mobile}
//                   </p>
//                 </div>

//                 {/* ----------------------------------------------------
//             5️⃣ Completed Status
//         ---------------------------------------------------- */}
//                 <div className="flex items-center px-2 gap-2">
//                   <CheckCircle className="h-6 w-6 text-green-500" />
//                   <span className="text-green-600 text-sm font-semibold">
//                     Completed
//                   </span>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="text-center py-10 text-gray-500">
//             No completed orders.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderCompletedList;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Search } from "lucide-react";
import api from "@/utils/axios.utils";

export default function OrderCompletedList() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/status/completed");
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Error fetching completed orders", error);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.productId?.productName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Completed Orders ({orders.length})
        </h2>

        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded-lg shadow-sm bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr className="text-left text-gray-600">
              <th className="px-4 py-3 w-10"></th>

              <th className="px-4 py-3 w-72">Product Details</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Total Price</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => {
              const p = order.productId;
              return (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3"></td>

                  {/* PRODUCT DETAILS */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.productImages?.[0]}
                        className="w-14 h-14 object-cover rounded border"
                        alt="product"
                      />

                      <div>
                        <p className="font-medium text-gray-800">
                          {p.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Category: {p.category?.join(", ")}
                        </p>
                        <p className="text-xs text-gray-500">
                          Origin: {p.origin}
                        </p>
                        <p className="text-xs text-gray-500">
                          Price Per Unit: {p.pricePerUnit} {p.priceUnit}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* QUANTITY */}
                  <td className="px-4 py-3 text-gray-700">{order.quantity}</td>

                  {/* PRICE COLUMN */}
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    ₹{order.totalPrice}
                  </td>

                  {/* USER DETAILS */}
                  <td className="px-4 py-3 ">
                    <p className=" text-gray-800 h-7 w-7 rounded-full ">
                      <img
                        src={order.userId?.profileImage}
                        alt=""
                        className="rounded-full h-6 w-6"
                      />
                    </p>
                    <p className="font-medium text-gray-800">
                      {order.userId?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.userId?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.userId?.mobile}
                    </p>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium text-xs">
                        Completed
                      </span>
                    </div>
                  </td>

                  <td>
                    <p
                      className="text-blue-600 font-medium text-xs ml-1 cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(
                          `/sellerdashboard/product/${order.productId.id}`
                        )
                      }
                    >
                      View Product
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No completed orders found.
          </div>
        )}
      </div>
    </div>
  );
}
