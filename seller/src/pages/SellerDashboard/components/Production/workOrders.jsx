import React, { useEffect, useState } from "react";
import api from "@/utils/axios.utils";

export default function WorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    so_number: "",
    machine: "",
    due_date: "",
    status: "Planned",
  });

  // Fetch work orders
  const fetchWorkOrders = async () => {
    try {
      const res = await api.get("/workorder");
      setWorkOrders(res.data.workOrders || []);
    } catch (error) {
      console.error("FETCH_ERROR:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  // Fetch pending orders
  useEffect(() => {
    fetchWorkOrders();

    const fetchPendingOrders = async () => {
      try {
        const res = await api.get("/orders/status/pending");
        setPendingOrders(res.data.orders || []);
      } catch (err) {
        console.error("ORDER_FETCH_ERROR:", err);
      }
    };

    fetchPendingOrders();
  }, []);

  // Create new WO
  const handleCreate = async () => {
    // Reset error first
    setError("");

    // Basic validation
    if (!form.so_number) {
      return setError("Please select a order.");
    }
    if (!form.machine.trim()) {
      return setError("Machine field cannot be empty.");
    }
    if (!form.due_date) {
      return setError("Please select a due date.");
    }

    try {
      await api.post("/workorder/add", form);
      setOpen(false);
      fetchWorkOrders();
    } catch (err) {
      console.error("CREATE_ERROR:", err);
      alert("Failed to create work order");
    }
  };

  // Update status inline
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/workorder/${id}`, { status: newStatus });
      fetchWorkOrders();
    } catch (err) {
      console.error("STATUS_UPDATE_ERROR:", err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Work Orders</h2>

        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2 rounded-full text-sm font-medium text-white 
          bg-navyblue cursor-pointer hover:opacity-90 transition"
        >
          + WO
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 text-gray-500 text-sm px-2 pb-3 border-b border-gray-200">
        <div>WO</div>
        <div>Order</div>
        <div>Machine</div>
        <div>Status</div>
        <div>Due</div>
      </div>

      {/* Work Orders List */}
      {loading ? (
        <p className="text-gray-500 mt-4">Loading...</p>
      ) : workOrders.length === 0 ? (
        <p className="text-gray-500 mt-4">No work orders found.</p>
      ) : (
        workOrders.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-5 items-center px-2 py-4 text-gray-800 border-b border-gray-200 last:border-none"
          >
            <div>{item.wo_number}</div>
            <div>{item.so_number.slice(-10)}</div>
            <div>{item.machine}</div>

            {/* Status Badge + Dropdown */}
            <div className="relative">
              <span
                onClick={() =>
                  setWorkOrders((prev) =>
                    prev.map((wo) =>
                      wo._id === item._id
                        ? { ...wo, showStatusMenu: !wo.showStatusMenu }
                        : wo
                    )
                  )
                }
                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer
      ${
        item.status === "Completed"
          ? "bg-green-100 text-green-700 border border-green-300"
          : item.status === "Running"
          ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
          : "bg-gray-100 text-gray-700 border border-gray-300"
      }
    `}
              >
                {item.status}
              </span>

              {/* Dropdown (only visible when clicked) */}
              {item.showStatusMenu && (
                <div className="absolute mt-1 bg-white shadow-md border rounded-md z-10 w-32">
                  {["Planned", "Running", "Completed"].map((s) => (
                    <div
                      key={s}
                      onClick={() => {
                        handleStatusUpdate(item._id, s);
                        setWorkOrders((prev) =>
                          prev.map((wo) =>
                            wo._id === item._id
                              ? { ...wo, showStatusMenu: false }
                              : wo
                          )
                        );
                      }}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-gray-600">
              {item.due_date ? item.due_date.slice(0, 10) : ""}
            </div>
          </div>
        ))
      )}

      {open && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px] border border-gray-300 shadow-lg">
            <h3 className="text-gray-900 text-lg font-semibold mb-4">
              Create Work Order
            </h3>

            <div className="space-y-3">
              {/* Select Pending Order */}
              <select
                className="w-full bg-white text-gray-900 px-3 py-2 rounded-md border border-gray-300"
                onChange={(e) => {
                  const selected = pendingOrders.find(
                    (o) => o._id === e.target.value
                  );
                  setForm({
                    ...form,
                    so_number: selected?._id || "",
                  });
                }}
              >
                <option value="">-- Select Pending Order --</option>
                {pendingOrders.map((order) => (
                  <option key={order._id} value={order._id}>
                    {order.productId.productName}
                  </option>
                ))}
              </select>

              {/* Machine */}
              <input
                type="text"
                placeholder="Machine"
                className="w-full bg-white text-gray-900 px-3 py-2 rounded-md border border-gray-300"
                onChange={(e) => setForm({ ...form, machine: e.target.value })}
              />

              {/* Due date */}
              <input
                type="date"
                className="w-full bg-white text-gray-900 px-3 py-2 rounded-md border border-gray-300"
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />

              {/* Validation Error */}
              {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between mt-5">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
