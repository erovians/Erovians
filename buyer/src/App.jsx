import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Companies from "./pages/Companies";
import Profile from "./pages/Profile";
import CompanyProduct from "./pages/CompanyProduct";
import { loadUser } from "./lib/redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import ProductDetail from "./pages/ProductDetail";
import Setting from "./pages/Setting";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import HowToPay from "./pages/HowToPay";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Companies />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/company/:companyId" element={<CompanyProduct />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/how-to-pay" element={<HowToPay />} />
      </Routes>
    </>
  );
};

export default App;
