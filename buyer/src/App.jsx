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
import RefundPolicy from "./pages/RefundPolicy";
import RFQPage from "./pages/RFQPage";
import { Toaster } from "sonner";
import BecomeSeller from "./pages/BecomeSeller";
import NewsCenter from "./pages/NewsCenter";
import SellerVerification from "./pages/SellerVerification";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
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
        {/* //authentication route  */}
        <Route path="/login" element={<Auth />} />
        {/* company routes  */}
        <Route path="/" element={<Companies />} />
        <Route path="/company/:companyId" element={<CompanyProduct />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        {/* profile page  */}
        <Route path="/profile" element={<Profile />} />
        {/* //categories page okay  */}
        <Route path="/categories" element={<CategoriesPage />} />
        <Route
          path="/categories/:categorySlug"
          element={<CategoryProductsPage />}
        />
        <Route
          path="/categories/:categorySlug/:subCategorySlug"
          element={<SubCategoryProductsPage />}
        />
        <Route path="/settings" element={<Setting />} />
        {/* //footer links  */}
        {/* Get Support  */}
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        {/* Payments & Protections  */}
        <Route path="/how-to-pay" element={<HowToPay />} />
        {/* Get to Know Us */}
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<NewsCenter />} />
        <Route path="/contact" element={<Contact />} />
        {/* Source on Erovians */}
        <Route path="/rfqs" element={<RFQPage />} />

        {/* Sell on Erovians  */}
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/seller-verification" element={<SellerVerification />} />
        {/* // top header */}
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
    </>
  );
};

export default App;
