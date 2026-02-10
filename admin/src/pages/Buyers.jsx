import React, { useState } from "react";
import { buyersData, buyerStats } from "../data/buyersData";
import BuyerTable from "../components/tables/buyerTable";

const Buyers = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredData =
    activeFilter === "all"
      ? buyersData
      : buyersData.filter((buyer) => buyer.status === activeFilter);

  // Modern stats cards with gradient backgrounds
  const stats = [
    {
      title: "Total Buyers",
      value: buyerStats.totalBuyers.toLocaleString(),
      change: "+12.5%",
      icon: (
        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        </div>
      ),
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-gradient-to-br from-purple-500/10 to-indigo-600/10",
    },
    {
      title: "Active Buyers",
      value: buyerStats.activeBuyers.toLocaleString(),
      change: "+8.2%",
      icon: (
        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      ),
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-gradient-to-br from-emerald-500/10 to-green-600/10",
    },
    {
      title: "New This Month",
      value: buyerStats.newThisMonth,
      change: "+5.3%",
      icon: (
        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
        </div>
      ),
      color: "from-sky-500 to-blue-600",
      bgColor: "bg-gradient-to-br from-sky-500/10 to-blue-600/10",
    },
    {
      title: "Avg Order Value",
      value: buyerStats.avgOrderValue,
      change: "+15.7%",
      icon: (
        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 002.353-1.253c.242-.295.343-.682.223-1.051a1 1 0 00-1.447-.933c-.382.183-.827.256-1.296.256-.99 0-1.929-.373-2.668-1.03A3.5 3.5 0 018 8c0-.99.602-1.765 1.324-2.246A4.535 4.535 0 0111 6.092V5z" clipRule="evenodd" />
          </svg>
        </div>
      ),
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-amber-500/10 to-orange-600/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header with gradient */}
        <div className="mb-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Buyer Management
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor and manage all your buyer accounts in one dashboard
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
                Add New Buyer
              </button>
            </div>
          </div>
        </div>

        {/* Modern Stats Grid with glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`${stat.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className="ml-2 text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs text-gray-500">vs last month</div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Filter Cards */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Buyer Overview</h2>
                <p className="text-gray-600 mt-1">Filter and analyze buyer data</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                  Showing {filteredData.length} of {buyersData.length} buyers
                </span>
              </div>
            </div>

            {/* Modern Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                All Buyers
              </button>
              <button
                onClick={() => setActiveFilter("Active")}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeFilter === "Active"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Active
                </span>
              </button>
              <button
                onClick={() => setActiveFilter("Pending")}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeFilter === "Pending"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Pending
                </span>
              </button>
              <button
                onClick={() => setActiveFilter("Inactive")}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeFilter === "Inactive"
                    ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm"
                }`}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Inactive
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Component */}
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <BuyerTable data={filteredData} />
        </div>

        {/* Quick Actions Bar */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-gray-600 text-sm mt-1">Perform common buyer management tasks</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <button className="px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors">
                Export Data
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                Send Notification
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buyers;