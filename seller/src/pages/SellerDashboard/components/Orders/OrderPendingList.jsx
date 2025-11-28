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

  const contractOrderIds = new Set(
    contracts.map((c) => c.order?.toString())
  );

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
              className="bg-white rounded-xl border shadow-sm p-4 flex flex-col sm:grid sm:grid-cols-12 gap-4"
            >
              {/* Product Info */}
              <div className="sm:col-span-5 flex gap-4 items-center">
                <img
                  src={p.productImages?.[0]}
                  className="w-20 h-20 sm:w-16 sm:h-16 rounded-lg border object-cover shadow-sm"
                  alt="product"
                />

                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {p.productName}
                  </p>
                  <p className="text-xs text-gray-500">{p.category?.join(", ")}</p>
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

              {/* Quantity */}
              <div className="sm:col-span-2 flex justify-between sm:block">
                <span className="sm:hidden font-semibold text-gray-700">
                  Quantity:
                </span>
                <p className="text-gray-700 font-medium text-sm">
                  {order.quantity}
                </p>
              </div>

              {/* Total Price */}
              <div className="sm:col-span-2 flex justify-between sm:block">
                <span className="sm:hidden font-semibold text-gray-700">
                  Total Price:
                </span>
                <p className="text-gray-900 font-semibold text-sm">
                  ₹{order.totalPrice}
                </p>
              </div>

              {/* Buyer Info */}
         <div className="sm:col-span-2 flex flex-col sm:block gap-2">
  {/* Name + Avatar Row */}
  <div className="flex items-center gap-2">
    <img
      src={order.userId?.profileImage}
      className="w-8 h-8 sm:w-7 sm:h-7 rounded-full border object-cover"
      alt="buyer"
    />

    <p className="font-medium text-gray-800 text-sm sm:text-sm">
      {order.userId?.name}
    </p>
  </div>

  {/* Email + Mobile */}
  <div className="ml-0 sm:ml-0 mt-1 sm:mt-1">
    <p className="text-xs text-gray-500 break-all">{order.userId?.email}</p>
    <p className="text-xs text-gray-500">{order.userId?.mobile}</p>
  </div>
</div>


              {/* Action Button */}
              <div className="sm:col-span-1 flex items-center justify-center">
                {alreadyCreated ? (
                  <span className="bg-green-100 text-green-700 text-xs sm:text-[10px]  font-semibold px-3 py-1.5 rounded-full">
                    ✓ Contract Created
                  </span>
                ) : (
                  <button
                    onClick={() => handleCreateContract(order)}
                    disabled={creating === order._id}
                    className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all w-full sm:w-auto
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
