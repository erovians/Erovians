// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { closeSidebar } from "../../../redux/slice/sellerSidebarSlice";
// import {
//   Home,
//   MessageSquare,
//   ShoppingCart,
//   Box,
//   ChevronDown,
//   ChevronUp,
//   X,
//   Store,
//   UserLock,
// } from "lucide-react";

// const SellerSidebar = () => {
//   const dispatch = useDispatch();

//   const isOpen = useSelector((state) => state.sidebar.isOpen);

//   const [openMenus, setOpenMenus] = useState({
//     home: false,
//     messages: false,
//     orders: false,
//     products: false,
//   });

//   const toggleMenu = (menu) => {
//     setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
//   };

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         className={`fixed inset-0 bg-white  opacity-0 z-40 transition-opacity ${
//           isOpen ? "block" : "hidden"
//         }`}
//         onClick={() => dispatch(closeSidebar())}
//       ></div>

//       {/* Sidebar */}
//       <div
//         className={`fixed top-[93px] border left-0 h-[calc(100%-80px)] bg-white shadow-lg  z-50 w-64 transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {/* Close button */}
//         <div className="flex items-center justify-end px-4 pt-4 pb-2 border-b border-gray-200">
//           <button
//             onClick={() => dispatch(closeSidebar())}
//             className="text-gray-600 hover:text-gray-800 focus:outline-none"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* Menu Items */}
//         {[
//           {
//             key: "home",
//             icon: <Home size={20} />,
//             label: "Home",
//             subLinks: [{ to: "/sellerdashboard", label: "Overview" }],
//           },
//           {
//             key: "products",
//             icon: <Box size={20} />,
//             label: "Products",
//             subLinks: [
//               { to: "/sellerdashboard/products/add", label: "Add Product" },
//               { to: "/sellerdashboard/products/list", label: "List Products" },
//               {
//                 to: "/sellerdashboard/products/categories",
//                 label: "Categories",
//               },
//             ],
//           },
//           {
//             key: "Store",
//             icon: <Store size={20} />,
//             label: "Store",
//             subLinks: [
//               {
//                 to: "/sellerdashboard/company/overview",
//                 label: "Company Overview",
//               },
//               {
//                 to: "/sellerdashboard/company/profile",
//                 label: "Company Profile",
//               },
//               {
//                 to: "/sellerdashboard/company/addcertificate",
//                 label: "Certification",
//               },
//             ],
//           },
//           {
//             key: "messages",
//             icon: <MessageSquare size={20} />,
//             label: "Messages",
//             subLinks: [
//               { to: "/sellerdashboard/messages/inquires", label: "Inquires" },
//               { to: "/sellerdashboard/messages/contacts", label: "Contacts" },
//               { to: "/sellerdashboard/messages/settings", label: "Settings" },
//             ],
//           },
//           {
//             key: "teams",
//             icon: <UserLock size={20} />,
//             label: "Teams",
//             to: "/sellerdashboard/teams",
//           },
//         ].map((menu) => (
//           <div key={menu.key} className="px-4 mt-2 ">
//             <button
//               onClick={() => toggleMenu(menu.key)}
//               className="flex items-center justify-between w-full py-2 text-gray-700 rounded hover:bg-gray-100 focus:outline-none"
//             >
//               <div className="flex items-center space-x-2">
//                 {menu.icon}
//                 <span>{menu.label}</span>
//               </div>
//               {openMenus[menu.key] ? (
//                 <ChevronUp size={18} />
//               ) : (
//                 <ChevronDown size={18} />
//               )}
//             </button>

//             <div
//               className={`overflow-hidden transition-all duration-300 ${
//                 openMenus[menu.key] ? "max-h-40 mt-1" : "max-h-0"
//               } flex flex-col`}
//             >
//               {menu.subLinks.map((subLink) => (
//                 <Link
//                   key={subLink.to}
//                   to={subLink.to}
//                   className="pl-6 py-1 text-gray-600 rounded hover:bg-gray-100"
//                 >
//                   {subLink.label}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default SellerSidebar;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar } from "../../../redux/slice/sellerSidebarSlice";
import {
  Home,
  MessageSquare,
  ShoppingCart,
  Box,
  ChevronDown,
  ChevronUp,
  X,
  Store,
  UserLock,
} from "lucide-react";

const SellerSidebar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  // MENU DATA
  const menuItems = [
    // {
    //   key: "home",
    //   icon: <Home size={20} />,
    //   label: "Home",
    //   subLinks: [{ to: "/sellerdashboard", label: "Overview" }],
    // },
    {
      key: "home",
      icon: <Home size={20} />,
      label: "Home",
      to: "/sellerdashboard",
    },
    {
      key: "products",
      icon: <Box size={20} />,
      label: "Products",
      subLinks: [
        { to: "/sellerdashboard/products/add", label: "Add Product" },
        { to: "/sellerdashboard/products/list", label: "List Products" },
        { to: "/sellerdashboard/products/categories", label: "Categories" },
      ],
    },
    {
      key: "store",
      icon: <Store size={20} />,
      label: "Store",
      subLinks: [
        { to: "/sellerdashboard/company/overview", label: "Company Overview" },
        { to: "/sellerdashboard/company/profile", label: "Company Profile" },
        {
          to: "/sellerdashboard/company/addcertificate",
          label: "Certification",
        },
      ],
    },
    {
      key: "messages",
      icon: <MessageSquare size={20} />,
      label: "Messages",
      subLinks: [
        { to: "/sellerdashboard/messages/inquires", label: "Inquires" },
        { to: "/sellerdashboard/messages/contacts", label: "Contacts" },
        { to: "/sellerdashboard/messages/settings", label: "Settings" },
      ],
    },
    {
      key: "orders",
      icon: <ShoppingCart size={20} />,
      label: "Orders",
      subLinks: [
        { to: "/sellerdashboard/orders/completed", label: "Completed" },
        { to: "/sellerdashboard/orders/pending", label: "Pending" },
        { to: "/sellerdashboard/orders/reviews", label: "Reviews" },
      ],
    },
    {
      key: "teams",
      icon: <UserLock size={20} />,
      label: "Teams",
      to: "/sellerdashboard/teams",
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black opacity-20 z-40 transition-opacity ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => dispatch(closeSidebar())}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-[93px] border left-0 h-[calc(100%-80px)] bg-white shadow-lg z-50 w-64 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex items-center justify-end px-4 pt-4 pb-2 border-b border-gray-200">
          <button
            onClick={() => dispatch(closeSidebar())}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu */}
        {menuItems.map((menu) => (
          <div key={menu.key} className="px-4 mt-2">
            {/* If NO submenu → direct link */}
            {!menu.subLinks ? (
              <Link
                to={menu.to}
                className="flex items-center space-x-2 py-2 text-gray-700 rounded hover:bg-gray-100"
                onClick={() => dispatch(closeSidebar())}
              >
                {menu.icon}
                <span>{menu.label}</span>
              </Link>
            ) : (
              <>
                {/* Button for dropdown menus */}
                <button
                  onClick={() => toggleMenu(menu.key)}
                  className="flex items-center justify-between w-full py-2 text-gray-700 rounded hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    {menu.icon}
                    <span>{menu.label}</span>
                  </div>

                  {openMenus[menu.key] ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>

                {/* Dropdown */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openMenus[menu.key] ? "max-h-40 mt-1" : "max-h-0"
                  }`}
                >
                  {menu.subLinks.map((subLink) => (
                    <Link
                      key={subLink.to}
                      to={subLink.to}
                      className="block pl-6 py-1 text-gray-600 rounded hover:bg-gray-100"
                      onClick={() => dispatch(closeSidebar())}
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default SellerSidebar;
