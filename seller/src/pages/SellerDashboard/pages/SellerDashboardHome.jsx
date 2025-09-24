import React from "react";
import SellerProfile from "../components/Home/SellerProfile";
import SellerChart from "../components/Home/SellerChart";
import SuccessStories from "../common/SellerBanner";
import SellerPieChart from "../components/Home/SellerPieChart";

const SellerDashboardHome = () => {
  return (
    <div className="flex h-screen ">
      {/* Left Section (Chart) */}
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded-2xl shadow h-[65%] flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
          <div className="flex-1">
            <SellerChart />
          </div>
        </div>
      </div>

      {/* Right Section (Profile + Banner) */}
      <div className="w-[35%]  p-6 flex flex-col gap-6">
        {/* Profile Card */}
        <div className="bg-white  p-6 rounded-sm">
          <SellerProfile />
        </div>

        {/* Banner Card */}
        <div className="  border rounded-sm bg-white h-[40%]">
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
