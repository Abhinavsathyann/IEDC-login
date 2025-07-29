import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardApi, handleApiError } from "@/lib/api";
import { DashboardStats, Activity, Event } from "@shared/api";
import {
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, activitiesResponse, eventsResponse] =
        await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentActivities(4),
          dashboardApi.getUpcomingEvents(3),
        ]);

      if (statsResponse.success) {
        setStats(statsResponse.data!);
      }

      if (activitiesResponse.success) {
        setActivities(activitiesResponse.data!.activities);
      }

      if (eventsResponse.success) {
        setUpcomingEvents(eventsResponse.data!);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-red-800 font-medium">Error loading dashboard</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <Button
            onClick={loadDashboardData}
            variant="outline"
            size="sm"
            className="ml-auto"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers?.toString() || "0",
      change: "+12%",
      icon: Users,
      color: "from-blue-500 to-purple-600",
      lightColor: "from-blue-50 to-purple-50",
    },
    {
      title: "Active Events",
      value: stats?.upcomingEvents?.toString() || "0",
      change: `+${stats?.ongoingEvents || 0}`,
      icon: Calendar,
      color: "from-purple-500 to-pink-600",
      lightColor: "from-purple-50 to-pink-50",
    },
    {
      title: "Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString() || "0"}`,
      change: "+18%",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      lightColor: "from-green-50 to-emerald-50",
    },
    {
      title: "Growth Rate",
      value: `${stats?.monthlyGrowth || 0}%`,
      change: "+5.2%",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      lightColor: "from-orange-50 to-red-50",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <Button onClick={loadDashboardData} variant="outline" size="sm">
          <TrendingUp className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={stat.title}
            className="p-6 bg-white border shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.lightColor} flex items-center justify-center`}
              >
                <stat.icon
                  className={`w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}
                />
              </div>
              <span className="text-green-600 text-sm border border-green-200 bg-green-50 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white border shadow-lg">
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
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-sm font-medium">
                      {activity.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.userName}
                      </p>
                      <p className="text-sm text-gray-500">{activity.action}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No recent activities</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <Card className="p-6 bg-white border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Events
              </h3>
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {event.title}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          event.status === "confirmed" ||
                          event.status === "upcoming"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(event.date).toLocaleDateString()} at{" "}
                      {event.time}
                    </p>
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
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No upcoming events</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.activeUsers}
              </p>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
          </Card>
          <Card className="p-4 bg-white border">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.completedEvents}
              </p>
              <p className="text-sm text-gray-500">Completed Events</p>
            </div>
          </Card>
          <Card className="p-4 bg-white border">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pendingUsers}
              </p>
              <p className="text-sm text-gray-500">Pending Users</p>
            </div>
          </Card>
          <Card className="p-4 bg-white border">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {stats.ongoingEvents}
              </p>
              <p className="text-sm text-gray-500">Ongoing Events</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
