import "./App.css";
import Navbar from "./common/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "@/common/Footer";
import Register from "./pages/Auth/Register";
import Learn from "./pages/Learn";
import SellOnline from "./pages/SellOnline";
import Grow from "./pages/Grow";

function App() {
  const location = useLocation();

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ["/register"];

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
      </Routes>

      {/* Same logic can be applied to Footer if you want */}
      {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
