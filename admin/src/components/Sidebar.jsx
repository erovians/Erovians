

// import {
//   LayoutDashboard,
//   Users,
//   ShoppingBag,
//   Building,
//   ShoppingCart,
//   CreditCard,
//   MessageSquare,
//   FileText,
//   Settings,
//   ChevronLeft,
//   X,
//   UserCog,
//   LogOut,
//   Shield,
// } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";

// // ── All possible menu items ──────────────────────────────────
// // permKey: null means "always show" (no permission check needed)
// const ALL_MENU_ITEMS = [
//   {
//     icon: LayoutDashboard,
//     label: "Dashboard",
//     path: "/",
//     permKey: "dashboard",
//   },
//   {
//     icon: Users,
//     label: "Sellers",
//     path: "/sellers",
//     permKey: "sellers",
//   },
//   {
//     icon: ShoppingBag,
//     label: "Buyers",
//     path: "/buyers",
//     permKey: "buyers",
//   },
//   {
//     icon: Building,
//     label: "Company",
//     path: "/company",
//     permKey: "company",
//   },
//   {
//     icon: ShoppingCart,
//     label: "Orders",
//     path: "/orders",
//     permKey: "orders",
//   },
//   {
//     icon: CreditCard,
//     label: "Payments",
//     path: "/payments",
//     permKey: "payments",
//   },
//   {
//     icon: MessageSquare,
//     label: "Inquiries",
//     path: "/inquiries",
//     permKey: "inquiries",
//   },
//   {
//     icon: FileText,
//     label: "Requests",
//     path: "/requests",
//     permKey: "requests",
//   },
//   {
//     icon: Settings,
//     label: "Settings",
//     path: "/settings",
//     permKey: "settings",
//   },
//   // ── Super Admin only ──
//   {
//     icon: UserCog,
//     label: "Manage Admins",
//     path: "/manage-admins",
//     permKey: null,          // handled separately - superAdminOnly
//     superAdminOnly: true,
//     highlight: true,        // special accent color
//   },
// ];

// export default function Sidebar({ isOpen, onClose, isCollapsed, setIsCollapsed }) {
//   const navigate = useNavigate();
//   const location = useLocation();


//   // Filter items based on role & permissions
//   const visibleItems = ALL_MENU_ITEMS.filter((item) => {
//     // Super admin only items
//     if (item.superAdminOnly) return isSuperAdmin;
//     // Permission-based items
//     return hasPermission(item.permKey);
//   });

//   const handleNavClick = (path) => {
//     navigate(path);
//     if (window.innerWidth < 1024) onClose();
//   };

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           bg-white border-r border-gray-200
//           flex flex-col h-full
//           fixed lg:sticky top-0 z-50
//           transition-all duration-300 ease-in-out
//           ${isCollapsed ? "w-20" : "w-64"}
//           ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//         `}
//       >
//         {/* ── Header ── */}
//         <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//           {!isCollapsed && (
//             <div className="flex items-center gap-2">
//               <Shield className="w-5 h-5 text-indigo-600" />
//               <span className="text-xl font-bold text-gray-800">
//                 {isSuperAdmin ? "Super Admin" : "Admin"}
//               </span>
//             </div>
//           )}

//           {/* Desktop collapse toggle */}
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <ChevronLeft
//               className={`w-5 h-5 text-gray-600 transition-transform ${
//                 isCollapsed ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {/* Mobile close */}
//           <button
//             onClick={onClose}
//             className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* ── User Info ── */}
//         {!isCollapsed && user && (
//           <div className="px-4 py-3 border-b border-gray-100 bg-indigo-50">
//             <p className="text-sm font-semibold text-gray-800 truncate">
//               {user.name || "Admin"}
//             </p>
//             <p className="text-xs text-indigo-600 font-medium truncate">
//               {user.email || user.mobile}
//             </p>
//             <span className="inline-block mt-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
//               {isSuperAdmin ? "Super Admin" : "Admin"}
//             </span>
//           </div>
//         )}

//         {/* ── Menu Items ── */}
//         <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
//           {visibleItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;

//             return (
//               <button
//                 key={item.path}
//                 onClick={() => handleNavClick(item.path)}
//                 className={`
//                   w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
//                   ${
//                     isActive
//                       ? item.highlight
//                         ? "bg-amber-500 text-white shadow-lg"
//                         : "bg-indigo-600 text-white shadow-lg"
//                       : item.highlight
//                       ? "text-amber-600 hover:bg-amber-50 border border-amber-200"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }
//                   ${isCollapsed ? "justify-center" : ""}
//                 `}
//                 title={isCollapsed ? item.label : ""}
//               >
//                 <Icon className="w-5 h-5 flex-shrink-0" />
//                 {!isCollapsed && (
//                   <span className="font-medium text-sm">{item.label}</span>
//                 )}
//                 {/* Super Admin badge */}
//                 {!isCollapsed && item.superAdminOnly && !isActive && (
//                   <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">
//                     SA
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         {/* ── Logout ── */}
//         <div className="p-3 border-t border-gray-200">
//           <button
//             onClick={logout}
//             className={`
//               w-full flex items-center gap-3 px-4 py-3 rounded-xl
//               text-red-500 hover:bg-red-50 transition-all
//               ${isCollapsed ? "justify-center" : ""}
//             `}
//             title={isCollapsed ? "Logout" : ""}
//           >
//             <LogOut className="w-5 h-5 flex-shrink-0" />
//             {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }


import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Building,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  FileText,
  Settings,
  ChevronLeft,
  X,
  UserCog,
  LogOut,
  Shield,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../lib/redux/auth/authSlice"; // adjust path if needed

// ─────────────────────────────────────────────
// Menu Items
// ─────────────────────────────────────────────
const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Sellers", path: "/sellers" },
  { icon: ShoppingBag, label: "Buyers", path: "/buyers" },
  { icon: Building, label: "Company", path: "/company" },
  { icon: ShoppingCart, label: "Orders", path: "/orders" },
  { icon: CreditCard, label: "Payments", path: "/payments" },
  { icon: MessageSquare, label: "Inquiries", path: "/inquiries" },
  { icon: FileText, label: "Requests", path: "/requests" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: UserCog, label: "Manage Admins", path: "/manage-admins" },
];

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  setIsCollapsed,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Redux instead of useAuth
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(logoutUser());
  };

  const handleNavClick = (path) => {
    navigate(path);

    // mobile pe click karte hi sidebar close
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* ───────── Mobile Overlay ───────── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ───────── Sidebar ───────── */}
      <aside
        className={`
          bg-white border-r border-gray-200
          flex flex-col h-full
          fixed lg:sticky top-0 z-50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ───────── Header ───────── */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">Admin</span>
            </div>
          )}

          {/* Desktop collapse */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ───────── User Info ───────── */}
        {!isCollapsed && user && (
          <div className="px-4 py-3 border-b border-gray-100 bg-indigo-50">
            <p className="text-sm font-semibold truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-indigo-600 truncate">
              {user?.email || ""}
            </p>
          </div>
        )}

        {/* ───────── Menu ───────── */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all
                  ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ───────── Logout ───────── */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
