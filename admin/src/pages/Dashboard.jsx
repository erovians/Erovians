

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../lib/redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  UserCheck,
  Clock,
  DollarSign,
  Maximize,
  Minimize
} from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen functionality
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

 useEffect(() => {
  const handleFullscreenChange = () => {
    console.log("fullscreen changed");
  };

  document.addEventListener("fullscreenchange", handleFullscreenChange);

  return () => {
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
  };
}, []);


    // Listen for fullscreen changes
  //   const handleFullscreenChange = () => {
  //     setIsFullscreen(!!document.fullscreenElement);
  //   };

  //   document.addEventListener('fullscreenchange', handleFullscreenChange);

  //   return () => {
  //     document.removeEventListener('fullscreenchange', handleFullscreenChange);
  //   };
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    // dispatch(loadUser());
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Stats data
  const stats = [
    {
      title: "Total Sellers",
      value: "156",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Active Sellers",
      value: "124",
      change: "+8%",
      changeType: "increase",
      icon: UserCheck,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Pending Approvals",
      value: "18",
      change: "+5",
      changeType: "neutral",
      icon: Clock,
      color: "yellow",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      title: "Total Revenue",
      value: "₹84,50,000",
      change: "+23%",
      changeType: "increase",
      icon: DollarSign,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  const recentSellers = [
    { name: "ABC Tiles Pvt Ltd", country: "India", status: "Active", date: "2 days ago" },
    { name: "Stone World LLC", country: "UAE", status: "Pending", date: "3 days ago" },
    { name: "Marble House Inc", country: "USA", status: "Active", date: "5 days ago" },
    { name: "Granite Supplies Ltd", country: "UK", status: "Blocked", date: "1 week ago" },
  ];

  const monthlyData = [
    { month: "Jan", registrations: 12 },
    { month: "Feb", registrations: 18 },
    { month: "Mar", registrations: 25 },
    { month: "Apr", registrations: 20 },
    { month: "May", registrations: 30 },
    { month: "Jun", registrations: 28 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Welcome, {user?.name || "Admin"}
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{stat.title}</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2 truncate">
                    {stat.value}
                  </h3>
                  <div className="flex items-center mt-2 sm:mt-3">
                    <span className={`text-xs sm:text-sm font-semibold ${
                      stat.changeType === 'increase' ? 'text-green-600' : 
                      stat.changeType === 'decrease' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ml-2`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        
        {/* Monthly Registrations Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
            Monthly Seller Registrations
          </h2>
          
          <div className="flex items-end justify-between h-48 sm:h-64 gap-2 sm:gap-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center gap-2 mb-2">
                  <div 
                    className="w-full bg-indigo-500 rounded-t-lg hover:bg-indigo-600 transition-colors relative group"
                    style={{ height: `${(data.registrations / 30) * 200}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.registrations} sellers
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 font-medium mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Seller Status</h2>
          
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="relative w-36 h-36 sm:w-48 sm:h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="#22c55e" 
                  strokeWidth="20" 
                  strokeDasharray="150.8 251.2" 
                  strokeDashoffset="0" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="#eab308" 
                  strokeWidth="20" 
                  strokeDasharray="62.8 339.2" 
                  strokeDashoffset="-150.8" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="#ef4444" 
                  strokeWidth="20" 
                  strokeDasharray="37.7 364.3" 
                  strokeDashoffset="-213.6" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">156</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs sm:text-sm text-gray-700">Active</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">94 (60%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs sm:text-sm text-gray-700">Pending</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">39 (25%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs sm:text-sm text-gray-700">Blocked</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">23 (15%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
          Recent Seller Activity
        </h2>

        {/* Mobile View - Cards */}
        <div className="block lg:hidden space-y-3">
          {recentSellers.map((seller, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {seller.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{seller.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{seller.country}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                      seller.status === 'Active' ? 'bg-green-100 text-green-800' :
                      seller.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {seller.status}
                    </span>
                    <span className="text-xs text-gray-500">{seller.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Seller Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentSellers.map((seller, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {seller.name.charAt(0)}
                      </div>
                      <p className="ml-4 text-sm font-semibold text-gray-900">{seller.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{seller.country}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                      seller.status === 'Active' ? 'bg-green-100 text-green-800' :
                      seller.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {seller.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{seller.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;