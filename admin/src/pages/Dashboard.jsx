import { 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  UserCheck,
  Clock,
  XCircle,
  DollarSign
} from 'lucide-react';

export default function AdminDashboard() {
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

  // Recent sellers data
  const recentSellers = [
    { name: "ABC Tiles Pvt Ltd", country: "India", status: "Active", date: "2 days ago" },
    { name: "Stone World LLC", country: "UAE", status: "Pending", date: "3 days ago" },
    { name: "Marble House Inc", country: "USA", status: "Active", date: "5 days ago" },
    { name: "Granite Supplies Ltd", country: "UK", status: "Blocked", date: "1 week ago" },
  ];

  // Monthly registration data
  const monthlyData = [
    { month: "Jan", registrations: 12, orders: 45 },
    { month: "Feb", registrations: 18, orders: 67 },
    { month: "Mar", registrations: 25, orders: 89 },
    { month: "Apr", registrations: 20, orders: 72 },
    { month: "May", registrations: 30, orders: 95 },
    { month: "Jun", registrations: 28, orders: 88 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                  <div className="flex items-center mt-3">
                    <span className={`text-sm font-semibold ${
                      stat.changeType === 'increase' ? 'text-green-600' : 
                      stat.changeType === 'decrease' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Monthly Registrations Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Monthly Seller Registrations</h2>
              <p className="text-sm text-gray-600 mt-1">New seller signups over time</p>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between h-64 gap-4">
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
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Seller Status</h2>
          
          {/* Pie Chart Representation */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* Simple donut chart visualization */}
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Active - 60% */}
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
                {/* Pending - 25% */}
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
                {/* Blocked - 15% */}
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
                  <p className="text-3xl font-bold text-gray-900">156</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Active</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">94 (60%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">39 (25%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Blocked</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">23 (15%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Seller Activity</h2>
            <p className="text-sm text-gray-600 mt-1">Latest seller registrations and updates</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            View All
          </button>
        </div>

        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Seller Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentSellers.map((seller, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {seller.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-semibold text-gray-900">{seller.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{seller.country}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      seller.status === 'Active' ? 'bg-green-100 text-green-800' :
                      seller.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {seller.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {seller.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}