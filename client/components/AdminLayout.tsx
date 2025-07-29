import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  BarChart3,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const sidebarItems = [
    {
      id: "dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      label: "Dashboard",
      badge: null,
    },
    {
      id: "users",
      path: "/admin/users",
      icon: Users,
      label: "Users",
      badge: "24",
    },
    {
      id: "events",
      path: "/admin/events",
      icon: Calendar,
      label: "Events",
      badge: "8",
    },
    {
      id: "content",
      path: "/admin/content",
      icon: FileText,
      label: "Content",
      badge: null,
    },
    {
      id: "analytics",
      path: "/admin/analytics",
      icon: BarChart3,
      label: "Analytics",
      badge: null,
    },
    {
      id: "settings",
      path: "/admin/settings",
      icon: Settings,
      label: "Settings",
      badge: null,
    },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white border-r border-purple-100 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-auto`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">KPTC E-IEDC</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link key={item.id} to={item.path}>
                <div
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                    isActiveRoute(item.path)
                      ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        isActiveRoute(item.path)
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </nav>

          {/* Profile */}
          <div className="p-4 border-t border-purple-100">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "AD"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "admin@kptciedc.edu"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-400 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <header className="bg-white border-b border-purple-100 sticky top-0 z-40">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-white border-purple-200 focus:border-purple-400"
                />
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-80px)]">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
