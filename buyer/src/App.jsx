import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Companies from "./pages/Companies";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company" element={<Companies />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </>
  );
};

export default App;
