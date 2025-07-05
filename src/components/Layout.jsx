import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Users,
  Calendar,
  FileText,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/appointments', label: 'Appointments', icon: FileText },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
  ];

  const patientNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/patient-view', label: 'My Records', icon: User },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : patientNavItems;

  const NavLink = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-blue-100 text-blue-800 font-semibold'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <Icon className="h-5 w-5" />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <div className="flex items-center">
            <span className="text-2xl">🦷</span>
            <span className="ml-2 text-xl font-bold text-blue-800">Dental Center</span>
          </div>
          <button
            className="p-1 text-gray-500 hover:text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>

        <div className="px-4 pb-4 border-t pt-4">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-full p-2">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              className="p-1 text-gray-500 hover:text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-sm text-gray-700">
              Welcome back, <span className="font-semibold">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
