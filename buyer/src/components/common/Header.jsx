import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  X,
  Heart,
  Gift,
  Bell,
  LogOut,
  Package,
  CreditCard,
  Store,
  ChevronRight,
  Globe,
  Tag,
  HelpCircle,
  FileText,
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

const userMenuItems = [
  { icon: User, label: "My Profile", path: "/profile" },
  { icon: Package, label: "Orders", path: "/orders" },
  { icon: Heart, label: "Wishlist", path: "/wishlist" },
  { icon: Gift, label: "Coupons", path: "/coupons" },
  { icon: CreditCard, label: "Gift Cards", path: "/gift-cards" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
];

const moreMenuItems = [
  { label: "Notification Preferences", path: "/notifications" },
  { label: "24x7 Customer Care", path: "/help" },
  { label: "Advertise", path: "/advertise" },
  { label: "Download App", path: "/download" },
];

const sidebarMainItems = [
  { icon: Tag, label: "Offer Zone", path: "/offers" },
  { icon: Store, label: "Sell on Platform", path: "/seller" },
  { icon: Package, label: "My Orders", path: "/orders" },
  { icon: Gift, label: "Coupons", path: "/coupons" },
  { icon: ShoppingCart, label: "My Cart", path: "/cart" },
  { icon: Heart, label: "My Wishlist", path: "/wishlist" },
  { icon: User, label: "My Account", path: "/account" },
  { icon: Bell, label: "My Notifications", path: "/notifications" },
];

const sidebarFooterItems = [
  { icon: HelpCircle, label: "Help Centre", path: "/help" },
  { icon: FileText, label: "Legal", path: "/legal" },
];

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const isAuthenticated = false;
  const userName = "Ankur Agarwal";

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 left-0 z-50 w-full">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={28} />
            </button>

            <div className="flex items-center">
              <Link to={"/"}>
                <img
                  src={assets.logo}
                  alt="Logo"
                  className="h-8 w-auto sm:h-8 md:h-8 lg:h-10 xl:h-12"
                />
              </Link>
            </div>

            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for Products, Brands and More"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-500 text-sm"
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-gray-900 hover:bg-black transition-colors">
                  <Search className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {!isAuthenticated ? (
                <Button
                  onClick={handleLoginClick}
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 h-auto font-medium text-base border border-transparent hover:border-gray-300 transition-all rounded-sm"
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 h-auto font-medium text-base border border-transparent hover:border-gray-300 transition-all rounded-sm"
                    >
                      <User className="h-5 w-5" />
                      <span>{userName}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {userMenuItems.map((item) => (
                      <DropdownMenuItem key={item.path}>
                        <Link
                          to={item.path}
                          className="flex items-center gap-3 w-full py-1"
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full py-1"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Link to="/cart">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 h-auto font-medium text-base border border-transparent hover:border-gray-300 transition-all rounded-sm"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                </Button>
              </Link>

              <Link to="/seller">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 h-auto font-medium text-base rounded-sm"
                >
                  <Store className="h-5 w-5" />
                  <span>Become a Seller</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-3 py-2 h-auto hover:bg-gray-100 rounded-sm"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="h-0.5 w-1 bg-gray-600 rounded" />
                      <div className="h-0.5 w-1 bg-gray-600 rounded" />
                      <div className="h-0.5 w-1 bg-gray-600 rounded" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {moreMenuItems.map((item) => (
                    <DropdownMenuItem key={item.path}>
                      <Link to={item.path} className="w-full text-sm py-1">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Link to="/cart" className="md:hidden">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ShoppingCart size={24} />
              </button>
            </Link>
          </div>

          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for Products, Brands and More"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-500 text-sm"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-gray-900">
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
          <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2">
                <User className="h-6 w-6 text-gray-900" />
              </div>
              <div>
                <p className="font-semibold text-base">{userName}</p>
                <p className="text-xs text-gray-300">Welcome back!</p>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className="p-1 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        ) : (
          <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
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
          <div className="border-b border-gray-200 py-2">
            {sidebarMainItems.map((item) => (
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
          <div className="border-b border-gray-200 py-2">
            <Link
              to="/language"
              onClick={closeSidebar}
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
            >
              <Globe className="h-5 w-5 text-gray-700" />
              <span className="text-gray-900">Choose Language</span>
            </Link>
          </div>
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
          {isAuthenticated ? (
            <div className="px-2 py-4">
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
            </div>
          ) : (
            <div className="px-2 py-4">
              <button
                onClick={() => {
                  closeSidebar();
                  handleLoginClick();
                }}
                className="flex items-center gap-3 bg-gray-900 text-white hover:bg-gray-800 w-full px-4 py-3 rounded-lg transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
