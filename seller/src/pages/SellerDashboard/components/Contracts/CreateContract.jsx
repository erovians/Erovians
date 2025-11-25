import React, { useState, useEffect } from "react";
import api from "@/utils/axios.utils";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

export default function CreateContract() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const [ordersRes, contractsRes] = await Promise.all([
        api.get("/orders/status/pending"),
        api.get("/contracts"),
      ]);

      const pendingOrders = ordersRes.data.orders;
      const contracts = contractsRes.data;

      const contractOrderIds = contracts.map((c) => c.order.toString());

      const filteredOrders = pendingOrders.filter(
        (o) => !contractOrderIds.includes(o._id.toString())
      );

      setOrders(filteredOrders);
    };

    fetchOrders();
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const payload = {
        order: selectedOrder._id,
        client: selectedOrder.userId.name,
        status: "Active",
      };

      await api.post("/contracts/add", payload);
      alert("Contract created successfully");
      navigate("/sellerdashboard/contracts");
    } catch (err) {
      alert("Failed to create contract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full mt-10 px-4">
      <div className="bg-[#0e1525] w-full max-w-2xl p-8 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)] text-white backdrop-blur-lg">
        {/* Header */}
        <h2 className="text-2xl font-semibold mb-8 text-center bg-gradient-to-r from-blue-400 to-blue-200 text-transparent bg-clip-text">
          Create Contract
        </h2>

        {/* Order Selection */}
        <label className="font-semibold block mb-3 text-gray-200">
          Select Pending Order
        </label>

        {orders.length > 0 ? (
          <select
            className="w-full p-3 rounded-lg bg-[#1b2336] border border-white/20 mb-6 text-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer hover:bg-[#232e44]"
            onChange={(e) =>
              setSelectedOrder(orders.find((o) => o._id === e.target.value))
            }
          >
            <option className="text-gray-400">
              -- Select a pending order --
            </option>
            {orders.map((o) => (
              <option key={o._id} value={o._id}>
                {o.productId.productName} — {o.userId.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="w-full p-3 rounded-lg bg-[#1b2336] border border-white/20 mb-6 text-gray-300 text-center">
            ❌ No pending orders available for creating a contract
          </p>
        )}

        {/* Order Details */}
        {selectedOrder && (
          <div className="bg-[#121a2d] border border-white/10 p-5 rounded-xl mb-6 shadow-inner transition-all duration-300">
            <h1 className="mb-3 text-white">Order Summary</h1>

            <div className="space-y-1 text-sm">
              <p>
                <span className="font-semibold text-gray-300">Order ID:</span>{" "}
                {selectedOrder._id}
              </p>
              <p>
                <span className="font-semibold text-gray-300">
                  Client Name:
                </span>{" "}
                {selectedOrder.userId.name}
              </p>

              <p>
                <span className="font-semibold text-gray-300">Product:</span>{" "}
                {selectedOrder.productId.productName}
              </p>
              <p>
                <span className="font-semibold text-gray-300">
                  Price per Unit:
                </span>{" "}
                ₹{selectedOrder.productId.pricePerUnit}
              </p>

              <p>
                <span className="font-semibold text-gray-300">Quantity:</span>{" "}
                {selectedOrder.quantity}
              </p>
              <p>
                <span className="font-semibold text-gray-300">
                  Total Price:
                </span>{" "}
                ₹{selectedOrder.totalPrice}
              </p>

              <p>
                <span className="font-semibold text-gray-300">Order Date:</span>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Create Button */}
        {orders.length > 0 && (
          <button
            disabled={!selectedOrder || loading}
            onClick={handleCreate}
            className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex justify-center items-center gap-2
  ${
    loading || !selectedOrder
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-blue-500/30"
  }`}
          >
            <span>{loading ? "Creating " : "Create Contract"}</span>
            {loading && <Spinner size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
