import React from "react";
import SellerProfile from "../components/Home/SellerProfile";
import SellerChart from "../components/Home/SellerChart";
import SuccessStories from "../common/SellerBanner";
import SellerPieChart from "../components/Home/SellerPieChart";

const SellerDashboardHome = () => {
  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-screen">
      {/* Left Section (Chart) */}
      <div className="flex-1 p-4 lg:p-6">
        <div className="bg-white p-2 lg:p-4 rounded shadow h-[500px] lg:h-[65%] flex flex-col">
          <div className="flex-1">
            <SellerChart />
          </div>
        </div>
      </div>

      {/* Right Section (Profile + Banner) */}
      <div className="w-full lg:w-[35%] p-4 lg:p-6 flex flex-col gap-6">
        {/* Profile Card */}
        <div className="bg-white shadow p-2 lg:p-4 rounded-sm">
          <SellerProfile />
        </div>

        {/* Banner Card */}
        <div className="shadow rounded-sm bg-white h-[400px] lg:h-[40%]">
          <h3 className="text-center mt-5 font-bold text-lg text-gray-800">
            Top Selling Products
          </h3>
          <SellerPieChart />
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardHome;
