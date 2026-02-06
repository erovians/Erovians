import React from "react";
import Dashboard from "../components/Home/SellerTotal";
import SellerProfile from "../components/Home/SellerCompanyProfile";
import SellerChart from "../components/Home/SellerChart";
import SellerPieChart from "../components/Home/SellerPieChart";

const SellerDashboardHome = () => {
  return (
    <div className="p-4 sm:p-5 md:p-6 bg-gray-50 min-h-screen flex flex-col gap-6">
      {/* 🔹 TOP DASHBOARD SECTION — full width */}
      <div className="bg-white rounded shadow p-4 sm:p-5 md:p-6">
        <Dashboard />
      </div>

      {/* 🔻 RESPONSIVE ROW OF CARDS */}
      <div
        className="
    grid gap-6
    grid-cols-1
    md:grid-cols-3  /* 2 cards: chart = 2 parts, pie chart = 1 part */
  "
      >
        {/* Seller Chart — take 2 columns */}
        <div
          className="
      bg-white rounded shadow
      p-4 sm:p-5 md:p-6
      h-95 sm:h-[430px] md:h-[480px]
      flex flex-col hover:-translate-y-1 transition
      md:col-span-2  /* ⭐ gives chart more width */
    "
        >
          <SellerChart />
        </div>

        {/* Pie Chart — take 1 column */}
        <div
          className="
      bg-white rounded shadow
      p-4 sm:p-5 md:p-6
      h-[380px] sm:h-[430px] md:h-[480px]
      flex flex-col hover:-translate-y-1 transition
    "
        >
          <h4 className="text-center font-semibold text-gray-800 mb-2">
            Top Selling Products
          </h4>
          <div className="flex-1">
            <SellerPieChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardHome;
