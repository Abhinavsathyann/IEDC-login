import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  TrendingUp,
  Activity,
  DollarSign,
  UserPlus,
  BarChart3,
  PieChart,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
    { id: "users", icon: Users, label: "Users", badge: "24" },
    { id: "events", icon: Calendar, label: "Events", badge: "8" },
    { id: "content", icon: FileText, label: "Content", badge: null },
    { id: "analytics", icon: BarChart3, label: "Analytics", badge: null },
    { id: "settings", icon: Settings, label: "Settings", badge: null },
  ];

  const statsCards = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "from-blue-500 to-purple-600",
      lightColor: "from-blue-50 to-purple-50",
    },
    {
      title: "Active Events",
      value: "8",
      change: "+3",
      icon: Calendar,
      color: "from-purple-500 to-pink-600",
      lightColor: "from-purple-50 to-pink-50",
    },
    {
      title: "Revenue",
      value: "₹45,680",
      change: "+18%",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      lightColor: "from-green-50 to-emerald-50",
    },
    {
      title: "Growth Rate",
      value: "23.4%",
      change: "+5.2%",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      lightColor: "from-orange-50 to-red-50",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "Created new event",
      time: "2 hours ago",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Updated user profile",
      time: "4 hours ago",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Published blog post",
      time: "6 hours ago",
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      user: "Sarah Wilson",
      action: "Added new member",
      time: "8 hours ago",
      avatar: "/placeholder.svg",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Innovation Workshop",
      date: "Tomorrow",
      status: "confirmed",
      attendees: 45,
    },
    {
      id: 2,
      title: "Startup Pitch Day",
      date: "Dec 15",
      status: "pending",
      attendees: 67,
    },
    {
      id: 3,
      title: "Tech Talk Series",
      date: "Dec 20",
      status: "confirmed",
      attendees: 89,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 z-50 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-purple-100 lg:translate-x-0 lg:static lg:z-auto"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-purple-100">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">KPTC E-IEDC</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </motion.div>
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
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant={
                      activeSection === item.id ? "secondary" : "outline"
                    }
                    className="text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Profile */}
          <div className="p-4 border-t border-purple-100">
            <motion.div
              className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-purple-500 text-white">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@kptciedc.edu</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-40">
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
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeSection}
                </h2>
                <p className="text-gray-500">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-white/50 border-purple-200 focus:border-purple-400"
                />
              </div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Button>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.lightColor} flex items-center justify-center`}
                    >
                      <stat.icon
                        className={`w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}
                      />
                    </div>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activities
                  </h3>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={activity.avatar} />
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.action}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {activity.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upcoming Events
                  </h3>
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="p-4 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {event.title}
                        </h4>
                        <Badge
                          variant={
                            event.status === "confirmed"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{event.date}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {event.attendees} attendees
                        </span>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    User Growth
                  </h3>
                  <PieChart className="w-5 h-5 text-purple-500" />
                </div>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Chart visualization would go here
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Revenue Analytics
                  </h3>
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                </div>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-500">Revenue chart would go here</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
