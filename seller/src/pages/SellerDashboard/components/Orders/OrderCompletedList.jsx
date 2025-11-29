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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Completed Orders ({orders.length})
        </h2>

        <div className="relative w-full sm:w-64">
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

      {/* TABLE WRAPPER */}
      <div className="overflow-auto border rounded-lg shadow-sm bg-white">
        <table className="hidden md:table min-w-full text-sm">
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
                  <td className="px-4 py-3"></td>

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

                  <td className="px-4 py-3 text-gray-700">
                    {order.quantity}
                  </td>

                  <td className="px-4 py-3 font-semibold text-gray-700">
                    ₹{order.totalPrice}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={order.userId?.profileImage}
                        className="h-6 w-6 rounded-full"
                        alt="profile"
                      />
                      <p className="font-medium text-gray-800">
                        {order.userId?.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {order.userId?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.userId?.mobile}
                    </p>
                  </td>

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
                      className="text-blue-600 font-medium text-sm ml-1 cursor-pointer hover:underline"
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

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y">
          {filteredOrders.map((order) => {
            const p = order.productId;

            return (
              <div key={order._id} className="p-4 flex flex-col gap-3">
                {/* Product */}
                <div className="flex items-center gap-3">
                  <img
                    src={p.productImages?.[0]}
                    alt="product"
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{p.productName}</p>
                    <p className="text-xs text-gray-500">
                      Category: {p.category?.join(", ")}
                    </p>
                    <p className="text-xs text-gray-500">Origin: {p.origin}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Quantity: </span>
                    {order.quantity}
                  </p>
                  <p>
                    <span className="font-medium">Total Price: </span>₹
                    {order.totalPrice}
                  </p>
                </div>

                {/* Buyer */}
                <div>
                  <div className="flex items-center gap-2">
                    <img
                      src={order.userId?.profileImage}
                      className="w-7 h-7 rounded-full"
                      alt="profile"
                    />
                    <p className="font-medium text-gray-800">
                      {order.userId?.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {order.userId?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.userId?.mobile}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium text-xs">
                    Completed
                  </span>
                </div>

                <button
                  className="text-blue-600 text-sm mt-2 font-medium underline"
                  onClick={() =>
                    navigate(`/sellerdashboard/product/${p.id}`)
                  }
                >
                  View Product
                </button>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No completed orders found.
          </div>
        )}
      </div>
    </div>
  );
}
