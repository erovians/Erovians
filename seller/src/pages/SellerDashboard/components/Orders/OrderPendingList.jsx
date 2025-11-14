// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Clock, Search } from "lucide-react"; // 🟡 Using Clock icon for pending
// import api from "@/utils/axios.utils";

// export default function OrderPendingList() {
//   const [orders, setOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await api.get("/orders/status/pending");
//         setOrders(res.data.orders);
//       } catch (error) {
//         console.error("Error fetching pending orders", error);
//       }
//     };
//     fetchOrders();
//   }, []);

//   const filteredOrders = orders.filter((order) =>
//     order.productId?.productName
//       ?.toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="w-full p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Pending Orders ({orders.length})
//         </h2>

//         <div className="relative w-64">
//           <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search product..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none text-sm"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto border rounded-lg shadow-sm bg-white">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100 border-b">
//             <tr className="text-left text-gray-600">
//               <th className="px-4 py-3 w-10"></th>
//               <th className="px-4 py-3 w-72">Product Details</th>
//               <th className="px-4 py-3">Quantity</th>
//               <th className="px-4 py-3">Total Price</th>
//               <th className="px-4 py-3">Buyer</th>
//               <th className="px-4 py-3">Status</th>
//               <th className="px-4 py-3"></th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredOrders.map((order) => {
//               const p = order.productId;
//               return (
//                 <tr
//                   key={order._id}
//                   className="border-b hover:bg-gray-50 transition"
//                 >
//                   <td className="px-4 py-3"></td>

//                   {/* PRODUCT DETAILS */}
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={p.productImages?.[0]}
//                         className="w-14 h-14 object-cover rounded border"
//                         alt="product"
//                       />

//                       <div>
//                         <p className="font-medium text-gray-800">
//                           {p.productName}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           Category: {p.category?.join(", ")}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           Origin: {p.origin}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           Price Per Unit: {p.pricePerUnit} {p.priceUnit}
//                         </p>
//                       </div>
//                     </div>
//                   </td>

//                   {/* QUANTITY */}
//                   <td className="px-4 py-3 text-gray-700">{order.quantity}</td>

//                   {/* PRICE */}
//                   <td className="px-4 py-3 font-semibold text-gray-700">
//                     ₹{order.totalPrice}
//                   </td>

//                   {/* BUYER */}
//                   <td className="px-4 py-3 ">
//                     <p className="h-7 w-7 rounded-full overflow-hidden">
//                       <img
//                         src={order.userId?.profileImage}
//                         alt=""
//                         className="rounded-full h-6 w-6"
//                       />
//                     </p>
//                     <p className="font-medium text-gray-800">
//                       {order.userId?.name}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {order.userId?.email}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {order.userId?.mobile}
//                     </p>
//                   </td>

//                   {/* STATUS */}
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-4 w-4 text-yellow-500" />
//                       <span className="text-yellow-600 font-medium text-xs">
//                         Pending
//                       </span>
//                     </div>
//                   </td>

//                   {/* VIEW PRODUCT */}
//                   <td>
//                     <p
//                       className="text-blue-600 font-medium text-xs ml-1 cursor-pointer hover:underline"
//                       onClick={() =>
//                         navigate(
//                           `/sellerdashboard/product/${order.productId.id}`
//                         )
//                       }
//                     >
//                       View Product
//                     </p>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {filteredOrders.length === 0 && (
//           <div className="py-8 text-center text-gray-500">
//             No pending orders found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Search } from "lucide-react";
import api from "@/utils/axios.utils";

export default function OrderPendingList() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/status/pending");
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Error fetching pending orders", error);
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
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Pending Orders
          <span className="text-gray-500 text-lg ml-2">({orders.length})</span>
        </h2>

        <div className="relative w-64">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by product…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border rounded-lg 
            focus:outline-none focus:ring-[2px] focus:ring-blue-400 
            text-sm bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Sticky Table Header */}
        <div
          className="bg-gray-100 py-3 px-5 grid grid-cols-12 
        text-xs font-semibold text-gray-600"
        >
          <div className="col-span-5">Product Details</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-2">Total Price</div>
          <div className="col-span-2">Buyer</div>
          <div className="col-span-1 text-center">Status</div>
        </div>

        {/* Rows */}
        {filteredOrders.map((order) => {
          const p = order.productId;
          return (
            <div
              key={order.id}
              className="grid grid-cols-12 items-center px-5 py-4
              border-b hover:bg-gray-50 transition"
            >
              {/* PRODUCT DETAILS */}
              <div className="col-span-5 flex gap-4 items-center">
                <img
                  src={p.productImages?.[0]}
                  className="w-16 h-16 rounded-lg border object-cover shadow-sm"
                  alt="product"
                />
                <div className="flex flex-col">
                  <p className="font-medium text-gray-900 text-sm">
                    {p.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {p.category?.join(", ")}
                  </p>
                  <p className="text-xs text-gray-500">Origin: {p.origin}</p>

                  <p
                    className="text-blue-600 text-xs font-semibold mt-1 cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/sellerdashboard/product/${order.productId.id}`)
                    }
                  >
                    View Product →
                  </p>
                </div>
              </div>

              {/* QUANTITY */}
              <div className="col-span-2 text-gray-700 font-medium text-sm">
                {order.quantity}
              </div>

              {/* TOTAL PRICE */}
              <div className="col-span-2 text-gray-900 font-semibold text-sm">
                ₹{order.totalPrice}
              </div>

              {/* BUYER DETAILS */}
              <div className="col-span-2 flex flex-col text-sm">
                <div className="flex items-center gap-2">
                  <img
                    src={order.userId?.profileImage}
                    className="w-6 h-6 rounded-full border"
                    alt=""
                  />
                  <p className="font-medium text-gray-800">
                    {order.userId?.name}
                  </p>
                </div>
                <p className="text-xs text-gray-500">{order.userId?.email}</p>
                <p className="text-xs text-gray-500">{order.userId?.mobile}</p>
              </div>

              {/* STATUS */}
              <div className="col-span-1 text-center">
                <span
                  className="inline-flex items-center gap-1 bg-yellow-100 
                text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  <Clock className="h-3 w-3" />
                  Pending
                </span>
              </div>
            </div>
          );
        })}

        {/* No Results */}
        {filteredOrders.length === 0 && (
          <div className="py-10 text-center text-gray-500 text-sm">
            No pending orders found.
          </div>
        )}
      </div>
    </div>
  );
}
