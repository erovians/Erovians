import React, { useState, useEffect } from "react";
import api from "@/utils/axios.utils";
import { useNavigate } from "react-router-dom";

export default function CreateContract() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("Active");
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
      status,
    };

    await api.post("/contracts/add", payload);
    alert("Contract created successfully");
    navigate("/sellerdashboard/contracts");
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold mb-6">Create Contract</h2>

      {/* Order Selection */}
      <label className="font-semibold block mb-2">Select Pending Order</label>
      <select
        className="w-full p-3 rounded bg-navyblue border border-white/20 mb-5"
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
        <div className="bg-gray-800 p-4 rounded mb-5">
          <p>
            <b>Order ID:</b> {selectedOrder._id}
          </p>
          <p>
            <b>Client:</b> {selectedOrder.userId.name}
          </p>
        </div>
      )}

      {/* Status Dropdown */}
      <label className="font-semibold block mb-2">Status</label>
      <select
        className="w-full p-3 rounded bg-navyblue border border-white/20"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>Active</option>
        <option>Completed</option>
        <option>Inactive</option>
      </select>

      <button
        disabled={!selectedOrder}
        onClick={handleCreate}
        className="mt-6 bg-blue-600 text-white px-8 py-3 rounded font-semibold disabled:bg-gray-500"
      >
        Create Contract
      </button>
    </div>
  );
}
