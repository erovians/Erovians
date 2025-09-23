import { Outlet } from "react-router-dom";
import SellerNavbar from "../common/SellerNavbar";
// import SellerSidebar from "../../common/SellerSidebar";

const SellerDashboardLayout = () => {
  return (
    <div className="seller-dashboard">
      {/* Common Navbar or Sidebar */}
      <SellerNavbar />
      <div className="seller-content flex">
        {/* <SellerSidebar /> */}
        <div className="main-content flex-1">
          <Outlet /> {/* Render nested seller pages here */}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardLayout;
