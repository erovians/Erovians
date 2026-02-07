import { useState, useEffect, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUser,
  clearError,
  clearSuccess,
} from "../../lib/redux/auth/authSlice";
import { universalSearch } from "../../lib/redux/category/categorySlice";

const sidebarMainItems = [
  { icon: FileText, label: "Post RFQ", path: "/rfqs", requiresAuth: true },
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Refs for click outside detection
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user: logedUser,
    isAuthenticated,
    loading,
    error,
    success,
  } = useSelector((state) => state.auth);

  const { search } = useSelector((state) => state.category);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [error, dispatch]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSidebarOpen]);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      dispatch(universalSearch(searchQuery));
      setShowDropdown(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const isSeller = logedUser?.role?.includes("seller") || false;
  const unreadCount = isAuthenticated ? 0 : 0;

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    closeSidebar();
  };

  // ✅ Handle suggestion click with mouseDown instead of click
  const handleSuggestionClick = (type, id) => {
    console.log("Clicked:", type, id); // Debug log
    setShowDropdown(false);
    setSearchQuery("");

    if (type === "product") {
      navigate(`/product/${id}`);
    } else if (type === "company") {
      navigate(`/company/${id}`);
    }
  };

  const hasResults =
    search.products?.length > 0 || search.companies?.length > 0;
  const shouldShowDropdown = showDropdown && searchQuery.length >= 2;

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
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 left-0 z-50 w-full">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center justify-between h-20 gap-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={28} />
            </button>

            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/">
                <img
                  src={assets.logo}
                  alt="Logo"
                  className="h-8 w-auto sm:h-8 md:h-10 lg:h-12"
                />
              </Link>
            </div>

            {/* Categories Menu - Desktop */}
            <div className="hidden lg:block shrink-0">
              <CategoriesMenu />
            </div>

            {/* Search Bar - Desktop */}
            <div
              className="hidden md:flex flex-1 max-w-2xl relative"
              ref={searchRef}
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Products, Companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-sm focus:outline-none focus:border-navyblue focus:ring-2 focus:ring-navyblue/20 text-sm transition-all"
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-navyblue hover:bg-blue transition-colors rounded-r-sm">
                  <Search className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Search Dropdown */}
              {shouldShowDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
                >
                  {search.loading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navyblue mx-auto"></div>
                      <p className="mt-2 text-sm">Searching...</p>
                    </div>
                  ) : !hasResults ? (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">
                        No results found for "{searchQuery}"
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Products Section */}
                      {search.products && search.products.length > 0 && (
                        <div className="p-2 border-b">
                          <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                            📦 Products ({search.products.length})
                          </p>
                          {search.products.map((product) => (
                            <div
                              key={product._id}
                              onMouseDown={() =>
                                handleSuggestionClick("product", product._id)
                              }
                              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer"
                            >
                              <img
                                src={product.productImage || "/placeholder.png"}
                                alt={product.productName}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {product.productName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ₹{product.price}/{product.priceUnit}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Companies Section */}
                      {search.companies && search.companies.length > 0 && (
                        <div className="p-2">
                          <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                            🏢 Companies ({search.companies.length})
                          </p>
                          {search.companies.map((company) => (
                            <div
                              key={company._id}
                              onMouseDown={() =>
                                handleSuggestionClick("company", company._id)
                              }
                              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer"
                            >
                              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
                                {company.logo ? (
                                  <img
                                    src={company.logo}
                                    alt={company.companyName}
                                    className="w-full h-full object-cover rounded"
                                  />
                                ) : (
                                  <Building2 className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {company.companyName}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Side Icons and Buttons */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              {isAuthenticated && (
                <>
                  {/* Messages Icon */}
                  <Link to="/messages">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-lightblue relative transition-all rounded-lg h-10 w-10"
                    >
                      <MessageSquare className="h-5 w-5 text-navyblue" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  {/* Favorites Icon */}
                  <Link to="/favorites">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-lightblue transition-all rounded-lg h-10 w-10"
                    >
                      <Heart className="h-5 w-5 text-navyblue" />
                    </Button>
                  </Link>
                </>
              )}

              {/* Not Authenticated State */}
              {!isAuthenticated ? (
                <>
                  {/* Become A Seller Button */}
                  <Link to="/seller-registration">
                    <Button
                      variant="outline"
                      className="border-2 border-navyblue bg-white hover:bg-navyblue text-navyblue hover:text-white px-5 py-2.5 h-auto rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                    >
                      <Store size={16} />
                      Become A Seller
                    </Button>
                  </Link>

                  {/* Login Button */}
                  <Button
                    onClick={handleLoginClick}
                    className="bg-navyblue hover:bg-blue text-white px-6 py-2.5 h-auto font-semibold text-sm rounded-lg transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                  >
                    Log In
                  </Button>
                </>
              ) : (
                /* User Profile Dropdown */
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-lightblue px-3 py-2 h-auto font-medium text-sm border-2 border-transparent hover:border-navyblue transition-all rounded-lg"
                    >
                      {logedUser?.profileURL?.url ? (
                        <img
                          src={logedUser.profileURL.url}
                          alt={logedUser.name || "User"}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-navyblue text-white flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                      )}

                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-navyblue">
                          {logedUser?.name || "User"}
                        </span>
                        <span className="text-xs text-gray-600">
                          {logedUser?.email}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-navyblue" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-64">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-semibold">{logedUser?.name}</p>
                      {logedUser?.email && (
                        <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                          <Mail size={12} />
                          {logedUser.email}
                          {logedUser.isEmailVerified && (
                            <Check size={12} className="text-green-600" />
                          )}
                        </p>
                      )}
                      {logedUser?.mobile && (
                        <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                          <Phone size={12} />
                          {logedUser.mobile}
                          {logedUser.isMobileVerified && (
                            <Check size={12} className="text-green-600" />
                          )}
                        </p>
                      )}
                    </div>

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
                        to="/my-rfqs"
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
                                Manage products
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

            {/* Mobile Icons */}
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

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Search Products, Companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-sm focus:outline-none focus:border-navyblue text-sm"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-navyblue">
                <Search className="h-5 w-5 text-white" />
              </button>

              {/* Mobile Search Dropdown */}
              {shouldShowDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
                >
                  {search.loading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navyblue mx-auto"></div>
                      <p className="mt-2 text-sm">Searching...</p>
                    </div>
                  ) : !hasResults ? (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">
                        No results found for "{searchQuery}"
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Products Section */}
                      {search.products && search.products.length > 0 && (
                        <div className="p-2 border-b">
                          <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                            📦 Products ({search.products.length})
                          </p>
                          {search.products.map((product) => (
                            <div
                              key={product._id}
                              onMouseDown={() =>
                                handleSuggestionClick("product", product._id)
                              }
                              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer"
                            >
                              <img
                                src={product.productImage || "/placeholder.png"}
                                alt={product.productName}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {product.productName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ₹{product.price}/{product.priceUnit}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Companies Section */}
                      {search.companies && search.companies.length > 0 && (
                        <div className="p-2">
                          <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                            🏢 Companies ({search.companies.length})
                          </p>
                          {search.companies.map((company) => (
                            <div
                              key={company._id}
                              onMouseDown={() =>
                                handleSuggestionClick("company", company._id)
                              }
                              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer"
                            >
                              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
                                {company.logo ? (
                                  <img
                                    src={company.logo}
                                    alt={company.companyName}
                                    className="w-full h-full object-cover rounded"
                                  />
                                ) : (
                                  <Building2 className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {company.companyName}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-60 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar - Rest of the code remains same */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-70 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {isAuthenticated ? (
          <div className="bg-navyblue text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {logedUser?.profileURL?.url ? (
                  <img
                    src={logedUser.profileURL.url}
                    alt={logedUser.name || "User"}
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
                    {logedUser?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-300">{logedUser?.email}</p>
                  {isSeller && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
                      Seller
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
                <span className="font-medium">Log In</span>
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
