import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Search } from "lucide-react";
import api from "@/utils/axios.utils";

export default function OrderPendingList() {
  const [orders, setOrders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [creating, setCreating] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, contractsRes] = await Promise.all([
          api.get("/orders/status/pending"),
          api.get("/contracts"),
        ]);

        setOrders(ordersRes.data.orders);
        setContracts(contractsRes.data);
      } catch (error) {
        console.error("Error fetching pending orders or contracts", error);
      }
    };
    fetchData();
  }, []);

  const contractOrderIds = new Set(contracts.map((c) => c.order?.toString()));

  const filteredOrders = orders.filter((order) =>
    order.productId?.productName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleCreateContract = async (order) => {
    setCreating(order._id);

    try {
      const payload = {
        order: order._id,
        client: order.userId.name,
        status: "Active",
      };

      await api.post("/contracts/add", payload);

      navigate("/sellerdashboard/contracts");
    } catch (err) {
      alert("Failed to create contract");
    } finally {
      setCreating(null);
    }
  };

  console.log("contracts", contracts);
  console.log("orders", orders);

  return (
    <div className="w-full p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Pending Orders
          <span className="text-gray-500 text-sm ml-2">({orders.length})</span>
        </h2>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by product…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-400 
            text-sm bg-white shadow-sm"
          />
        </div>
      </div>

      {/* List Container */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const p = order.productId;
          const alreadyCreated = contractOrderIds.has(order._id.toString());

          return (
            <div
              key={order._id}
              className="bg-white rounded-xl border shadow-sm p-4 
             grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
            >
              {/* Product Info */}
              <div className="sm:col-span-5 flex items-center gap-4">
                <img
                  src={p.productImages?.[0]}
                  className="w-20 h-20 sm:w-16 sm:h-16 rounded-lg border object-cover"
                  alt="product"
                />

                <div className="space-y-0.5">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {p.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {p.category?.join(", ")}
                  </p>
                  <p className="text-xs text-gray-500">Origin: {p.origin}</p>

                  <button
                    onClick={() =>
                      navigate(`/sellerdashboard/product/${order.productId.id}`)
                    }
                    className="text-blue-600 text-xs font-semibold hover:underline"
                  >
                    View Product →
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="sm:col-span-2 text-sm text-gray-700 flex sm:block justify-between">
                <span className="sm:hidden font-semibold">Quantity</span>
                <span className="font-medium">{order.quantity}</span>
              </div>

              {/* Total Price */}
              <div className="sm:col-span-2 text-sm flex sm:block justify-between">
                <span className="sm:hidden font-semibold text-gray-700">
                  Total Price
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{order.totalPrice}
                </span>
              </div>

              {/* Buyer Info */}
              <div className="sm:col-span-2 flex items-center gap-3">
                <img
                  src={order.userId?.profileURL}
                  className="w-8 h-8 rounded-full border object-cover"
                  alt="buyer"
                />

                <div className="leading-tight">
                  <p className="text-sm font-medium text-gray-800">
                    {order.userId?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[140px]">
                    {order.userId?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.userId?.mobile}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="sm:col-span-1 flex justify-end sm:justify-center">
                {alreadyCreated ? (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    ✓ Contract Created
                  </span>
                ) : (
                  <button
                    onClick={() => handleCreateContract(order)}
                    disabled={creating === order._id}
                    className={`text-xs px-4 py-2 rounded-lg font-semibold w-full sm:w-auto
        ${
          creating === order._id
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
                  >
                    {creating === order._id ? "Creating…" : "Create"}
                  </button>
                )}
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
