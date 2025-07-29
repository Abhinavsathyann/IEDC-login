import {
  Resource,
  Notification,
  StudentPortalContent,
} from "../../shared/content";

class ContentDatabase {
  private resources: Resource[] = [];
  private notifications: Notification[] = [];
  private nextResourceId = 1;
  private nextNotificationId = 1;
  private portalSettings = {
    welcomeMessage:
      "Welcome to KPTC E-IEDC Student Portal! Explore innovation and entrepreneurship resources.",
    isMaintenanceMode: false,
    maintenanceMessage: "",
  };

  constructor() {
    this.seedData();
  }

  // ====== RESOURCE OPERATIONS ======

  getResources(filters?: {
    type?: string;
    category?: string;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  }): { resources: Resource[]; total: number } {
    let filteredResources = [...this.resources];

    // Apply filters
    if (filters?.type) {
      filteredResources = filteredResources.filter(
        (resource) => resource.type === filters.type,
      );
    }

    if (filters?.category) {
      filteredResources = filteredResources.filter(
        (resource) => resource.category === filters.category,
      );
    }

    if (filters?.isActive !== undefined) {
      filteredResources = filteredResources.filter(
        (resource) => resource.isActive === filters.isActive,
      );
    }

    // Sort by priority then by creation date
    filteredResources.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Higher priority first
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = filteredResources.length;

    // Apply pagination
    if (filters?.page && filters?.pageSize) {
      const start = (filters.page - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      filteredResources = filteredResources.slice(start, end);
    }

    return { resources: filteredResources, total };
  }

  getResourceById(id: number): Resource | null {
    return this.resources.find((resource) => resource.id === id) || null;
  }

  createResource(
    resourceData: Omit<Resource, "id" | "createdAt" | "updatedAt">,
  ): Resource {
    const now = new Date().toISOString();
    const resource: Resource = {
      ...resourceData,
      id: this.nextResourceId++,
      createdAt: now,
      updatedAt: now,
    };
    this.resources.push(resource);
    return resource;
  }

  updateResource(id: number, updates: Partial<Resource>): Resource | null {
    const resourceIndex = this.resources.findIndex(
      (resource) => resource.id === id,
    );
    if (resourceIndex === -1) return null;

    const updatedResource = {
      ...this.resources[resourceIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    this.resources[resourceIndex] = updatedResource;
    return updatedResource;
  }

  deleteResource(id: number): boolean {
    const resourceIndex = this.resources.findIndex(
      (resource) => resource.id === id,
    );
    if (resourceIndex === -1) return false;

    this.resources.splice(resourceIndex, 1);
    return true;
  }

  // ====== NOTIFICATION OPERATIONS ======

  getNotifications(filters?: {
    type?: string;
    isActive?: boolean;
    isImportant?: boolean;
    targetAudience?: string;
    page?: number;
    pageSize?: number;
  }): { notifications: Notification[]; total: number } {
    let filteredNotifications = [...this.notifications];

    // Apply filters
    if (filters?.type) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.type === filters.type,
      );
    }

    if (filters?.isActive !== undefined) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.isActive === filters.isActive,
      );
    }

    if (filters?.isImportant !== undefined) {
      filteredNotifications = filteredNotifications.filter(
        (notification) => notification.isImportant === filters.isImportant,
      );
    }

    if (filters?.targetAudience && filters.targetAudience !== "all") {
      filteredNotifications = filteredNotifications.filter(
        (notification) =>
          notification.targetAudience === filters.targetAudience ||
          notification.targetAudience === "all",
      );
    }

    // Filter out expired notifications
    const now = new Date();
    filteredNotifications = filteredNotifications.filter((notification) => {
      if (!notification.expiryDate) return true;
      return new Date(notification.expiryDate) > now;
    });

    // Sort by important first, then by creation date
    filteredNotifications.sort((a, b) => {
      if (a.isImportant !== b.isImportant) {
        return b.isImportant ? 1 : -1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = filteredNotifications.length;

    // Apply pagination
    if (filters?.page && filters?.pageSize) {
      const start = (filters.page - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      filteredNotifications = filteredNotifications.slice(start, end);
    }

    return { notifications: filteredNotifications, total };
  }

  getNotificationById(id: number): Notification | null {
    return (
      this.notifications.find((notification) => notification.id === id) || null
    );
  }

  createNotification(
    notificationData: Omit<Notification, "id" | "createdAt" | "updatedAt">,
  ): Notification {
    const now = new Date().toISOString();
    const notification: Notification = {
      ...notificationData,
      id: this.nextNotificationId++,
      createdAt: now,
      updatedAt: now,
    };
    this.notifications.push(notification);
    return notification;
  }

  updateNotification(
    id: number,
    updates: Partial<Notification>,
  ): Notification | null {
    const notificationIndex = this.notifications.findIndex(
      (notification) => notification.id === id,
    );
    if (notificationIndex === -1) return null;

    const updatedNotification = {
      ...this.notifications[notificationIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    this.notifications[notificationIndex] = updatedNotification;
    return updatedNotification;
  }

  deleteNotification(id: number): boolean {
    const notificationIndex = this.notifications.findIndex(
      (notification) => notification.id === id,
    );
    if (notificationIndex === -1) return false;

    this.notifications.splice(notificationIndex, 1);
    return true;
  }

  // ====== STUDENT PORTAL CONTENT ======

  getStudentPortalContent(): StudentPortalContent {
    const activeNotifications = this.getNotifications({
      isActive: true,
      targetAudience: "students",
    }).notifications;

    const importantNotices = activeNotifications.filter((n) => n.isImportant);
    const announcements = activeNotifications.filter((n) => !n.isImportant);

    const studyMaterials = this.getResources({
      category: "study_material",
      isActive: true,
    }).resources;

    const gallery = this.getResources({
      category: "gallery",
      isActive: true,
    }).resources;

    const quickLinks = this.getResources({
      type: "link",
      isActive: true,
    }).resources;

    return {
      welcomeMessage: this.portalSettings.welcomeMessage,
      importantNotices,
      announcements,
      studyMaterials,
      gallery,
      quickLinks,
      isMaintenanceMode: this.portalSettings.isMaintenanceMode,
      maintenanceMessage: this.portalSettings.maintenanceMessage,
    };
  }

  updatePortalSettings(settings: {
    welcomeMessage?: string;
    isMaintenanceMode?: boolean;
    maintenanceMessage?: string;
  }) {
    this.portalSettings = {
      ...this.portalSettings,
      ...settings,
    };
    return this.portalSettings;
  }

  // ====== SEED DATA ======

  private seedData(): void {
    // Seed notifications
    const sampleNotifications: Omit<
      Notification,
      "id" | "createdAt" | "updatedAt"
    >[] = [
      {
        title: "Important: Semester Registration Open",
        message:
          "Registration for the new semester is now open. Please complete your registration by December 30th.",
        type: "important",
        isActive: true,
        isImportant: true,
        targetAudience: "students",
        expiryDate: "2024-12-30",
        createdBy: 1,
      },
      {
        title: "Innovation Workshop - Register Now",
        message:
          "Join our innovation workshop on December 15th. Limited seats available!",
        type: "info",
        isActive: true,
        isImportant: false,
        targetAudience: "all",
        expiryDate: "2024-12-15",
        createdBy: 1,
      },
      {
        title: "Library Maintenance Notice",
        message:
          "The library will be closed for maintenance on December 12th from 9 AM to 2 PM.",
        type: "warning",
        isActive: true,
        isImportant: false,
        targetAudience: "students",
        expiryDate: "2024-12-12",
        createdBy: 1,
      },
    ];

    sampleNotifications.forEach((notification) =>
      this.createNotification(notification),
    );

    // Seed resources
    const sampleResources: Omit<Resource, "id" | "createdAt" | "updatedAt">[] =
      [
        {
          title: "Innovation Fundamentals Guide",
          description:
            "Complete guide to understanding innovation and entrepreneurship basics",
          type: "pdf",
          category: "study_material",
          url: "/resources/innovation-guide.pdf",
          fileName: "innovation-guide.pdf",
          fileSize: 2048000,
          uploadDate: "2024-11-01",
          isActive: true,
          priority: 5,
          createdBy: 1,
        },
        {
          title: "Startup Business Plan Template",
          description: "Professional template for creating business plans",
          type: "pdf",
          category: "study_material",
          url: "/resources/business-plan-template.pdf",
          fileName: "business-plan-template.pdf",
          fileSize: 1024000,
          uploadDate: "2024-11-05",
          isActive: true,
          priority: 4,
          createdBy: 1,
        },
        {
          title: "IEDC Innovation Lab",
          description: "Virtual tour of our innovation laboratory",
          type: "image",
          category: "gallery",
          url: "/images/innovation-lab.jpg",
          fileName: "innovation-lab.jpg",
          fileSize: 512000,
          uploadDate: "2024-11-10",
          isActive: true,
          priority: 3,
          createdBy: 1,
        },
        {
          title: "Student Projects Showcase",
          description: "Gallery of innovative student projects",
          type: "image",
          category: "gallery",
          url: "/images/student-projects.jpg",
          fileName: "student-projects.jpg",
          fileSize: 768000,
          uploadDate: "2024-11-15",
          isActive: true,
          priority: 3,
          createdBy: 1,
        },
        {
          title: "Kerala Startup Mission",
          description: "Official website of Kerala Startup Mission",
          type: "link",
          category: "study_material",
          url: "https://startupmission.kerala.gov.in",
          uploadDate: "2024-11-20",
          isActive: true,
          priority: 2,
          createdBy: 1,
        },
      ];

    sampleResources.forEach((resource) => this.createResource(resource));
  }
}

// Singleton instance
export const contentDb = new ContentDatabase();
