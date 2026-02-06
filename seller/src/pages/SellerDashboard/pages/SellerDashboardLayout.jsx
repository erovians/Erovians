import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SellerNavbar from "../common/SellerNavbar";
import SellerSidebar from "../common/SellerSidebar";
import { loadSeller } from "../../../redux/slice/sellerSlice";

const SellerDashboardLayout = () => {
  const sidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadSeller());
  }, [dispatch]);

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
