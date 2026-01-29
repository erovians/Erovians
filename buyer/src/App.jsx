import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Auth from "./pages/Auth";
import Companies from "./pages/Companies";
import Profile from "./pages/Profile";
import CompanyProduct from "./pages/CompanyProduct";
import { loadUser, clearError, clearSuccess } from "./lib/redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import ProductDetail from "./pages/ProductDetail";
import Setting from "./pages/Setting";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import HowToPay from "./pages/HowToPay";
import TermsOfService from "./pages/TermsOfService";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import SubCategoryProductsPage from "./pages/SubCategoryProductsPage";
import RFQPage from "./pages/RFQPage";
import { Toaster } from "sonner";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Clear errors and success messages on route change
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [location.pathname, dispatch]);

  return (
    <>
      <Toaster position="top-right" richColors closeButton duration={3000} />
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
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route
          path="/categories/:category-slug"
          element={<CategoryProductsPage />}
        />
        <Route
          path="/categories/:category-slug/:sub-category-slug"
          element={<SubCategoryProductsPage />}
        />
        <Route path="/rfqs" element={<RFQPage />} />
      </Routes>
    </>
  );
};

export default App;
