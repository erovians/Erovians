import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../../redux/slice/sellerSidebarSlice";
import { assets } from "../../../assets/assets";
import { Menu, Search, Headset, Bell, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SellerNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className=" px-6 py-7 flex justify-between items-center">
        {/* Left: Sidebar + Logo */}
        <div className="flex items-center justify-center space-x-10  ">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <Menu size={30} />
          </button>
          <Link to="/" className="flex items-center">
            <img src={assets.logo} alt="Logo" className="h-9" />
          </Link>
        </div>

        {/* Right: Icons / Profile */}
        <div className="flex items-center space-x-4 relative ">
          {/* Center: Search bar (Desktop only) */}
          <div className="hidden md:flex flex-grow max-w-fit mx-6 h-9">
            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden ">
              <button className=" text-black px-2 py-2 cursor-pointer">
                <Search size={20} />
              </button>
              <input
                type="text"
                placeholder="Search ..."
                className="w-full px-4 py-2 text-gray-700 focus:outline-none"
              />
            </div>
          </div>
          {/* Desktop icons */}
          <div className="hidden md:flex items-center space-x-7">
            <Link to="#" className="text-gray-600 hover:text-blue-500">
              <Bell size={22} />
            </Link>
            <Link to="#" className="text-gray-600 hover:text-blue-500">
              <Headset size={22} />
            </Link>
            <Link to="#" className="text-gray-600 hover:text-blue-500">
              <HelpCircle size={22} />
            </Link>
            <Link to="#" className="text-gray-600 hover:text-blue-500">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>Ero</AvatarFallback>
              </Avatar>
            </Link>
          </div>

          {/* Mobile: Profile dropdown */}
          <div className="md:hidden relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-gray-600 hover:text-blue-500 focus:outline-none"
            >
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2">
                {/* Links */}
                <Link
                  to="#"
                  className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <Link
                  to="#"
                  className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                >
                  Messages
                </Link>
                <Link
                  to="#"
                  className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                >
                  Cart
                </Link>
                <Link
                  to="#"
                  className="block px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                >
                  Help
                </Link>

                {/* Mobile search bar */}
                <div className="mt-2">
                  <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
                    <button className="text-black px-2 py-2 cursor-pointer">
                      <Search size={20} />
                    </button>
                    <input
                      type="text"
                      placeholder="Search ..."
                      className="w-full px-3 py-2 text-gray-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default SellerNavbar;
