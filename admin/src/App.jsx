

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ProtectedRoute } from "./components/ProtectedRoute";
// import Layout from "./components/Layout";

// // Pages
// import Login from "./pages/Login";
// import VerifyOTP from "./pages/VerifyOTP";
// import Dashboard from "./pages/Dashboard";
// import Sellers from "./pages/Sellers";
// import Buyers from "./pages/Buyers";
// import Company from "./pages/Company";
// import Orders from "./pages/Orders";
// import Payments from "./pages/Payments";
// import Inquiries from "./pages/Inquiries";
// import Requests from "./pages/Requests";
// import Settings from "./pages/Settings";
// import ManageAdmins from "./pages/ManageAdmins";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/verify-otp" element={<VerifyOTP />} />

//         {/* Protected */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Layout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Dashboard />} />
//           <Route path="sellers" element={<Sellers />} />
//           <Route path="buyers" element={<Buyers />} />
//           <Route path="company" element={<Company />} />
//           <Route path="orders" element={<Orders />} />
//           <Route path="payments" element={<Payments />} />
//           <Route path="inquiries" element={<Inquiries />} />
//           <Route path="requests" element={<Requests />} />
//           <Route path="settings" element={<Settings />} />
//           <Route path="manage-admins" element={<ManageAdmins />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./lib/redux/auth/authSlice";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import Sellers from "./pages/Sellers";
import Buyers from "./pages/Buyers";
import Company from "./pages/Company";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Inquiries from "./pages/Inquiries";
import Requests from "./pages/Requests";
import Settings from "./pages/Settings";
import ManageAdmins from "./pages/ManageAdmins";

export default function App() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      dispatch(loadUser()).finally(() => setIsReady(true));
    } else {
      setIsReady(true);
    }
  }, [dispatch]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="sellers" element={<Sellers />} />
          <Route path="buyers" element={<Buyers />} />
          <Route path="company" element={<Company />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payments" element={<Payments />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="requests" element={<Requests />} />
          <Route path="settings" element={<Settings />} />
          <Route path="manage-admins" element={<ManageAdmins />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}