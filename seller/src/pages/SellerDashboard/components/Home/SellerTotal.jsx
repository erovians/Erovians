import React, { useEffect, useState } from "react";
import SellerProfile from "./SellerProfile";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axios.utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setcompletedOrders] = useState(0);
  const [totalamount, setTotalamount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/sellerorders/all/orders");
        const data = res.data.orders;
        setOrders(data);

        setPendingOrders(data.filter((o) => o.status === "pending").length);
        setcompletedOrders(data.filter((o) => o.status === "delivered").length);

        const now = new Date();
        const firstDayThisMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );
        const lastDayThisMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        );

        const thisMonthOrders = data.filter((o) => {
          const orderDate = new Date(o.createdAt);
          return (
            orderDate >= firstDayThisMonth && orderDate <= lastDayThisMonth
          );
        });

        const thisMonthRevenue = thisMonthOrders.reduce(
          (sum, order) => sum + (Number(order.totalPrice) || 0),
          0
        );

        setTotalamount(thisMonthRevenue);
      } catch (error) {
        console.error("Error fetching seller orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const statusColors = {
    Confirmed: "bg-green-100 text-green-700 border border-green-300",
    Preparing: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    Quoting: "bg-gray-200 text-gray-700 border border-gray-400",
  };

  return (
    <div className="text-gray-700 p-6 h-full flex flex-col gap-5 bg-white rounded-xl">
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[22%]">
        <Card
          title="REVENUE (CURRENT MONTH)"
          value={`₹ ${totalamount.toLocaleString("en-IN")}`}
        />
        <Card title="MARGIN (MONTH)" value="28.4%" />
        <Card title="PENDING ORDERS" value={pendingOrders} button="Follow-up" />
        <Card
          title="Completed ORDERS"
          value={completedOrders}
          button="Action needed"
          red
        />
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[78%]">
        {/* ORDERS */}
        <div className="bg-white rounded-xl border border-gray-300 p-6 flex flex-col shadow-sm hover:shadow-md transition-all h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold tracking-wide text-gray-800">
              Recent Orders
            </h2>
            <button
              onClick={() => navigate("/sellerdashboard/orders/pending")}
              className="px-4 py-1 rounded-lg bg-navyblue border border-navyblue text-white hover:bg-white hover:text-navyblue duration-200 text-sm shadow cursor-pointer"
            >
              All Orders
            </button>
          </div>

          {/* TABLE */}
          <div className="flex-1 overflow-y-auto pr-1">
            <table className="w-full text-sm">
              <thead className="text-gray-600 border-b border-gray-300 bg-white sticky top-0 font-semibold">
                <tr>
                  <th className="py-2 text-left">#</th>
                  <th className="text-left">Client</th>
                  <th className="text-left">Project</th>
                  <th className="text-left">Status</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 10).map(
                    (
                      o // show recent 10 only
                    ) => (
                      <tr
                        key={o._id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition"
                      >
                        <td className="py-3">{o.orderId || o._id.slice(-5)}</td>
                        <td>{o?.userId?.name || "sandeep"}</td>
                        <td>{o?.productId?.productName || "—"}</td>
                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                              statusColors[o.status]
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="text-right">₹ {o.totalPrice}</td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PROFILE */}
        <div className="bg-white rounded-xl border border-gray-300 p-6 flex flex-col shadow-sm hover:shadow-md transition-all h-full">
          <SellerProfile />
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, button, red }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
      <p className="text-xs text-gray-500 tracking-wide">{title}</p>
      <h2 className="text-3xl font-semibold mt-2 text-gray-800 tracking-wide">
        {value}
      </h2>
      {button && (
        <button
          className={`mt-3 px-3 py-1 rounded-lg text-xs font-medium ${
            red
              ? "bg-green-100 text-green-600 border border-green-300"
              : "bg-yellow-100 text-yellow-600 border border-yellow-300"
          }`}
        >
          {button}
        </button>
      )}
    </div>
  );
}
