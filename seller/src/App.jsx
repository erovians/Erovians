import "./App.css";
import Navbar from "./common/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "@/common/Footer";
import Register from "./pages/Auth/Register";
import FandQ from "./pages/Learn";
import Learn from "./pages/Learn";
import SellOnline from "./pages/SellOnline";
import Grow from "./pages/Grow";
import Login from "./pages/Login";
import SellerSignUp from "./pages/SellerSignUp";

function App() {
  const location = useLocation();

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ["/start-selling"];
  const hideFooterRoutes = ["/login", "/start-selling"];

  return (
    <>
      {/* Render Navbar only if current path is not in hideNavbarRoutes */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/sell-online" element={<SellOnline />} />
        <Route path="/grow" element={<Grow />} />
        <Route path="/login" element={<Login />} />
        <Route path="/start-selling" element={<SellerSignUp />} />
      </Routes>

      {/* Same logic can be applied to Footer if you want */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
