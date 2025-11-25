import React, { useState, useEffect } from "react";
import api from "@/utils/axios.utils";
import { useNavigate } from "react-router-dom";

export default function CreateContract() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.get("/orders/status/pending");
      setOrders(res.data.orders);
    };
    fetchOrders();
  }, []);

  const handleCreate = async () => {
    const payload = {
      order: selectedOrder._id,
      client: selectedOrder.userId.name,
      status: "Active", // default
    };

    await api.post("/contracts/add", payload);
    alert("Contract created successfully");
    navigate("/sellerdashboard/contracts");
  };

  return (
    <div className="flex justify-center w-full mt-10">
      <div className="bg-[#111827] w-full max-w-xl p-8 rounded-2xl border border-white/10 shadow-lg text-white">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Create Contract
        </h2>

        {/* Order Selection */}
        <label className="font-semibold block mb-2">Select Pending Order</label>
        <select
          className="w-full p-3 rounded bg-[#1e2636] border border-white/20 mb-5 text-sm"
          onChange={(e) =>
            setSelectedOrder(orders.find((o) => o._id === e.target.value))
          }
        >
          <option>Select a pending order</option>
          {orders.map((o) => (
            <option key={o._id} value={o._id}>
              {o.productId.productName} — {o.userId.name}
            </option>
          ))}
        </select>

        {selectedOrder && (
          <div className="bg-[#1f2937] p-4 rounded-lg mb-5 text-sm">
            <p>
              <b>Order ID:</b> {selectedOrder._id}
            </p>
            <p>
              <b>Client:</b> {selectedOrder.userId.name}
            </p>
          </div>
        )}

        <button
          disabled={!selectedOrder}
          onClick={handleCreate}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white
          w-full py-3 rounded font-semibold text-sm disabled:bg-gray-500"
        >
          Create Contract
        </button>
      </div>
    </div>
  );
}
