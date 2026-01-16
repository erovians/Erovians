import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, updateUser } from "../lib/redux/auth/authSlice";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Settings,
  ChevronRight,
  Check,
  X,
  Edit2,
  ShoppingBag,
  FileText,
  Heart,
  MessageSquare,
  LogOut,
  Package,
  Menu,
  XCircle,
} from "lucide-react";
import Layout from "../components/common/Layout";

const Profile = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const { user, loading, error } = useSelector((state) => state.auth);
  console.log(user);

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

  const sidebarItems = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "rfqs", label: "My RFQs", icon: FileText },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "addresses", label: "Manage Addresses", icon: MapPin },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
                <div className="bg-linear-to-br from-gray-900 via-gray-800 to-black p-6 text-white">
                  <div className="flex flex-col items-center text-center gap-3">
                    {user.profileURL?.url ? (
                      <img
                        src={user.profileURL.url}
                        alt={user.name}
                        className="w-20 h-20 rounded-full border-4 border-white/20 object-cover shadow-xl"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/20 shadow-xl">
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

                {/* Navigation Items */}
                <div className="py-2">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 transition-all duration-200 ${
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:pl-6"
                      }`}
                    >
                      <div className="flex items-center gap-3">
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

                {/* Logout Button */}
                <div className="border-t border-gray-100 p-4">
                  <button className="w-full flex items-center justify-center gap-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl transition-all duration-200 font-medium hover:shadow-md">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              >
                <div
                  className="absolute top-0 left-0 w-80 max-w-[85%] h-full bg-white shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-linear-to-br from-gray-900 via-gray-800 to-black p-6 text-white">
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
                          className="w-16 h-16 rounded-full border-4 border-white/20 object-cover shadow-xl"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/20">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold">{user.name || "User"}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
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

                  <div className="py-2 overflow-y-auto h-[calc(100%-200px)]">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center justify-between px-6 py-4 transition-all ${
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
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4 bg-white">
                    <button className="w-full flex items-center justify-center gap-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl transition-all font-medium">
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <div className="space-y-4 sm:space-y-5">
                  {/* Personal Information */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Personal Information
                      </h2>
                      <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block font-medium">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={user.name?.split(" ")[0] || ""}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block font-medium">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={user.name?.split(" ").slice(1).join(" ") || ""}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    {user.gender && (
                      <div className="mt-5">
                        <label className="text-sm text-gray-600 mb-3 block font-medium">
                          Your Gender
                        </label>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              checked={user.gender === "male"}
                              readOnly
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Male
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              checked={user.gender === "female"}
                              readOnly
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Female
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              checked={user.gender === "others"}
                              readOnly
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Others
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Email Address
                      </h2>
                      <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-3 sm:mt-0" />
                      <input
                        type="email"
                        value={user.email || ""}
                        readOnly
                        className="flex-1 w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm sm:text-base break-all"
                      />
                      {user.isEmailVerified ? (
                        <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold bg-green-50 px-3 py-2.5 rounded-xl whitespace-nowrap shadow-sm">
                          <Check className="w-4 h-4" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-orange-600 text-sm font-semibold bg-orange-50 px-3 py-2.5 rounded-xl whitespace-nowrap shadow-sm">
                          <X className="w-4 h-4" />
                          Not Verified
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Mobile Number
                      </h2>
                      <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-3 sm:mt-0" />
                      <input
                        type="tel"
                        value={user.mobile || "Not provided"}
                        readOnly
                        className="flex-1 w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900"
                      />
                      {user.mobile ? (
                        user.isMobileVerified ? (
                          <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold bg-green-50 px-3 py-2.5 rounded-xl whitespace-nowrap shadow-sm">
                            <Check className="w-4 h-4" />
                            Verified
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-orange-600 text-sm font-semibold bg-orange-50 px-3 py-2.5 rounded-xl whitespace-nowrap shadow-sm">
                            <X className="w-4 h-4" />
                            Not Verified
                          </div>
                        )
                      ) : null}
                    </div>

                    {user.mobile && !user.isMobileVerified && (
                      <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
                        <p className="text-sm text-orange-800 flex items-start gap-2">
                          <Shield className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                          <span>
                            Your mobile number is not verified. Please verify to
                            secure your account.
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  {user.address && Object.keys(user.address).length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                          Address
                        </h2>
                        <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      </div>

                      <div className="space-y-2.5 text-sm text-gray-700">
                        {user.address.name && (
                          <p>
                            <span className="font-semibold text-gray-900">
                              Name:
                            </span>{" "}
                            {user.address.name}
                          </p>
                        )}
                        {user.address.mobile && (
                          <p>
                            <span className="font-semibold text-gray-900">
                              Mobile:
                            </span>{" "}
                            {user.address.mobile}
                          </p>
                        )}
                        {user.address.landmark && (
                          <p>
                            <span className="font-semibold text-gray-900">
                              Landmark:
                            </span>{" "}
                            {user.address.landmark}
                          </p>
                        )}
                        <p>
                          {user.address.city && `${user.address.city}, `}
                          {user.address.state && `${user.address.state}, `}
                          {user.address.country}
                        </p>
                        {user.address.pincode && (
                          <p>
                            <span className="font-semibold text-gray-900">
                              Pincode:
                            </span>{" "}
                            {user.address.pincode}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* FAQs */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
                      FAQs
                    </h2>

                    <div className="space-y-5 text-sm">
                      <div className="pb-5 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 mb-2">
                          What happens when I update my email address (or mobile
                          number)?
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          Your login email id (or mobile number) changes,
                          likewise. You'll receive all account related
                          communication on your updated email address (or mobile
                          number).
                        </p>
                      </div>

                      <div className="pb-5 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 mb-2">
                          When will my account be updated with the new email
                          address (or mobile number)?
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          It happens as soon as you confirm the verification
                          code sent to your email (or mobile) and save the
                          changes.
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900 mb-2">
                          Does my Seller account get affected when I update my
                          email address?
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                          Erovians has a 'single sign-on' policy. Any changes
                          will reflect in your Seller account also.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
                      Account Actions
                    </h2>

                    <div className="space-y-3">
                      <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:bg-blue-50 px-4 py-2 rounded-lg transition-all">
                        Deactivate Account
                      </button>
                      <br />
                      <button className="text-red-600 hover:text-red-700 font-semibold text-sm hover:bg-red-50 px-4 py-2 rounded-lg transition-all">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab !== "profile" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center hover:shadow-xl transition-shadow">
                  <div className="bg-linear-to-br from-gray-100 to-gray-50 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    This section is under development
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
