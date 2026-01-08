// import React from "react";
// import SellerProfile from "../components/Home/SellerProfile";
// import SellerChart from "../components/Home/SellerChart";
// import SellerPieChart from "../components/Home/SellerPieChart";

// const SellerDashboardHome = () => {
//   return (
//     <div className="flex flex-col lg:flex-row h-auto lg:h-[85vh] bg-gray-50">
//       {/* Left Section (Main Chart) */}
//       <div className="flex-1 p-4 lg:p-6">
//         <div className="bg-white p-3 lg:p-5 rounded shadow h-[350px] sm:h-[400px] md:h-[500px] lg:h-[100%] flex flex-col">
//           <SellerChart />
//         </div>
//       </div>

//       {/* Right Section (Profile + Pie chart) */}
//       <div className="w-full lg:w-[35%] p-4 lg:p-6 flex flex-col gap-6">
//         <div className="bg-white shadow p-4 rounded-md">
//           <SellerProfile />
//         </div>

//         {/* Pie chart Card */}
//         <div className="shadow rounded-md bg-white h-[350px] sm:h-[400px] lg:h-[80%] flex flex-col">
//           <h4 className="text-center mt-4 font-semibold text-base sm:text-xl text-gray-800">
//             Top Selling Products
//           </h4>
//           <div className="flex-1 mt-2 ">
//             <SellerPieChart />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SellerDashboardHome;

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
      h-[380px] sm:h-[430px] md:h-[480px]
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
