import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  Users,
  Download,
  Play,
  Clock,
  Star,
  Award,
  TrendingUp,
  FileText,
  Video,
  ExternalLink,
  User,
  LogOut,
  Bell,
  AlertCircle,
  Loader2,
  Image,
  Link,
  Eye,
} from "lucide-react";

interface Resource {
  id: number;
  title: string;
  description: string;
  type: "pdf" | "image" | "video" | "link";
  category: string;
  url: string;
  fileName?: string;
  fileSize?: number;
  uploadDate: string;
  priority: number;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error" | "important";
  isImportant: boolean;
  targetAudience: string;
  expiryDate?: string;
  createdAt: string;
}

interface StudentPortalContent {
  welcomeMessage: string;
  importantNotices: Notification[];
  announcements: Notification[];
  studyMaterials: Resource[];
  gallery: Resource[];
  quickLinks: Resource[];
  isMaintenanceMode: boolean;
  maintenanceMessage?: string;
}

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [content, setContent] = useState<StudentPortalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPortalContent();
  }, []);

  const loadPortalContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/content/student-portal");
      const data = await response.json();

      if (data.success) {
        setContent(data.data);
      } else {
        setError(data.error || "Failed to load portal content");
      }
    } catch (err) {
      setError("Failed to load portal content");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "link":
        return <Link className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "important":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "success":
        return <AlertCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "important":
        return "border-l-red-500 bg-red-50";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50";
      case "success":
        return "border-l-green-500 bg-green-50";
      case "error":
        return "border-l-red-500 bg-red-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading portal...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Portal
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadPortalContent}>Try Again</Button>
        </Card>
      </div>
    );
  }

  if (content?.isMaintenanceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Maintenance Mode
          </h2>
          <p className="text-gray-600 mb-4">
            {content.maintenanceMessage ||
              "The student portal is currently under maintenance. Please check back later."}
          </p>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-40">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">KPTC E-IEDC</h1>
              <p className="text-sm text-gray-500">Student Portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {content?.importantNotices.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </Button>

            <div className="flex items-center space-x-3 px-4 py-2 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.department}</p>
              </div>
            </div>

            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-purple-100 mb-6">
            {content?.welcomeMessage ||
              "Continue your innovation journey with KPTC E-IEDC resources and programs"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Study Materials</p>
              <p className="text-2xl font-bold">
                {content?.studyMaterials.length || 0}
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <Bell className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Notifications</p>
              <p className="text-2xl font-bold">
                {content?.announcements.length || 0}
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <Image className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Gallery Items</p>
              <p className="text-2xl font-bold">
                {content?.gallery.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Important Notices */}
        {content?.importantNotices && content.importantNotices.length > 0 && (
          <Card className="p-6 bg-white border shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
              Important Notices
            </h3>
            <div className="space-y-3">
              {content.importantNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={`p-4 rounded-lg border-l-4 ${getNotificationColor(notice.type)}`}
                >
                  <div className="flex items-start">
                    {getNotificationIcon(notice.type)}
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-gray-900">
                        {notice.title}
                      </h4>
                      <p className="text-gray-700 text-sm mt-1">
                        {notice.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notice.createdAt).toLocaleDateString()}
                        {notice.expiryDate &&
                          ` • Expires: ${new Date(notice.expiryDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Study Materials */}
            <Card className="p-6 bg-white border shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Study Materials
                </h3>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>

              <div className="grid gap-4">
                {content?.studyMaterials?.slice(0, 4).map((material) => (
                  <div
                    key={material.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        {getTypeIcon(material.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {material.title}
                          </h4>
                          <Badge variant="outline">
                            {material.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {material.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(
                                material.uploadDate,
                              ).toLocaleDateString()}
                            </div>
                            {material.fileSize && (
                              <div className="flex items-center">
                                <Download className="w-4 h-4 mr-1" />
                                {formatFileSize(material.fileSize)}
                              </div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => window.open(material.url, "_blank")}
                          >
                            {material.type === "link" ? "Visit" : "Download"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Gallery */}
            {content?.gallery && content.gallery.length > 0 && (
              <Card className="p-6 bg-white border shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {content.gallery.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="relative group cursor-pointer"
                    >
                      <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-white border-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-2 truncate">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Announcements */}
            {content?.announcements && content.announcements.length > 0 && (
              <Card className="p-6 bg-white border shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Announcements
                </h3>
                <div className="space-y-4">
                  {content.announcements.slice(0, 5).map((announcement) => (
                    <div
                      key={announcement.id}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {announcement.title}
                        </h4>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {announcement.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {announcement.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Quick Links */}
            {content?.quickLinks && content.quickLinks.length > 0 && (
              <Card className="p-6 bg-white border shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  {content.quickLinks.map((link) => (
                    <Button
                      key={link.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(link.url, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {link.title}
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {/* User Progress */}
            <Card className="p-6 bg-white border shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Learning Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Resources Accessed</span>
                    <span>60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Community Engagement</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
