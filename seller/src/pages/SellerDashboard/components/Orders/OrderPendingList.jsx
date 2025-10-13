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
        "https://images.unsplash.com/photo-1582582425176-9f77dadb9054?auto=format&fit=crop&w=500&q=80",
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
        "https://images.unsplash.com/photo-1633417667933-7a8fa9c12641?auto=format&fit=crop&w=500&q=80",
      description: "High-polish black granite, great for countertops and flooring.",
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
        "https://images.unsplash.com/photo-1618220179428-b6b8756c7d5e?auto=format&fit=crop&w=500&q=80",
      description: "Naturally weathered travertine tiles ideal for interior walls.",
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
        "https://images.unsplash.com/photo-1588854337114-1ffcf47267d2?auto=format&fit=crop&w=500&q=80",
      description: "Classic white marble slab with a smooth finish for luxurious designs.",
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
        "https://images.unsplash.com/photo-1603200411044-9eeab9bb07ae?auto=format&fit=crop&w=500&q=80",
      description: "Dark slate wall panels with a rugged texture for modern interiors.",
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
        "https://images.unsplash.com/photo-1616436726182-5c57b1ce5826?auto=format&fit=crop&w=500&q=80",
      description: "Creamy limestone block ideal for sculpting and outdoor facades.",
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-10 flex-shrink-0">
        <span className="flex gap-3 items-center">
          <Clock className="h-8 w-8 text-orange-500" />
          Pending Orders
        </span>
      </h2>

      {/* Scrollable area */}
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200 overflow-y-auto flex-1 hide-scrollbar">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between px-6 py-5 hover:bg-yellow-50 transition"
          >
            {/* Left: Product Image */}
            <img
              src={order.product.image}
              alt={order.product.name}
              className="w-20 h-20 object-cover rounded-md shadow-sm border"
            />

            {/* Center: Order + Product Details */}
            <div className="flex-1 px-6">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-sm text-orange-600 font-semibold">
                  Pending
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {order.product.name}
              </h3>
              <p className="text-sm text-gray-500">{order.product.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-700">Customer:</span>{" "}
                {order.customer}
                <span className="ml-4 font-medium text-gray-700">
                  Order ID:
                </span>{" "}
                {order.id}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Date:</span>{" "}
                {order.date}
              </p>
            </div>

            {/* Right: Total & Button */}
            <div className="text-right space-y-2">
              <div className="text-md font-semibold text-gray-800">
                {order.total}
              </div>
              <button
                onClick={() => handleViewDetails(order.product.productId)}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium"
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
