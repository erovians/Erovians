import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    contractId: "",
    order: "",
    client: "",
    created: "",
  });

  // Fetch all contracts
  const fetchContracts = async () => {
    const res = await axios.get("http://localhost:9000/api/contracts");
    setContracts(res.data);
  };

  // Fetch pending orders
  const fetchOrders = async () => {
    const res = await axios.get(
      "http://localhost:9000/api/orders/status/pending"
    );
    setOrders(res.data.orders);
  };

  useEffect(() => {
    fetchContracts();
    fetchOrders();
  }, []);

  const handleSubmit = async () => {
    if (!form.order) return alert("Please select an order");
    await axios.post("http://localhost:9000/api/contracts/add", form);
    fetchContracts();
    setForm({ contractId: "", order: "", client: "", created: "" });
    setOpenModal(false);
  };

  return (
    <div className="w-full text-white rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Contracts (from Orders)</h2>

        <button
          onClick={() => setOpenModal(true)}
          className="px-6 py-2 rounded-lg bg-navyblue text-white font-semibold text-sm"
        >
          + Contract
        </button>
      </div>

      {/* Modal Popup */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#11141F] p-6 rounded-xl w-[650px] border border-white/10">
            <h3 className="text-lg font-semibold mb-4">
              Create Contract — Select Order
            </h3>

            {/* Order Selection */}
            <div className="max-h-60 overflow-y-auto space-y-2">
              {orders.length > 0 ? (
                orders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() =>
                      setForm({
                        contractId: `CT-${Math.floor(
                          1000 + Math.random() * 9000
                        )}`,
                        order: o._id,
                        client: o.userId?.name,
                        created: new Date().toISOString().slice(0, 10),
                      })
                    }
                    className={`cursor-pointer p-3 rounded border ${
                      form.order === o._id ? "bg-blue-900" : "bg-[#1A1E2C]"
                    } hover:bg-[#242c40] transition`}
                  >
                    <div className="flex justify-between">
                      <p className="font-semibold">
                        {o.productId?.productName}
                      </p>
                      <p className="text-sm text-gray-300">Order ID: {o._id}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Buyer: {o.userId?.name} • Qty: {o.quantity} • ₹
                      {o.totalPrice}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  No pending orders available
                </p>
              )}
            </div>

            {/* Selected Preview */}
            {form.order && (
              <div className="mt-4 bg-[#1A1E2C] p-4 rounded-lg border border-white/10">
                <p className="text-sm mb-2 text-gray-300">Contract Preview:</p>
                <p className="text-sm">Contract ID: {form.contractId}</p>
                <p className="text-sm">Order: {form.order}</p>
                <p className="text-sm">Client: {form.client}</p>
                <p className="text-sm">Created: {form.created}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                className="px-4 py-2 border border-white/20 rounded hover:bg-white/10"
                onClick={() => {
                  setForm({});
                  setOpenModal(false);
                }}
              >
                Cancel
              </button>
              <button
                disabled={!form.order}
                onClick={handleSubmit}
                className="px-5 py-2 rounded bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600"
              >
                Save Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contracts Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead className="text-gray-300 text-sm">
            <tr>
              <th className="pb-2">Contract ID</th>
              <th className="pb-2">Order</th>
              <th className="pb-2">Client</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Created</th>
              <th className="pb-2">PDF</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr
                key={c._id}
                className="border border-white/10 rounded-lg bg-gray-200 text-black"
              >
                <td className="px-4 py-4">{c.contractId}</td>
                <td className="px-4 py-4">{c.order}</td>
                <td className="px-4 py-4">{c.client}</td>
                <td className="px-4 py-4">
                  <span className="bg-green-700 text-white text-xs px-3 py-1 rounded-full">
                    Active
                  </span>
                </td>
                <td className="px-4 py-4">{c.created}</td>
                <td className="px-4 py-4">
                  <button className="px-4 py-1 rounded-lg text-white bg-navyblue border border-white/10 text-sm">
                    Generate PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
