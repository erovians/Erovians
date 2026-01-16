import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Companies from "./pages/Companies";
import Profile from "./pages/Profile";
import CompanyProduct from "./pages/CompanyProduct";
import { loadUser } from "./lib/redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import ProductDetail from "./pages/ProductDetail";

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
      </Routes>
    </>
  );
};

export default App;
