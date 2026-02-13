// import { useState } from "react";
// import {
// Bell,
// Maximize,
// Minimize,
// User,
// LayoutDashboard,
// Users,
// ShoppingBag,
// Package,
// ShoppingCart,
// CreditCard,
// MessageSquare,
// FileText,
// Settings,
// } from "lucide-react";

// import { useNavigate, useLocation } from "react-router-dom";
// import seller_logo from "../assets/seller_logo.png";

// export default function Header() {
// const navigate = useNavigate();
// const location = useLocation();

// // ✅ MUST be inside component
// const [isFullscreen, setIsFullscreen] = useState(false);

// // ✅ Fullscreen toggle
// const toggleFullscreen = () => {
// if (!document.fullscreenElement) {
// document.documentElement.requestFullscreen();
// setIsFullscreen(true);
// } else {
// document.exitFullscreen();
// setIsFullscreen(false);
// }
// };

// const navItems = [
// { icon: LayoutDashboard, path: "/admin" },
// { icon: Users, path: "/admin/sellers" },
// { icon: ShoppingBag, path: "/admin/buyers" },
// { icon: Package, path: "/admin/products" },
// { icon: ShoppingCart, path: "/admin/orders" },
// { icon: CreditCard, path: "/admin/payments" },
// { icon: MessageSquare, path: "/admin/inquiries" },
// { icon: FileText, path: "/admin/requests" },
// { icon: Settings, path: "/admin/settings" },
// ];

// return ( <header className="bg-white  sticky top-0 z-50 shadow-sm"> <div className="h-20 flex items-center justify-between px-6">
//     {/* ===== LEFT LOGO ===== */}
//     <img src={seller_logo} alt="Erovians" className="h-11" />

//     {/* ===== CENTER NAV ===== */}
//     <nav className="flex items-center gap-2">
//       {navItems.map((item, i) => {
//         const Icon = item.icon;
//         const active = location.pathname === item.path;

//         return (
//           <button
//             key={i}
//             onClick={() => navigate(item.path)}
//             className={`p-3 rounded-xl transition
//               ${
//                 active
//                   ? "bg-indigo-600 text-white shadow"
//                   : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
//               }`}
//           >
//             <Icon size={18} />
//           </button>
//         );
//       })}
//     </nav>

//     {/* ===== RIGHT ICONS ===== */}
//     <div className="flex items-center gap-2">

//       {/* ✅ WORKING FULLSCREEN */}
//       <button
//         onClick={toggleFullscreen}
//         className="p-3 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-indigo-600"
//       >
//         {isFullscreen ? (
//           <Minimize size={18} />
//         ) : (
//           <Maximize size={18} />
//         )}
//       </button>

//       <button className="p-3 rounded-xl hover:bg-gray-100 text-gray-600">
//         <Bell size={18} />
//       </button>

//       <button className="p-3 rounded-xl hover:bg-gray-100 text-gray-600">
//         <User size={18} />
//       </button>

//     </div>
//   </div>
// </header>

// );
// }




import { useState } from "react";
import {
  Bell,
  Maximize,
  Minimize,
  User,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  FileText,
  Settings,
  Menu
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import seller_logo from "../assets/seller_logo.png";

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, path: "/" },
    { icon: Users, path: "/sellers" },
    { icon: ShoppingBag, path: "/buyers" },
    { icon: Package, path: "/company" },
    { icon: ShoppingCart, path: "/orders" },
    { icon: CreditCard, path: "/payments" },
    { icon: MessageSquare, path: "/inquiries" },
    { icon: FileText, path: "/requests" },
    { icon: Settings, path: "/settings" },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6">
        
        {/* LEFT - Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu size={20} />
          </button>

          <img src={seller_logo} alt="Erovians" className="h-8 sm:h-11" />
        </div>

        {/* CENTER NAV - Hidden on Mobile, Visible on Desktop */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`p-3 rounded-xl transition ${
                  active
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                }`}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </nav>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Fullscreen - Hidden on Mobile */}
          <button
            onClick={toggleFullscreen}
            className="hidden md:block p-2 sm:p-3 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-indigo-600"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          <button className="p-2 sm:p-3 rounded-xl hover:bg-gray-100 text-gray-600 relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 sm:p-3 rounded-xl hover:bg-gray-100 text-gray-600">
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}