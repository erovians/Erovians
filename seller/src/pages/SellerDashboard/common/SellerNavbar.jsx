import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../../redux/slice/sellerSidebarSlice";
import { assets } from "../../../assets/assets";
import { Menu, Search, Headset, Bell, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import api from "@/utils/axios.utils";

const SellerNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await api.post("/seller/logout", {}, { withCredentials: true });
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


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
          <Link to="/sellerdashboard" className="flex items-center">
            <img src={assets.logo} alt="Logo" className="h-9" />
          </Link>
        </div>

        {/* Right: Icons / Profile */}
        <div className="flex items-center space-x-4 relative border border-red-500">
          {/* Center: Search bar (Desktop only) */}
          <div className="hidden md:flex flex-grow max-w-fit mx-6 h-9">
            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
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
            <Link to="#" className="text-gray-600 hover:text-navyblue">
              <Bell size={22} />
            </Link>
            <Link to="#" className="text-gray-600 hover:text-navyblue">
              <Headset size={22} />
            </Link>
            <Link to="#" className="text-gray-600 hover:text-navyblue">
              <HelpCircle size={22} />
            </Link>
            <Link to="#" className="text-gray-600 hover:text-navyblue">
              
              <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>Ero</AvatarFallback>
              </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-66 mr-10 mt-3" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link to="/sellerdashboard/company/overview">
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⌘</DropdownMenuShortcut>
          </DropdownMenuItem>
          </Link>
          
           <Link to="/sellerdashboard/company/profile">
           
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘</DropdownMenuShortcut>
          </DropdownMenuItem>
           </Link>
         
        </DropdownMenuGroup>
      

        
        <DropdownMenuItem  onClick={handleLogout}>
          Log out
         
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
