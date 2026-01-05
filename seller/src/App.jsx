import "./App.css";
import Navbar from "./common/Navbar";
import Footer from "@/common/Footer";
import { Route, Routes, useLocation } from "react-router-dom";

//common static pages
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import SellOnline from "./pages/SellOnline";
import Grow from "./pages/Grow";
import Login from "./pages/Auth/Login";
import SellerSignUp from "./pages/Auth/SellerSignUp";

//legal pages
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import CookiePolicy from "./pages/Legal/CookiePolicy";
import TermsOfUse from "./pages/Legal/TermsOfUse";
import CommunityGuidelines from "./pages/Legal/CommunityGuidelines";

//dashboard layouts
import SellerDashboardLayout from "./pages/SellerDashboard/pages/SellerDashboardLayout";
import SellerDashboardHome from "./pages/SellerDashboard/pages/SellerDashboardHome";
import CompanyProfile from "./pages/SellerDashboard/components/Company/Companyprofile/CompanyProfileForm";
import AddProducts from "./pages/SellerDashboard/components/Products/AddProducts";
import CompanyOverview from "./pages/SellerDashboard/components/Company/companyOverview/CompanyOverview";
import ListProducts from "./pages/SellerDashboard/components/Products/ListProducts";
import ProductDetails from "./pages/SellerDashboard/components/Products/ProductDetails";
import Categories from "./pages/SellerDashboard/components/Products/Categories";
import CompanyCertification from "./pages/SellerDashboard/components/Company/companyCertificate/CompanyCertification";
import OrderCompletedList from "./pages/SellerDashboard/components/Orders/OrderCompletedList";
import OrderPendingList from "./pages/SellerDashboard/components/Orders/OrderPendingList";
import ReviewSection from "./pages/SellerDashboard/common/SellerReviews";

import ProtectedRoute from "./utils/ProtectedRoute";
import Inquiry from "./pages/SellerDashboard/components/Messages/Inquiry/Inquiry";
// import Inquries from "./pages/SellerDashboard/components/Messages/Inquries";
import InquiryDetail from "./pages/SellerDashboard/components/Messages/InquiryDetail";
import ChatApp from "./pages/chat/ChatApp";
import Teams from "./pages/SellerDashboard/components/Teams/Teams";
import Stocks from "./pages/SellerDashboard/components/Stocks/Stocks";
import Contracts from "./pages/SellerDashboard/components/Contracts/Contracts";
import CreateContract from "./pages/SellerDashboard/components/Contracts/CreateContract";
import TasksAndProjects from "./pages/SellerDashboard/components/TasksAndProjects/TasksProjects";
import WorkOrdersTable from "./pages/SellerDashboard/components/Production/workOrders";
import TransportEstimate from "./pages/SellerDashboard/components/Transport/TransportEstimate";


function NotFound() {
  return (
    <div className=" h-full flex">
      <h1 className="m-auto">404 - Page Not Found</h1>
    </div>
  );
}

function App() {
  const location = useLocation();

  // Public site routes where Navbar/Footer may be hidden
  const hideNavbarRoutes = ["/login", "/start-selling"];
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
            <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal/cookie-policy" element={<CookiePolicy />} />
            <Route path="/legal/terms-of-use" element={<TermsOfUse />} />
            <Route path="/legal/community-guidelines" element={<CommunityGuidelines />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/start-selling" element={<SellerSignUp />} />
          </>
        )}

        {/* Seller dashboard routes */}
        {isSellerRoute && (
          <Route
            path="/sellerdashboard"
            element={
              <ProtectedRoute>
                {" "}
                <SellerDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<SellerDashboardHome />} />

            {/* company */}
            <Route path="company/profile" element={<CompanyProfile />} />
            <Route path="company/overview" element={<CompanyOverview />} />
            <Route
              path="company/addcertificate"
              element={<CompanyCertification />}
            />

            {/* products */}
            <Route path="products/add" element={<AddProducts />} />
            <Route path="products/list" element={<ListProducts />} />
            <Route path="product/:id" element={<ProductDetails />} />
            {/* /sellerdashboard/products/categories */}
            <Route path="products/categories" element={<Categories />} />

            {/* messages */}
            <Route path="messages/inquires" element={<Inquiry />} />
            <Route
              path="messages/inquirydetail/:id"
              element={<InquiryDetail />}
            />

            {/* orders */}
            <Route path="orders/completed" element={<OrderCompletedList />} />
            <Route path="orders/pending" element={<OrderPendingList />} />
            <Route path="orders/reviews" element={<ReviewSection />} />

            {/* chats */}
            <Route path="chats/:userId" element={<ChatApp />} />
            <Route path="*" element={<NotFound />} />

            {/* Teams */}
            <Route path="teams" element={<Teams />} />

            {/* Stocks */}
            <Route path="stocks" element={<Stocks />} />

            {/* Contracts */}
            <Route path="contracts" element={<Contracts />} />
            <Route path="contracts/create" element={<CreateContract />} />

            {/* Task and Projects */}
            <Route path="taskandprojects" element={<TasksAndProjects />} />

            {/* Production */}
            <Route path="production" element={<WorkOrdersTable />} />

            {/* Transport */}
            <Route path="transport" element={<TransportEstimate />} />
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
