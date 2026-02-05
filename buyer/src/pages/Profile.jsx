import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadUser, logoutUser } from "../lib/redux/auth/authSlice";
import {
  User,
  MapPin,
  Settings,
  ChevronRight,
  ShoppingBag,
  FileText,
  Heart,
  MessageSquare,
  LogOut,
  Menu,
  XCircle,
  ExternalLink,
  LayoutDashboard,
} from "lucide-react";
import Layout from "../components/common/Layout";
import ProfileInfo from "../components/profile/ProfileInfo";
import AddressManager from "../components/profile/AddressManager";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const { user, loading, error } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">Failed to load profile</p>
      </div>
    );
  }

  const isSeller = user.role?.includes("seller");

  const tabItems = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "addresses", label: "Manage Addresses", icon: MapPin },
  ];

  const navigationButtons = [
    { id: "orders", label: "My Orders", icon: ShoppingBag, route: "/orders" },
    { id: "rfqs", label: "My RFQs", icon: FileText, route: "/rfqs" },
    { id: "favorites", label: "Favorites", icon: Heart, route: "/favorites" },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      route: "/messages",
    },
    {
      id: "settings",
      label: "Account Settings",
      icon: Settings,
      route: "/settings",
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const handleNavigation = (route) => {
    navigate(route);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
          <div className="grid lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Desktop Sidebar - No Scroll */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-5 max-h-[calc(100vh-2.5rem)]">
                {/* User Profile Header */}
                <div className="bg-linear-to-br from-gray-900 via-gray-800 to-black p-5 text-white">
                  <div className="flex flex-col items-center text-center gap-3">
                    {user.profileURL?.url ? (
                      <img
                        src={user.profileURL.url}
                        alt={user.name}
                        className="w-20 h-20 rounded-full border-4 border-white/20 object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/20 shadow-lg">
                        <User className="w-10 h-10 text-white" />
                      </div>
                    )}
                    <div className="w-full">
                      <p className="font-bold text-lg mb-2">
                        {user.name || "User"}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {user.role?.map((role) => (
                          <span
                            key={role}
                            className="text-xs bg-white/90 text-gray-900 px-3 py-1 rounded-full capitalize font-medium shadow-sm"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(100vh-18rem)]">
                  {/* Seller Dashboard Button */}
                  {isSeller && (
                    <div className="p-4 border-b border-gray-100">
                      <button
                        onClick={() => navigate("/seller/dashboard")}
                        className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-navyblue px-4 py-2.5 text-sm rounded-lg transition-all duration-200 font-semibold hover:bg-yellow-400 shadow-md hover:shadow-lg"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Seller Dashboard</span>
                      </button>
                    </div>
                  )}

                  {/* Tab Items Section */}
                  <div className="border-b border-gray-100 pb-2 mb-2">
                    <div className="px-4 py-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Account
                      </p>
                    </div>
                    {tabItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-200 ${
                          activeTab === item.id
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold shadow-sm"
                            : "text-gray-700 hover:bg-gray-50 hover:pl-5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon className="w-5 h-5" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            activeTab === item.id
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Navigation Buttons Section */}
                  <div className="pb-2">
                    <div className="px-4 py-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Quick Links
                      </p>
                    </div>
                    {navigationButtons.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.route)}
                        className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 hover:pl-5 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logout Button - Fixed at Bottom */}
                <div className="border-t border-gray-100 p-4">
                  <button
                    className="w-full flex items-center gap-2.5 text-red-600 hover:bg-red-50 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 font-medium hover:shadow-md"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden fixed bottom-6 right-6 bg-navyblue text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all z-40 hover:scale-110"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              >
                <div
                  className="absolute top-0 left-0 w-80 max-w-[85%] h-full bg-white shadow-2xl flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Mobile Header */}
                  <div className="bg-linear-to-br from-gray-900 via-gray-800 to-black p-5 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">Menu</h3>
                      <button onClick={() => setSidebarOpen(false)}>
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      {user.profileURL?.url ? (
                        <img
                          src={user.profileURL.url}
                          alt={user.name}
                          className="w-16 h-16 rounded-full border-4 border-white/20 object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/20">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-base">
                          {user.name || "User"}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {user.role?.map((role) => (
                            <span
                              key={role}
                              className="text-xs bg-white/90 text-gray-900 px-2 py-0.5 rounded-full capitalize"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seller Dashboard Button - Mobile */}
                  {isSeller && (
                    <div className="p-4 border-b border-gray-100">
                      <button
                        onClick={() => {
                          navigate("/seller/dashboard");
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-navyblue text-white px-4 py-2.5 text-sm rounded-lg transition-all font-semibold hover:bg-blue-700"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Seller Dashboard</span>
                      </button>
                    </div>
                  )}

                  {/* Mobile Tabs Only */}
                  <div className="flex-1 overflow-y-auto py-2">
                    <div className="px-4 py-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Account Sections
                      </p>
                    </div>
                    {tabItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center justify-between px-5 py-3.5 transition-all ${
                          activeTab === item.id
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}

                    <div className="px-4 py-3 mt-4">
                      <p className="text-xs text-gray-500">
                        💡 Use header buttons for Orders, RFQs, Messages & more
                      </p>
                    </div>
                  </div>

                  {/* Mobile Logout */}
                  <div className="border-t border-gray-100 p-4 bg-white">
                    <button
                      className="w-full flex items-center gap-2.5 text-red-600 hover:bg-red-50 px-4 py-2.5 text-sm rounded-lg transition-all font-medium"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && <ProfileInfo user={user} />}
              {activeTab === "addresses" && <AddressManager user={user} />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
