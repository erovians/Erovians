import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Companies from "./pages/Companies";
import Profile from "./pages/Profile";
import CompanyProduct from "./pages/CompanyProduct";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Companies />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/company/:productId" element={<CompanyProduct />} />
      </Routes>
    </>
  );
};

export default App;
