import React from "react";
import { Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const orders = [
  {
    id: "ORD5001",
    customer: "Ravi Sharma",
    date: "2025-10-01",
    total: "$780.00",
    product: {
      name: "Desert Sandstone Pavers",
      image:
        "https://images.unsplash.com/photo-1558346648-9757f2fa4474?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340",
      description: "Warm-toned sandstone pavers ideal for patios and walkways.",
      productId: "sandstone-501",
    },
  },
  {
    id: "ORD5002",
    customer: "Anjali Patel",
    date: "2025-10-03",
    total: "$940.00",
    product: {
      name: "Black Granite Slab",
      image:
        "https://images.unsplash.com/photo-1550053808-52a75a05955d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      description:
        "High-polish black granite, great for countertops and flooring.",
      productId: "granite-502",
    },
  },
  {
    id: "ORD5003",
    customer: "Kabir Verma",
    date: "2025-10-05",
    total: "$620.00",
    product: {
      name: "Rustic Travertine Tiles",
      image:
        "https://plus.unsplash.com/premium_photo-1681414728775-7aa0607c41cc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      description:
        "Naturally weathered travertine tiles ideal for interior walls.",
      productId: "travertine-503",
    },
  },
  {
    id: "ORD5004",
    customer: "Divya Mehta",
    date: "2025-10-07",
    total: "$1,100.00",
    product: {
      name: "Polished White Marble",
      image:
        "https://plus.unsplash.com/premium_photo-1701192799337-d93f93714b4e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      description:
        "Classic white marble slab with a smooth finish for luxurious designs.",
      productId: "marble-504",
    },
  },
  {
    id: "ORD5005",
    customer: "Amitabh Desai",
    date: "2025-10-09",
    total: "$860.00",
    product: {
      name: "Slate Wall Panels",
      image:
        "https://images.unsplash.com/photo-1642419105752-88cc5a001a85?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=868",
      description:
        "Dark slate wall panels with a rugged texture for modern interiors.",
      productId: "slate-505",
    },
  },
  {
    id: "ORD5006",
    customer: "Nisha Goyal",
    date: "2025-10-11",
    total: "$730.00",
    product: {
      name: "Textured Limestone Block",
      image:
        "https://images.unsplash.com/photo-1599600540907-62e9b06e6597?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340",
      description:
        "Creamy limestone block ideal for sculpting and outdoor facades.",
      productId: "limestone-506",
    },
  },
];

const OrderPendingList = () => {
  const navigate = useNavigate();

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="w-full h-[85vh] p-5 flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex-shrink-0">
        <span className="flex gap-3 items-center">
          <Clock className="h-8 w-8 text-orange-500" />
          Pending Orders
        </span>
      </h2>

      {/* Scrollable area */}
      <div className="overflow-y-auto flex-1 hide-scrollbar flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 sm:px-6 sm:py-5 hover:bg-yellow-50 transition bg-white rounded-lg shadow"
          >
            {/* Product Image */}
            <img
              src={order.product.image}
              alt={order.product.name}
              className="w-full sm:w-20 h-40 sm:h-20 object-cover rounded-md shadow-sm border"
            />

            {/* Order + Product Details */}
            <div className="flex-1 px-0 sm:px-6">
              <div className="flex items-center gap-2 mb-1 mt-3 ">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-sm text-orange-600 font-semibold ">
                  Pending
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {order.product.name}
              </h3>
              <p className="text-sm text-gray-500">
                {order.product.description}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-700">Customer:</span>{" "}
                {order.customer}
                <span className="ml-0 sm:ml-4 font-medium text-gray-700">
                  Order ID:
                </span>{" "}
                {order.id}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Date:</span>{" "}
                {order.date}
              </p>
            </div>

            {/* Total & Button */}
            <div className="text-left sm:text-right space-y-2 mt-2 sm:mt-0">
              <div className="text-md font-semibold text-gray-800">
                {order.total}
              </div>
              <button
                onClick={() => handleViewDetails(order.product.productId)}
                className="inline-flex items-center gap-1 text-sm text-navyblue hover:underline font-medium"
              >
                See Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPendingList;
