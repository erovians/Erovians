import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompany } from "@/redux/slice/companySlice";
import { Package, Dot } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SellerProfile = () => {
  const dispatch = useDispatch();
  const { company, loading, error } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(getCompany());
  }, [dispatch]);

  if (loading) return <p>Loading company data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!company) return null;

  const totalProducts = company?.products?.length || 0;
  const activeProducts =
    company?.products?.filter((p) => p.status === "active").length || 0;
  const inactiveProducts = totalProducts - activeProducts;

  const companyInfo = {
    companyName: company?.companyBasicInfo?.companyName || "Unnamed Company",
    companyDetails:
      company?.companyBasicInfo || "Business Details Unavailable",
    sellerName: company?.companyIntro?.contactPersonName || "Seller",
    yearsActive: company?.companyBasicInfo?.companyRegistrationYear
      ? `${
          new Date().getFullYear() -
          company.companyBasicInfo.companyRegistrationYear
        } Years`
      : "N/A",
  };

  return (
    <div className="p-6 mb-6 h-full">
      {/* Header: Seller + Company */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-200 flex items-center justify-center mr-7 ">
            <Link to="#" className="text-gray-600 hover:text-blue-500">
              <Avatar className="rounded-sm w-17 h-17">
                <AvatarImage src={company?.companyIntro?.logo} />
                <AvatarFallback>
                  {companyInfo.companyName?.slice(0, 3)}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
          <div>
            <div className="flex justify-between flex-col sm:flex-row">
              <h4 className="font-bold text-base sm:text-xl text-gray-800">
                {companyInfo.companyName}.
              </h3>
              <Link to="#" className="text-blue-600 text-xs m-auto ml-5 hover:underline">
                View details
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              {companyInfo.companyDetails.locationOfRegistration}
            </p>
            <p className="text-xs text-gray-400">
              Legal Owner - {companyInfo.companyDetails.legalowner}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Package size={18} className="text-green-500" /> Total Products
          </p>
          <p className="text-gray-800">{totalProducts}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Dot size={18} strokeWidth={10} className="text-green-500" />
            Active Products
          </p>
          <p className="text-green-600">{activeProducts}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Dot size={18} strokeWidth={10} className="text-red-500" />
            Inactive Products
          </p>
          <p className="text-red-500">{inactiveProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
