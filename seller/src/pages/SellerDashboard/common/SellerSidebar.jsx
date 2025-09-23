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
} from "lucide-react";

const SellerSidebar = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const [openMenus, setOpenMenus] = useState({
    home: false,
    messages: false,
    orders: false,
    products: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-white opacity-0 z-40 transition-opacity ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => dispatch(closeSidebar())}
      ></div>

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

        {/* Menu Items */}
        {[
          {
            key: "home",
            icon: <Home size={20} />,
            label: "Home",
            subLinks: [
              { to: "/seller/dashboard/overview", label: "Overview" },
              { to: "/seller/dashboard/stats", label: "Stats" },
            ],
          },
          {
            key: "messages",
            icon: <MessageSquare size={20} />,
            label: "Messages",
            subLinks: [
              { to: "/seller/messages/inbox", label: "Inbox" },
              { to: "/seller/messages/sent", label: "Sent" },
            ],
          },
          {
            key: "orders",
            icon: <ShoppingCart size={20} />,
            label: "Orders",
            subLinks: [
              { to: "/seller/orders/pending", label: "Pending" },
              { to: "/seller/orders/completed", label: "Completed" },
            ],
          },
          {
            key: "products",
            icon: <Box size={20} />,
            label: "Products",
            subLinks: [
              { to: "/seller/products/list", label: "List Products" },
              { to: "/seller/products/add", label: "Add Product" },
              { to: "/seller/products/categories", label: "Categories" },
            ],
          },
        ].map((menu) => (
          <div key={menu.key} className="px-4 mt-2">
            <button
              onClick={() => toggleMenu(menu.key)}
              className="flex items-center justify-between w-full py-2 text-gray-700 rounded hover:bg-gray-100 focus:outline-none"
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

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openMenus[menu.key] ? "max-h-40 mt-1" : "max-h-0"
              } flex flex-col`}
            >
              {menu.subLinks.map((subLink) => (
                <Link
                  key={subLink.to}
                  to={subLink.to}
                  className="pl-6 py-1 text-gray-600 rounded hover:bg-gray-100"
                >
                  {subLink.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SellerSidebar;
