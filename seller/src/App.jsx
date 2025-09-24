import "./App.css";
import Navbar from "./common/Navbar";
import Footer from "@/common/Footer";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Learn from "./pages/Learn";
import SellOnline from "./pages/SellOnline";
import Grow from "./pages/Grow";
import Login from "./pages/Auth/Login";
import SellerSignUp from "./pages/Auth/SellerSignUp";

import SellerDashboardLayout from "./pages/SellerDashboard/pages/SellerDashboardLayout";
import SellerDashboardHome from "./pages/SellerDashboard/pages/SellerDashboardHome";

function App() {
  const location = useLocation();

  // Public site routes where Navbar/Footer may be hidden
  const hideNavbarRoutes = ["/start-selling"];
  const hideFooterRoutes = ["/login", "/start-selling"];

  const isSellerRoute = location.pathname.startsWith("/seller");

  return (
    <>
      {/* Render public Navbar only if not on seller dashboard */}
      {!isSellerRoute && !hideNavbarRoutes.includes(location.pathname) && (
        <Navbar />
      )}

      <Routes>
        {/* Public routes */}
        {!isSellerRoute && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/sell-online" element={<SellOnline />} />
            <Route path="/grow" element={<Grow />} />
            <Route path="/login" element={<Login />} />
            <Route path="/start-selling" element={<SellerSignUp />} />
          </>
        )}

        {/* Seller dashboard routes */}
        {isSellerRoute && (
          <Route path="/sellerdashboard" element={<SellerDashboardLayout />}>
            <Route path="" element={<SellerDashboardHome />} />
          </Route>
        )}
      </Routes>

      {!isSellerRoute && !hideFooterRoutes.includes(location.pathname) && (
        <Footer />
      )}
    </>
  );
}

export default App;
