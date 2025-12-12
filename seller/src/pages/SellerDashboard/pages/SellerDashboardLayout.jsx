import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import SellerNavbar from "../common/SellerNavbar";
import SellerSidebar from "../common/SellerSidebar";

const SellerDashboardLayout = () => {
  const sidebarOpen = useSelector((state) => state.sidebar.isOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      <SellerSidebar />

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-40">
          <SellerNavbar />
        </div>
        <main className={`flex-1 sm:p-4 transition-all duration-300`}>
          {" "}
          {/* overflow-auto removed from the outlet , creating issues in the company profile component specifically*/}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerDashboardLayout;
