import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Package,
   Building, 
  ShoppingCart, 
  CreditCard, 
  MessageSquare, 
  FileText, 
  Settings,
  ChevronLeft ,
  LogIn
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

 // Sidebar.js में menuItems बदलें
// Sidebar.jsx में menuItems बदलें
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Sellers', path: '/sellers' },
  { icon: ShoppingBag, label: 'Buyers', path: '/buyers' },
  { icon: Building, label: 'Company', path: '/company' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
  { icon: MessageSquare, label: 'Inquiries', path: '/inquiries' },
  { icon: FileText, label: 'Requests', path: '/requests' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: LogIn, label: 'Login', path: '/login' },
];

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    } flex flex-col h-screen sticky top-0`}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-gray-800">Admin</h2>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 text-gray-600 transition-transform ${
            isCollapsed ? 'rotate-180' : ''
          }`} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}


