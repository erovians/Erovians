import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  User,
  ChevronDown,
  Menu,
  X,
  Heart,
  MessageSquare,
  FileText,
  Package,
  Store,
  ChevronRight,
  Globe,
  HelpCircle,
  Phone,
  Settings,
  LogOut,
  LayoutDashboard,
  Building2,
  Check,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import LanguageCurrencyModal from "./LanguageCurrencyModal";
import CategoriesMenu from "./CategoriesMenu";

const sidebarMainItems = [
  { icon: FileText, label: "Post RFQ", path: "/post-rfq", requiresAuth: true },
  { icon: Package, label: "My Orders", path: "/orders", requiresAuth: true },
  {
    icon: MessageSquare,
    label: "Messages",
    path: "/messages",
    requiresAuth: true,
  },
  {
    icon: Heart,
    label: "Favorites",
    path: "/favorites",
    requiresAuth: true,
  },
  {
    icon: LayoutDashboard,
    label: "My Dashboard",
    path: "/dashboard",
    requiresAuth: true,
  },
  { icon: User, label: "My Profile", path: "/profile", requiresAuth: true },
];

const sidebarPublicItems = [
  { icon: Package, label: "All Categories", path: "/categories" },
  { icon: HelpCircle, label: "Help Center", path: "/help" },
  { icon: Phone, label: "Contact Us", path: "/contact" },
];

const sidebarFooterItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Help Center", path: "/help" },
  { icon: Phone, label: "Contact Us", path: "/contact" },
];

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = true;
  const user = isAuthenticated
    ? {
        name: "Ankur Agarwal",
        email: "ankur@example.com",
        mobile: "9876543210",
        isMobileVerified: true,
        profileURL: "",
        role: "user",
        isSeller: true,
        sellerId: null,
      }
    : null;

  const isSeller =
    user?.role === "seller" || user?.isSeller || user?.sellerId !== null;

  const seller = isSeller
    ? {
        businessName: "Marble Trading Co.",
        category: "Marbles",
        verificationStatus: "Approved",
      }
    : null;

  const company =
    isSeller && seller
      ? {
          companyName: "Erovians Marble Pvt Ltd",
          logo: "",
        }
      : null;

  const unreadCount = isAuthenticated ? 3 : 0;

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Add logout logic here
  };

  return (
    <>
      <div className="bg-navyblue text-white text-sm hidden md:block">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center gap-6">
              <Link
                to="/how-it-works"
                className="hover:text-gray-300 transition-colors"
              >
                How It Works
              </Link>
              <Link
                to="/help"
                className="hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                <HelpCircle size={14} />
                Help Center
              </Link>
            </div>

            <div className="flex items-center gap-6">
              {isAuthenticated && !isSeller && (
                <Link
                  to="/become-seller"
                  className="bg-yellow-500 text-navyblue px-4 py-1 rounded-sm font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-1"
                >
                  <Store size={14} />
                  Become A Seller
                </Link>
              )}

              {isAuthenticated && isSeller && (
                <Link
                  to="https://seller.erovians.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-500 text-navyblue px-4 py-1 rounded-sm font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-1"
                >
                  <Store size={14} />
                  Seller Dashboard
                </Link>
              )}

              {!isAuthenticated && !isSeller && (
                <Link
                  to="/seller-registration"
                  className="text-yellow-300 hover:text-yellow-100 font-medium transition-colors"
                >
                  Sell on Erovians →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-white shadow-sm border-b sticky top-0 left-0 z-50 w-full">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={28} />
            </button>

            <div className="flex items-center">
              <Link to="/">
                <img
                  src={assets.logo}
                  alt="Logo"
                  className="h-8 w-auto sm:h-8 md:h-10 lg:h-12"
                />
              </Link>
            </div>

            <div className="hidden lg:block  rounded-2xl border border-navyblue">
              <CategoriesMenu />
            </div>

            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Products, Suppliers, Companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-sm focus:outline-none focus:border-navyblue text-sm"
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-navyblue hover:bg-blue transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated && (
                <>
                  <Link to="/messages">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 h-auto rounded-sm relative"
                    >
                      <MessageSquare className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  <Link to="/favorites">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 h-auto rounded-sm"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>
                </>
              )}

              {!isAuthenticated ? (
                <>
                  <Link
                    to="/seller-registration"
                    className="border border-navyblue px-4 mr-4 py-2  text-navyblue  hover:text-white hover:bg-navyblue rounded-2xl  font-medium transition-colors"
                  >
                    Become A Seller →
                  </Link>

                  <Button
                    onClick={handleLoginClick}
                    className="bg-navyblue hover:bg-blue text-white px-6 py-2 h-auto font-medium text-sm rounded-sm"
                  >
                    Log In
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 h-auto font-medium text-sm border border-transparent hover:border-gray-300 transition-all rounded-sm"
                    >
                      {user.profileURL ? (
                        <img
                          src={user.profileURL}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-navyblue text-white flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                      )}

                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-navyblue">
                          {user.name || "User"}
                        </span>
                        <span className="text-xs text-gray-600">
                          {user.email}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-64">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      {user.mobile && (
                        <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                          <Phone size={12} />
                          {user.mobile}
                          {user.isMobileVerified && (
                            <Check size={12} className="text-green-600" />
                          )}
                        </p>
                      )}
                    </div>

                    <DropdownMenuItem>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 w-full py-1"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>My Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 w-full py-1"
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 w-full py-1"
                      >
                        <Package className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Link
                        to="/rfqs"
                        className="flex items-center gap-3 w-full py-1"
                      >
                        <FileText className="h-4 w-4" />
                        <span>My RFQs</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Link
                        to="/messages"
                        className="flex items-center gap-3 w-full py-1 relative"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Messages</span>
                        {unreadCount > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Link
                        to="/favorites"
                        className="flex items-center gap-3 w-full py-1"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Favorites</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {!isSeller && (
                      <>
                        <DropdownMenuItem className="bg-yellow-50 hover:bg-yellow-100">
                          <Link
                            to="/become-seller"
                            className="flex items-center gap-3 w-full py-1"
                          >
                            <Store className="h-4 w-4 text-yellow-700" />
                            <div className="flex flex-col">
                              <span className="font-semibold text-yellow-700">
                                Sell on Erovians
                              </span>
                              <span className="text-xs text-yellow-600">
                                Start your business
                              </span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    {isSeller && (
                      <>
                        <DropdownMenuItem className="bg-blue-50 hover:bg-blue-100">
                          <Link
                            to="https://seller.erovians.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 w-full py-1"
                          >
                            <Store className="h-4 w-4 text-navyblue" />
                            <div className="flex flex-col">
                              <span className="font-semibold text-navyblue">
                                Seller Dashboard
                              </span>
                              <span className="text-xs text-gray-600">
                                {seller?.businessName || "Manage products"}
                              </span>
                            </div>
                            <ChevronRight className="h-4 w-4 ml-auto" />
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuItem>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 w-full py-1"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full py-1"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex md:hidden items-center gap-2">
              {isAuthenticated && (
                <>
                  <Link to="/messages">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                      <MessageSquare size={22} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </Link>
                  <Link to="/favorites">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Heart size={22} />
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Products, Suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-sm focus:outline-none focus:border-navyblue text-sm"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-navyblue">
                <Search className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-60 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-70 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {isAuthenticated ? (
          <div className="bg-navyblue text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user.profileURL ? (
                  <img
                    src={user.profileURL}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="bg-white rounded-full p-3">
                    {isSeller ? (
                      <Building2 className="h-6 w-6 text-navyblue" />
                    ) : (
                      <User className="h-6 w-6 text-navyblue" />
                    )}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm">
                    {isSeller && company?.companyName
                      ? company.companyName
                      : user.name}
                  </p>
                  <p className="text-xs text-gray-300">
                    {isSeller ? seller?.businessName : user.email}
                  </p>
                  {isSeller && seller?.verificationStatus && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
                      {seller.verificationStatus}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={closeSidebar}
                className="p-1 hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-navyblue text-white p-6 flex items-center justify-between">
            <img src={assets.logowhite} alt="Logo" className="h-8 w-auto" />
            <button
              onClick={closeSidebar}
              className="p-1 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        )}

        <div className="overflow-y-auto h-[calc(100%-88px)] hide-scrollbar">
          <div className="border-b border-gray-200">
            <Link
              to="/categories"
              onClick={closeSidebar}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-700" />
                <span className="font-medium text-gray-900">
                  All Categories
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="border-b border-gray-200 py-2">
              {sidebarMainItems
                .filter((item) => !item.requiresAuth || isAuthenticated)
                .map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeSidebar}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <item.icon className="h-5 w-5 text-gray-700" />
                    <span className="text-gray-900">{item.label}</span>
                    {item.path === "/messages" && unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                ))}
            </div>
          ) : (
            <div className="border-b border-gray-200 py-2">
              {sidebarPublicItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  <item.icon className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-900">{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          {isAuthenticated && isSeller && (
            <div className="border-b border-gray-200 py-2">
              <Link
                to="https://seller.erovians.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeSidebar}
                className="flex items-center justify-between px-6 py-4 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-navyblue" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-navyblue text-sm">
                      Seller Dashboard
                    </span>
                    <span className="text-xs text-gray-600">
                      Manage products & orders
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-navyblue" />
              </Link>
            </div>
          )}

          {isAuthenticated && !isSeller && (
            <div className="border-b border-gray-200 py-2">
              <Link
                to="/become-seller"
                onClick={closeSidebar}
                className="flex items-center justify-between px-6 py-4 bg-yellow-50 hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-yellow-700" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-yellow-700 text-sm">
                      Sell on Erovians
                    </span>
                    <span className="text-xs text-yellow-600">
                      Start your business today
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-yellow-700" />
              </Link>
            </div>
          )}

          <div className="border-b border-gray-200 py-2">
            <button
              onClick={() => {
                setIsLanguageModalOpen(true);
                closeSidebar();
              }}
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors w-full text-left"
            >
              <Globe className="h-5 w-5 text-gray-700" />
              <span className="text-gray-900">Language & Currency</span>
            </button>
          </div>

          {isAuthenticated && (
            <div className="py-2">
              {sidebarFooterItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  <item.icon className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-900">{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          <div className="px-2 py-4">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  closeSidebar();
                }}
                className="flex items-center gap-3 text-red-600 hover:bg-red-50 w-full px-4 py-3 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  closeSidebar();
                  handleLoginClick();
                }}
                className="flex items-center gap-3 bg-navyblue text-white hover:bg-blue w-full px-4 py-3 rounded-lg transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Join Free</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <LanguageCurrencyModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />
    </>
  );
}
