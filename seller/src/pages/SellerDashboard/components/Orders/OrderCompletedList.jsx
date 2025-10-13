import React, { useState } from "react";
import { CheckCircle, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const orders = [
  {
    id: "ORD2001",
    customer: "Michael Stone",
    date: "2025-09-15",
    total: "$1,200.00",
    product: {
      name: "Italian Marble Slab",
      image:
        "https://5.imimg.com/data5/AD/ZK/CV/SELLER-2497267/best-quality-italian-marble-in-new-delhi-500x500.jpg",
      description:
        "Premium Italian marble slab, perfect for countertops and flooring.",
      productId: "marble-101",
    },
  },
  {
    id: "ORD2002",
    customer: "Sarah Granite",
    date: "2025-09-20",
    total: "$950.00",
    product: {
      name: "Black Granite Tile",
      image:
        "https://server.orientbell.com/media/catalog/product/o/c/ocg_spider_black_granite_f1.jpg",
      description:
        "Durable and elegant black granite tiles for indoor and outdoor use.",
      productId: "granite-102",
    },
  },
  {
    id: "ORD2003",
    customer: "Daniel Marble",
    date: "2025-09-25",
    total: "$1,500.00",
    product: {
      name: "White Marble Countertop",
      image:
        "https://www.thespruce.com/thmb/-sVl669m0d_t0dna0ETqSmN5mlg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/marble-kitchen-countertops-4175909-hero-89f33ebac5ca49ae9492d7f949e6dafd.jpg",
      description:
        "Sleek white marble countertop with polished finish for kitchens.",
      productId: "marble-103",
    },
  },
  {
    id: "ORD2001",
    customer: "Michael Stone",
    date: "2025-09-15",
    total: "$1,200.00",
    product: {
      name: "Italian Marble Slab",
      image:
        "https://5.imimg.com/data5/AD/ZK/CV/SELLER-2497267/best-quality-italian-marble-in-new-delhi-500x500.jpg",
      description:
        "Premium Italian marble slab, perfect for countertops and flooring.",
      productId: "marble-101",
    },
  },
  {
    id: "ORD2002",
    customer: "Sarah Granite",
    date: "2025-09-20",
    total: "$950.00",
    product: {
      name: "Black Granite Tile",
      image:
        "https://server.orientbell.com/media/catalog/product/o/c/ocg_spider_black_granite_f1.jpg",
      description:
        "Durable and elegant black granite tiles for indoor and outdoor use.",
      productId: "granite-102",
    },
  },
  {
    id: "ORD2003",
    customer: "Daniel Marble",
    date: "2025-09-25",
    total: "$1,500.00",
    product: {
      name: "White Marble Countertop",
      image:
        "https://www.thespruce.com/thmb/-sVl669m0d_t0dna0ETqSmN5mlg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/marble-kitchen-countertops-4175909-hero-89f33ebac5ca49ae9492d7f949e6dafd.jpg",
      description:
        "Sleek white marble countertop with polished finish for kitchens.",
      productId: "marble-103",
    },
  },
];

const OrderCompletedList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const filteredOrders = orders.filter((order) =>
    order.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-[85vh] p-5 flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-500" />
          Completed Orders
        </h2>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-700"
          />
        </div>
      </div>

      {/* Scrollable Order List */}
      <div className="overflow-y-auto flex-1 hide-scrollbar flex flex-col gap-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 sm:px-6 sm:py-5 hover:bg-blue-50 transition gap-4 sm:gap-0 bg-white rounded-lg shadow"
            >
              {/* Left: Product Image */}
              <img
                src={order.product.image}
                alt={order.product.name}
                className="w-full sm:w-20 h-40 sm:h-20 object-cover rounded-md shadow-sm border"
              />

              {/* Center: Order + Product Details */}
              <div className="flex-1 px-0 sm:px-6">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-600 font-semibold">
                    Completed
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

              {/* Right: Total & Button */}
              <div className="text-left sm:text-right space-y-2 mt-2 sm:mt-0">
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
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No matching products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCompletedList;
