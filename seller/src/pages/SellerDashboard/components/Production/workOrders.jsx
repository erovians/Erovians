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
    <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-6 w-full shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-3 sm:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900">
          Work Orders
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs xs:text-sm font-medium text-white bg-navyblue cursor-pointer hover:opacity-90 transition"
        >
          + WO
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="w-full">
        {/* Table Header */}
        <div className="grid grid-cols-5 xs:grid-cols-[1fr_1fr_1fr_auto_1fr] sm:grid-cols-5 gap-1 text-gray-500 text-[10px] xs:text-xs sm:text-sm px-1 pb-2 sm:pb-3 border-b border-gray-200">
          <div>WO</div>
          <div>Order</div>
          <div>Machine</div>
          <div>Status</div>
          <div>Due</div>
        </div>

        {/* Work Orders List */}
        {loading ? (
          <p className="text-gray-500 mt-3 sm:mt-4 text-xs sm:text-sm">
            Loading...
          </p>
        ) : workOrders.length === 0 ? (
          <p className="text-gray-500 mt-3 sm:mt-4 text-xs sm:text-sm">
            No work orders found.
          </p>
        ) : (
          workOrders.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-5 xs:grid-cols-[1fr_1fr_1fr_auto_1fr] sm:grid-cols-5 gap-1 w-full items-center px-1 py-2 sm:px-2 sm:py-3 text-gray-800 border-b border-gray-200 last:border-none"
            >
              <div className="text-[10px] xs:text-xs sm:text-sm break-words whitespace-normal leading-tight">
                {item.wo_number}
              </div>

              <div className="text-[10px] xs:text-xs sm:text-sm break-words whitespace-normal leading-tight">
                {item.so_number.slice(-10)}
              </div>

              <div className="text-[10px] xs:text-xs sm:text-sm break-words whitespace-normal leading-tight">
                {item.machine}
              </div>

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
                  className={`px-1.5 xs:px-2 sm:px-3 py-[1px] xs:py-[2px] text-[8px] xs:text-[9px] sm:text-xs whitespace-normal font-medium rounded-full cursor-pointer
              ${
                item.status === "Completed"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : item.status === "Running"
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}
                >
                  {item.status}
                </span>

                {item.showStatusMenu && (
                  <div className="absolute mt-1 bg-white shadow-md border rounded-md z-10 w-20 xs:w-24 sm:w-32">
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
                        className="px-2 sm:px-3 py-1 text-[9px] xs:text-xs sm:text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-[10px] xs:text-xs sm:text-sm text-gray-600 break-words whitespace-normal leading-tight">
                {item.due_date ? item.due_date.slice(0, 10) : ""}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center px-3 xs:px-4 sm:px-6 animate-fadeIn">
          <div className="bg-white p-4 xs:p-5 sm:p-6 rounded-xl w-full max-w-[300px] xs:max-w-xs sm:max-w-sm md:max-w-md border border-gray-300 shadow-2xl">
            <h3 className="text-gray-900 text-base xs:text-lg sm:text-xl font-semibold mb-3 xs:mb-4 sm:mb-5 text-center">
              Create Work Order
            </h3>

            <div className="space-y-3 xs:space-y-4">
              {/* Select Order */}
              <div className="flex flex-col">
                <label className="text-gray-700 text-[10px] xs:text-xs sm:text-sm mb-1 font-medium">
                  Select Order
                </label>
                <select
                  className={`w-full bg-white text-gray-900 px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg border ${
                    error && !form.so_number
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-navyblue outline-none text-[10px] xs:text-xs sm:text-sm`}
                  onChange={(e) => {
                    const selected = pendingOrders.find(
                      (o) => o._id === e.target.value
                    );
                    setForm({ ...form, so_number: selected?._id || "" });
                  }}
                >
                  <option value="">-- Select Pending Order --</option>
                  {pendingOrders.map((order) => (
                    <option key={order._id} value={order._id}>
                      {order.productId.productName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Machine */}
              <div className="flex flex-col">
                <label className="text-gray-700 text-[10px] xs:text-xs sm:text-sm mb-1 font-medium">
                  Machine
                </label>
                <input
                  type="text"
                  placeholder="Enter machine name"
                  className={`w-full bg-white text-gray-900 px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg border ${
                    error && !form.machine
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-navyblue outline-none text-[10px] xs:text-xs sm:text-sm`}
                  onChange={(e) =>
                    setForm({ ...form, machine: e.target.value })
                  }
                />
              </div>

              {/* Due Date */}
              <div className="flex flex-col">
                <label className="text-gray-700 text-[10px] xs:text-xs sm:text-sm mb-1 font-medium">
                  Due Date
                </label>
                <input
                  type="date"
                  className={`w-full bg-white text-gray-900 px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg border ${
                    error && !form.due_date
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-navyblue outline-none text-[10px] xs:text-xs sm:text-sm`}
                  onChange={(e) =>
                    setForm({ ...form, due_date: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 xs:gap-3 mt-4 xs:mt-5 sm:mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-800 text-[10px] xs:text-xs sm:text-sm rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="px-3 py-1.5 bg-navyblue border border-navyblue text-white text-[10px] xs:text-xs sm:text-sm rounded-lg hover:bg-white hover:text-navyblue transition shadow-sm cursor-pointer"
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
