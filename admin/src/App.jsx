// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AdminLayout from "./components/Layout";
// import Dashboard from "./pages/Dashboard";
// import Sellers from "./pages/Sellers";
// import Buyers from "./pages/Buyers";
// import Company from "./pages/Company";
// import Orders from "./pages/Orders";
// import Payments from "./pages/Payments";
// import Inquiries from "./pages/Inquiries";
// import Settings from "./pages/Settings";
// import Requests from "./pages/Requests";

// export default function App() {
//   return (
//     <div>
//       <Router>
//         <Routes>
//           {/* Admin routes with sidebar layout */}
//           <Route path="/" element={<AdminLayout />}>
//             <Route index element={<Dashboard />} />
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="sellers" element={<Sellers />} />
//             <Route path="buyers" element={<Buyers />} />
//             <Route path="company" element={<Company />} />
//             <Route path="orders" element={<Orders />} />
//             <Route path="payments" element={<Payments />} />
//             <Route path="inquiries" element={<Inquiries />} />
//             <Route path="settings" element={<Settings />} />
//             <Route path="requests" element={<Requests />} />
//           </Route>
//         </Routes>
//       </Router>
//     </div>
//   );
// }



import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Buyers from './pages/Buyers';
import Company from './pages/Company';
import Inquiries from './pages/Inquiries';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import ProductsDetail from './pages/ProductsDetail';
import Requests from './pages/Requests';
import CompanyProducts from './pages/CompanyProducts';
// ... other imports

// Protected Route Component


function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          
            <Layout />
          
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="buyers" element={<Buyers />} />
          <Route path="company" element={<Company />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payments" element={<Payments />} />
          <Route path="products-detail" element={<ProductsDetail />} />
          <Route path="requests" element={<Requests />} />
          <Route path="company-products" element={<CompanyProducts />} />
          
        </Route>
        <Route path="/login" element={<Login />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;