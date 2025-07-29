import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Events from "./pages/Events";
import PlaceholderPage from "./pages/PlaceholderPage";
import ContentManagement from "./pages/ContentManagement";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import { FileText, BarChart3, Settings, Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Protected Route Components
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <AdminLogin />;
  }

  return <>{children}</>;
};

const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== "student" && user.role !== "faculty")) {
    return <UserLogin />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <Routes>
                <Route
                  path="/"
                  element={
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <AdminLayout>
                      <Users />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <AdminLayout>
                      <Events />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/content"
                  element={
                    <AdminLayout>
                      <ContentManagement />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <AdminLayout>
                      <PlaceholderPage
                        title="Analytics Dashboard"
                        description="View detailed analytics and insights about your IEDC performance."
                        icon={BarChart3}
                      />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <AdminLayout>
                      <PlaceholderPage
                        title="System Settings"
                        description="Configure your IEDC admin panel settings and preferences."
                        icon={Settings}
                      />
                    </AdminLayout>
                  }
                />
              </Routes>
            </ProtectedAdminRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedUserRoute>
              <UserDashboard />
            </ProtectedUserRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
