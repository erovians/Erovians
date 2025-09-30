import React from "react";
import SellerProfile from "../components/Home/SellerProfile";
import SellerChart from "../components/Home/SellerChart";
import SellerPieChart from "../components/Home/SellerPieChart";

const SellerDashboardHome = () => {
  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-screen bg-gray-50">
      {/* Left Section (Main Chart) */}
      <div className="flex-1 p-4 lg:p-6">
        <div className="bg-white p-3 lg:p-5 rounded shadow h-[350px] sm:h-[400px] md:h-[500px] lg:h-[86%] flex flex-col">
          <SellerChart />
        </div>
      </div>

      {/* Right Section (Profile + Pie chart) */}
      <div className="w-full lg:w-[35%] p-4 lg:p-6 flex flex-col gap-6">
        {/* Profile Card */}
        <div className="bg-white shadow p-4 rounded-md">
          <SellerProfile />
        </div>

        {/* Pie chart Card */}
        <div className="shadow rounded-md bg-white h-[350px] sm:h-[400px] lg:h-[45%] flex flex-col">
          <h3 className="text-center mt-4 font-semibold text-base sm:text-lg text-gray-800">
            Top Selling Products
          </h3>
          <div className="flex-1 mt-2">
            <SellerPieChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardHome;
