import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import SellerNavbar from "../common/SellerNavbar";
import SellerSidebar from "../common/SellerSidebar";
import SellerProfile from "../components/Home/SellerProfile";
import SellerDashboardHome from "./SellerDashboardHome";

const SellerDashboardLayout = () => {
  const sidebarOpen = useSelector((state) => state.sidebar.isOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      <SellerSidebar />

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-40">
          <SellerNavbar />
        </div>
        <main
          className={`flex-1 overflow-auto p-4 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerDashboardLayout;
