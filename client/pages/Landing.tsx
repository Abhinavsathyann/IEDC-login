import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Settings,
  BookOpen,
  Calendar,
  ArrowRight,
  Shield,
  User,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div
        className={
          'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'
        }
      ></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">KPTC E-IEDC</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Innovation & Entrepreneurship Development Cell
            </p>
            <p className="text-lg text-purple-200 mt-2">
              Empowering students and faculty to innovate, create, and succeed
            </p>
          </div>

          {/* Login Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Admin Login */}
            <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Admin Portal
                </h2>
                <p className="text-purple-100 mb-6">
                  Access the admin dashboard to manage users, events, and system
                  settings
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-purple-100 text-sm">
                    <Settings className="w-4 h-4 mr-3" />
                    Manage system settings
                  </div>
                  <div className="flex items-center text-purple-100 text-sm">
                    <Users className="w-4 h-4 mr-3" />
                    User management & approvals
                  </div>
                  <div className="flex items-center text-purple-100 text-sm">
                    <Calendar className="w-4 h-4 mr-3" />
                    Event management
                  </div>
                </div>

                <Link to="/admin-login">
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0"
                    size="lg"
                  >
                    Admin Login
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* User Login */}
            <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Student Portal
                </h2>
                <p className="text-purple-100 mb-6">
                  Access learning resources, events, and innovation programs
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-purple-100 text-sm">
                    <BookOpen className="w-4 h-4 mr-3" />
                    Learning resources
                  </div>
                  <div className="flex items-center text-purple-100 text-sm">
                    <Calendar className="w-4 h-4 mr-3" />
                    Event registration
                  </div>
                  <div className="flex items-center text-purple-100 text-sm">
                    <Users className="w-4 h-4 mr-3" />
                    Innovation programs
                  </div>
                </div>

                <div className="space-y-3">
                  <Link to="/user-login">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                      size="lg"
                    >
                      Student Login
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  <Link to="/register">
                    <Button
                      variant="outline"
                      className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                      size="lg"
                    >
                      New User? Register
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-16">
            <p className="text-purple-200 text-sm">
              © 2025 KPTC E-CELL. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
