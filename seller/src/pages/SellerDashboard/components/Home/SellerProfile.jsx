import React from "react";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SellerProfile = () => {
  // Example data (this can later come from props or API)
  const sellerData = {
    sellerName: "Sandeep Nautiyal",
    companyName: "Erovians Pvt Ltd.",
    companyDetails: "Marble & Granite Supplier - Dehradun, India",
    yearsActive: "5 Year",
    totalProducts: 25,
    activeProducts: 18,
    inactiveProducts: 7,
  };

  return (
    <div className="p-6 mb-6 h-full">
      {/* Header: Seller + Company */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-200 flex items-center justify-center mr-3">
            <Link to="#" className="text-gray-600 hover:text-blue-500">
              <Avatar className="rounded-sm w-10 h-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>Ero</AvatarFallback>
              </Avatar>
            </Link>
          </div>
          <div>
            <div className="flex justify-between">
              <h3 className="font-bold text-lg text-gray-800">
                {sellerData.companyName}
              </h3>
              <Link className="text-blue-600 text-xs">View details</Link>
            </div>
            <p className="text-sm text-gray-500">{sellerData.companyDetails}</p>
            <p className="text-xs text-gray-400">
              Active since {sellerData.yearsActive}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Package size={18} className="text-green-600" /> Total Products
          </p>
          <p className=" text-gray-800">{sellerData.totalProducts}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Active Products</p>
          <p className=" text-green-600">{sellerData.activeProducts}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Inactive Products</p>
          <p className=" text-red-500">{sellerData.inactiveProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
