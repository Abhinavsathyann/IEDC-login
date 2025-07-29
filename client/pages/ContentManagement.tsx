import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Download,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  Bell,
  Image,
  Video,
  Link,
  AlertCircle,
  Loader2,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Resource {
  id: number;
  title: string;
  description: string;
  type: "pdf" | "image" | "video" | "link";
  category:
    | "study_material"
    | "announcement"
    | "event"
    | "notification"
    | "gallery";
  url: string;
  fileName?: string;
  fileSize?: number;
  uploadDate: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error" | "important";
  isActive: boolean;
  isImportant: boolean;
  targetAudience: "all" | "students" | "faculty";
  expiryDate?: string;
  createdAt: string;
}

const ContentManagement = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Dialog states
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);

  // Form states
  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    type: "pdf" as "pdf" | "image" | "video" | "link",
    category: "study_material" as
      | "study_material"
      | "announcement"
      | "event"
      | "notification"
      | "gallery",
    url: "",
    fileName: "",
    priority: 1,
  });

  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "warning" | "success" | "error" | "important",
    isImportant: false,
    targetAudience: "all" as "all" | "students" | "faculty",
    expiryDate: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [resourcesResponse, notificationsResponse] = await Promise.all([
        fetch("/api/content/resources"),
        fetch("/api/content/notifications"),
      ]);

      if (resourcesResponse.ok) {
        const resourcesData = await resourcesResponse.json();
        if (resourcesData.success) {
          setResources(resourcesData.data.items);
        }
      }

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        if (notificationsData.success) {
          setNotifications(notificationsData.data.items);
        }
      }
    } catch (err) {
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async () => {
    try {
      const response = await fetch("/api/content/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resourceForm),
      });

      const data = await response.json();
      if (data.success) {
        loadData();
        setResourceDialogOpen(false);
        resetResourceForm();
      } else {
        alert(data.error || "Failed to create resource");
      }
    } catch (err) {
      alert("Failed to create resource");
    }
  };

  const handleUpdateResource = async () => {
    if (!editingResource) return;

    try {
      const response = await fetch(
        `/api/content/resources/${editingResource.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resourceForm),
        },
      );

      const data = await response.json();
      if (data.success) {
        loadData();
        setResourceDialogOpen(false);
        setEditingResource(null);
        resetResourceForm();
      } else {
        alert(data.error || "Failed to update resource");
      }
    } catch (err) {
      alert("Failed to update resource");
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const response = await fetch(`/api/content/resources/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        loadData();
      } else {
        alert(data.error || "Failed to delete resource");
      }
    } catch (err) {
      alert("Failed to delete resource");
    }
  };

  const handleToggleResourceStatus = async (resource: Resource) => {
    try {
      const response = await fetch(`/api/content/resources/${resource.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !resource.isActive }),
      });

      const data = await response.json();
      if (data.success) {
        loadData();
      } else {
        alert(data.error || "Failed to update resource status");
      }
    } catch (err) {
      alert("Failed to update resource status");
    }
  };

  const handleCreateNotification = async () => {
    try {
      const response = await fetch("/api/content/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationForm),
      });

      const data = await response.json();
      if (data.success) {
        loadData();
        setNotificationDialogOpen(false);
        resetNotificationForm();
      } else {
        alert(data.error || "Failed to create notification");
      }
    } catch (err) {
      alert("Failed to create notification");
    }
  };

  const handleUpdateNotification = async () => {
    if (!editingNotification) return;

    try {
      const response = await fetch(
        `/api/content/notifications/${editingNotification.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationForm),
        },
      );

      const data = await response.json();
      if (data.success) {
        loadData();
        setNotificationDialogOpen(false);
        setEditingNotification(null);
        resetNotificationForm();
      } else {
        alert(data.error || "Failed to update notification");
      }
    } catch (err) {
      alert("Failed to update notification");
    }
  };

  const handleDeleteNotification = async (id: number) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const response = await fetch(`/api/content/notifications/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        loadData();
      } else {
        alert(data.error || "Failed to delete notification");
      }
    } catch (err) {
      alert("Failed to delete notification");
    }
  };

  const handleToggleNotificationStatus = async (notification: Notification) => {
    try {
      const response = await fetch(
        `/api/content/notifications/${notification.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !notification.isActive }),
        },
      );

      const data = await response.json();
      if (data.success) {
        loadData();
      } else {
        alert(data.error || "Failed to update notification status");
      }
    } catch (err) {
      alert("Failed to update notification status");
    }
  };

  const resetResourceForm = () => {
    setResourceForm({
      title: "",
      description: "",
      type: "pdf",
      category: "study_material",
      url: "",
      fileName: "",
      priority: 1,
    });
  };

  const resetNotificationForm = () => {
    setNotificationForm({
      title: "",
      message: "",
      type: "info",
      isImportant: false,
      targetAudience: "all",
      expiryDate: "",
    });
  };

  const openEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setResourceForm({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      category: resource.category,
      url: resource.url,
      fileName: resource.fileName || "",
      priority: resource.priority,
    });
    setResourceDialogOpen(true);
  };

  const openEditNotification = (notification: Notification) => {
    setEditingNotification(notification);
    setNotificationForm({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isImportant: notification.isImportant,
      targetAudience: notification.targetAudience,
      expiryDate: notification.expiryDate || "",
    });
    setNotificationDialogOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "link":
        return <Link className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "important":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || resource.type === selectedType;
    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const activeResources = resources.filter((r) => r.isActive).length;
  const activeNotifications = notifications.filter((n) => n.isActive).length;
  const importantNotifications = notifications.filter(
    (n) => n.isActive && n.isImportant,
  ).length;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-600" />
            Content Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage student portal content, resources, and notifications
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Study Materials",
            value: resources.filter((r) => r.category === "study_material")
              .length,
            active: resources.filter(
              (r) => r.category === "study_material" && r.isActive,
            ).length,
            color: "from-blue-500 to-purple-600",
            icon: FileText,
          },
          {
            label: "Gallery Items",
            value: resources.filter((r) => r.category === "gallery").length,
            active: resources.filter(
              (r) => r.category === "gallery" && r.isActive,
            ).length,
            color: "from-green-500 to-emerald-600",
            icon: Image,
          },
          {
            label: "Announcements",
            value: resources.filter((r) => r.category === "announcement")
              .length,
            active: resources.filter(
              (r) => r.category === "announcement" && r.isActive,
            ).length,
            color: "from-indigo-500 to-blue-600",
            icon: Bell,
          },
          {
            label: "Notifications",
            value: notifications.length,
            active: activeNotifications,
            color: "from-red-500 to-pink-600",
            icon: AlertCircle,
          },
        ].map((stat, index) => (
          <Card
            key={stat.label}
            className="p-4 bg-white border shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-green-600">Active: {stat.active}</p>
                {stat.active === 0 && (
                  <p className="text-xs text-gray-600 mt-1">⚠️ Needs content</p>
                )}
              </div>
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="study-materials" className="space-y-6">
        <TabsList>
          <TabsTrigger value="study-materials">Study Materials</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="settings">Portal Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="study-materials" className="space-y-6">
          {/* Study Materials Management */}
          <Card className="p-6 bg-white border shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Study Materials Management
                </h3>
                <p className="text-gray-500">
                  Manage PDFs, documents, and educational resources for students
                </p>
              </div>

              <Dialog
                open={resourceDialogOpen}
                onOpenChange={setResourceDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetResourceForm();
                      setResourceForm((prev) => ({
                        ...prev,
                        category: "study_material",
                      }));
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Study Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingResource
                        ? "Edit Study Material"
                        : "Add New Study Material"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingResource
                        ? "Update study material information"
                        : "Add a new educational resource for students"}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={resourceForm.title}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            title: e.target.value,
                          })
                        }
                        placeholder="Study material title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={resourceForm.description}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the study material content"
                      />
                    </div>

                    <div>
                      <Label htmlFor="type">Resource Type</Label>
                      <select
                        id="type"
                        value={resourceForm.type}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            type: e.target.value as any,
                          })
                        }
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="pdf">PDF Document</option>
                        <option value="link">External Link</option>
                        <option value="video">Video Resource</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="url">URL/Link</Label>
                      <Input
                        id="url"
                        value={resourceForm.url}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            url: e.target.value,
                          })
                        }
                        placeholder="https://example.com/study-material.pdf"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fileName">File Name (optional)</Label>
                        <Input
                          id="fileName"
                          value={resourceForm.fileName}
                          onChange={(e) =>
                            setResourceForm({
                              ...resourceForm,
                              fileName: e.target.value,
                            })
                          }
                          placeholder="material.pdf"
                        />
                      </div>

                      <div>
                        <Label htmlFor="priority">Priority (1-10)</Label>
                        <Input
                          id="priority"
                          type="number"
                          min="1"
                          max="10"
                          value={resourceForm.priority}
                          onChange={(e) =>
                            setResourceForm({
                              ...resourceForm,
                              priority: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setResourceDialogOpen(false);
                        setEditingResource(null);
                        resetResourceForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={
                        editingResource
                          ? handleUpdateResource
                          : handleCreateResource
                      }
                    >
                      {editingResource ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Study Materials List */}
            <div className="space-y-4">
              {resources
                .filter((r) => r.category === "study_material")
                .map((resource) => (
                  <div
                    key={resource.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          {getTypeIcon(resource.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {resource.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {resource.type.toUpperCase()}
                            </Badge>
                            {resource.isActive ? (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Priority: {resource.priority}</span>
                            <span>
                              Created:{" "}
                              {new Date(
                                resource.createdAt,
                              ).toLocaleDateString()}
                            </span>
                            {resource.fileSize && (
                              <span>
                                Size: {(resource.fileSize / 1024).toFixed(1)} KB
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => window.open(resource.url, "_blank")}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditResource(resource)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleResourceStatus(resource)}
                          >
                            {resource.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteResource(resource.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              {resources.filter((r) => r.category === "study_material")
                .length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No study materials added yet</p>
                  <p className="text-sm">
                    Click "Add Study Material" to get started
                  </p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          {/* Gallery Management */}
          <Card className="p-6 bg-white border shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Image className="w-5 h-5 text-purple-600" />
                  Gallery Management
                </h3>
                <p className="text-gray-500">
                  Manage photos, images, and visual content for the student
                  portal
                </p>
              </div>

              <Dialog
                open={resourceDialogOpen}
                onOpenChange={setResourceDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetResourceForm();
                      setResourceForm((prev) => ({
                        ...prev,
                        category: "gallery",
                        type: "image",
                      }));
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Gallery Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingResource
                        ? "Edit Gallery Item"
                        : "Add New Gallery Item"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingResource
                        ? "Update gallery item information"
                        : "Add a new image or media to the gallery"}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={resourceForm.title}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            title: e.target.value,
                          })
                        }
                        placeholder="Gallery item title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={resourceForm.description}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the image or media content"
                      />
                    </div>

                    <div>
                      <Label htmlFor="type">Media Type</Label>
                      <select
                        id="type"
                        value={resourceForm.type}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            type: e.target.value as any,
                          })
                        }
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="image">Image/Photo</option>
                        <option value="video">Video</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="url">Media URL</Label>
                      <Input
                        id="url"
                        value={resourceForm.url}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            url: e.target.value,
                          })
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="priority">Display Priority (1-10)</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={resourceForm.priority}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            priority: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setResourceDialogOpen(false);
                        setEditingResource(null);
                        resetResourceForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={
                        editingResource
                          ? handleUpdateResource
                          : handleCreateResource
                      }
                    >
                      {editingResource ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Gallery Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources
                .filter((r) => r.category === "gallery")
                .map((resource) => (
                  <div
                    key={resource.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-purple-300 transition-colors"
                  >
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      {resource.type === "image" ? (
                        <img
                          src={resource.url}
                          alt={resource.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling!.style.display =
                              "flex";
                          }}
                        />
                      ) : (
                        <Video className="w-8 h-8 text-gray-400" />
                      )}
                      <div className="w-full h-full hidden items-center justify-center">
                        <div className="text-center text-gray-400">
                          <Image className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Preview not available</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {resource.title}
                        </h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(resource.url, "_blank")
                              }
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditResource(resource)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleResourceStatus(resource)
                              }
                            >
                              {resource.isActive ? "Hide" : "Show"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteResource(resource.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {resource.type.toUpperCase()}
                          </Badge>
                          {resource.isActive ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Visible
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Hidden
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          Priority: {resource.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {resources.filter((r) => r.category === "gallery").length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No gallery items yet</p>
                <p className="text-sm">
                  Add photos and media to showcase IEDC activities
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          {/* Announcements Management */}
          <Card className="p-6 bg-white border shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-600" />
                  Announcements Management
                </h3>
                <p className="text-gray-500">
                  Manage public announcements and general information for
                  students
                </p>
              </div>

              <Dialog
                open={resourceDialogOpen}
                onOpenChange={setResourceDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetResourceForm();
                      setResourceForm((prev) => ({
                        ...prev,
                        category: "announcement",
                      }));
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingResource
                        ? "Edit Announcement"
                        : "Add New Announcement"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingResource
                        ? "Update announcement information"
                        : "Create a new announcement for students"}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={resourceForm.title}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            title: e.target.value,
                          })
                        }
                        placeholder="Announcement title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Content</Label>
                      <Textarea
                        id="description"
                        value={resourceForm.description}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Announcement content and details"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="type">Announcement Type</Label>
                      <select
                        id="type"
                        value={resourceForm.type}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            type: e.target.value as any,
                          })
                        }
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="link">General Announcement</option>
                        <option value="pdf">PDF Announcement</option>
                        <option value="video">Video Announcement</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="url">Link (optional)</Label>
                      <Input
                        id="url"
                        value={resourceForm.url}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            url: e.target.value,
                          })
                        }
                        placeholder="https://example.com/announcement"
                      />
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority (1-10)</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={resourceForm.priority}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            priority: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setResourceDialogOpen(false);
                        setEditingResource(null);
                        resetResourceForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={
                        editingResource
                          ? handleUpdateResource
                          : handleCreateResource
                      }
                    >
                      {editingResource ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
              {resources
                .filter((r) => r.category === "announcement")
                .map((resource) => (
                  <div
                    key={resource.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Bell className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {resource.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {resource.type.toUpperCase()}
                            </Badge>
                            {resource.isActive ? (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Draft
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Priority: {resource.priority}</span>
                            <span>
                              Created:{" "}
                              {new Date(
                                resource.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {resource.url && (
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(resource.url, "_blank")
                              }
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Link
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => openEditResource(resource)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleResourceStatus(resource)}
                          >
                            {resource.isActive ? "Unpublish" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteResource(resource.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              {resources.filter((r) => r.category === "announcement").length ===
                0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No announcements created yet</p>
                  <p className="text-sm">
                    Create announcements to keep students informed
                  </p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notifications Management */}
          <Card className="p-6 bg-white border shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications Management
                </h3>
                <p className="text-gray-500">
                  Manage announcements and important notices for students
                </p>
              </div>

              <Dialog
                open={notificationDialogOpen}
                onOpenChange={setNotificationDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={resetNotificationForm}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Notification
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingNotification
                        ? "Edit Notification"
                        : "Add New Notification"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingNotification
                        ? "Update notification information"
                        : "Create a new notification for students"}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notif-title">Title</Label>
                      <Input
                        id="notif-title"
                        value={notificationForm.title}
                        onChange={(e) =>
                          setNotificationForm({
                            ...notificationForm,
                            title: e.target.value,
                          })
                        }
                        placeholder="Notification title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={notificationForm.message}
                        onChange={(e) =>
                          setNotificationForm({
                            ...notificationForm,
                            message: e.target.value,
                          })
                        }
                        placeholder="Notification message"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="notif-type">Type</Label>
                        <select
                          id="notif-type"
                          value={notificationForm.type}
                          onChange={(e) =>
                            setNotificationForm({
                              ...notificationForm,
                              type: e.target.value as any,
                            })
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="info">Info</option>
                          <option value="warning">Warning</option>
                          <option value="success">Success</option>
                          <option value="error">Error</option>
                          <option value="important">Important</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="audience">Target Audience</Label>
                        <select
                          id="audience"
                          value={notificationForm.targetAudience}
                          onChange={(e) =>
                            setNotificationForm({
                              ...notificationForm,
                              targetAudience: e.target.value as any,
                            })
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="all">All</option>
                          <option value="students">Students</option>
                          <option value="faculty">Faculty</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="important"
                        checked={notificationForm.isImportant}
                        onChange={(e) =>
                          setNotificationForm({
                            ...notificationForm,
                            isImportant: e.target.checked,
                          })
                        }
                      />
                      <Label htmlFor="important">Mark as Important</Label>
                    </div>

                    <div>
                      <Label htmlFor="expiry">Expiry Date (optional)</Label>
                      <Input
                        id="expiry"
                        type="date"
                        value={notificationForm.expiryDate}
                        onChange={(e) =>
                          setNotificationForm({
                            ...notificationForm,
                            expiryDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setNotificationDialogOpen(false);
                        setEditingNotification(null);
                        resetNotificationForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={
                        editingNotification
                          ? handleUpdateNotification
                          : handleCreateNotification
                      }
                    >
                      {editingNotification ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {notification.title}
                        </h4>
                        <Badge className={getTypeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                        {notification.isImportant && (
                          <Badge className="bg-red-100 text-red-800">
                            Important
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {notification.targetAudience}
                        </Badge>
                        {notification.isActive ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          Created:{" "}
                          {new Date(
                            notification.createdAt,
                          ).toLocaleDateString()}
                        </span>
                        {notification.expiryDate && (
                          <span>
                            Expires:{" "}
                            {new Date(
                              notification.expiryDate,
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openEditNotification(notification)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleNotificationStatus(notification)
                          }
                        >
                          {notification.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            {/* Portal Configuration */}
            <Card className="p-6 bg-white border shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Portal Configuration
              </h3>
              <p className="text-gray-500 mb-6">
                Configure general settings for the student portal
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="welcome">Welcome Message</Label>
                  <Textarea
                    id="welcome"
                    placeholder="Welcome message for students..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="maintenance" />
                  <Label htmlFor="maintenance">Enable Maintenance Mode</Label>
                </div>

                <div>
                  <Label htmlFor="maintenance-msg">Maintenance Message</Label>
                  <Input
                    id="maintenance-msg"
                    placeholder="System under maintenance..."
                  />
                </div>

                <Button className="bg-purple-600 hover:bg-purple-700">
                  Save Portal Settings
                </Button>
              </div>
            </Card>

            {/* Section Management */}
            <Card className="p-6 bg-white border shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MoreHorizontal className="w-5 h-5 text-purple-600" />
                Section Management
              </h3>
              <p className="text-gray-500 mb-6">
                Control which sections are visible on the student portal
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "Study Materials",
                    description: "Educational PDFs, documents, and resources",
                    count: resources.filter(
                      (r) => r.category === "study_material" && r.isActive,
                    ).length,
                    enabled: true,
                  },
                  {
                    name: "Gallery",
                    description: "Photos and media from IEDC activities",
                    count: resources.filter(
                      (r) => r.category === "gallery" && r.isActive,
                    ).length,
                    enabled: true,
                  },
                  {
                    name: "Announcements",
                    description: "General announcements and news",
                    count: resources.filter(
                      (r) => r.category === "announcement" && r.isActive,
                    ).length,
                    enabled: true,
                  },
                  {
                    name: "Notifications",
                    description: "Important notices and alerts",
                    count: notifications.filter((n) => n.isActive).length,
                    enabled: true,
                  },
                ].map((section) => (
                  <div
                    key={section.name}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {section.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {section.count} items
                        </Badge>
                        <input
                          type="checkbox"
                          checked={section.enabled}
                          className="rounded"
                          readOnly
                        />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {section.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Active items: {section.count}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                      >
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Quick Actions
                    </h4>
                    <p className="text-gray-500 text-sm">
                      Manage all sections at once
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Hide All Sections
                    </Button>
                    <Button variant="outline" size="sm">
                      Show All Sections
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      size="sm"
                    >
                      Apply Changes
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Content Statistics */}
            <Card className="p-6 bg-white border shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                Content Overview
              </h3>
              <p className="text-gray-500 mb-6">
                Summary of all content in the system
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      resources.filter((r) => r.category === "study_material")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Study Materials</div>
                  <div className="text-xs text-green-600">
                    {
                      resources.filter(
                        (r) => r.category === "study_material" && r.isActive,
                      ).length
                    }{" "}
                    active
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {resources.filter((r) => r.category === "gallery").length}
                  </div>
                  <div className="text-sm text-gray-600">Gallery Items</div>
                  <div className="text-xs text-green-600">
                    {
                      resources.filter(
                        (r) => r.category === "gallery" && r.isActive,
                      ).length
                    }{" "}
                    visible
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">
                    {
                      resources.filter((r) => r.category === "announcement")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Announcements</div>
                  <div className="text-xs text-green-600">
                    {
                      resources.filter(
                        (r) => r.category === "announcement" && r.isActive,
                      ).length
                    }{" "}
                    published
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {notifications.length}
                  </div>
                  <div className="text-sm text-gray-600">Notifications</div>
                  <div className="text-xs text-green-600">
                    {notifications.filter((n) => n.isActive).length} active
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;
