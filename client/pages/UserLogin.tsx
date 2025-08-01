import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login({
        email,
        password,
        userType: "user",
      });

      if (response.success) {
        navigate("/dashboard"); // User dashboard/resources page
      } else {
        setError(response.error || "Login failed");
      }
    } catch (err) {
      setError("Login request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-700">
      <div className="absolute inset-0 bg-black/20"></div>
      <div
        className={
          'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'
        }
      ></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Student Login
              </h1>
              <p className="text-purple-100">Access your learning portal</p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-300 mr-3" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@kptciedc.edu"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder-gray-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center mt-6 space-y-3">
              <Link to="/register">
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create New Account
                </Button>
              </Link>

              <p className="text-purple-200 text-sm">
                Admin access?{" "}
                <Link to="/admin-login" className="text-white hover:underline">
                  Admin Login
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
