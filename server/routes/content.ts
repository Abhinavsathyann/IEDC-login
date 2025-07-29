import { RequestHandler } from "express";
import { z } from "zod";
import { contentDb } from "../data/contentDatabase";
import {
  Resource,
  Notification,
  StudentPortalContent,
  CreateResourceRequest,
  UpdateResourceRequest,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  ContentResponse,
} from "../../shared/content";
import { ApiResponse } from "../../shared/api";

// Validation schemas
const createResourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["pdf", "image", "video", "link"]),
  category: z.enum([
    "study_material",
    "announcement",
    "event",
    "notification",
    "gallery",
  ]),
  url: z.string().url("Valid URL is required"),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  priority: z.number().min(1).max(10).optional(),
});

const updateResourceSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  type: z.enum(["pdf", "image", "video", "link"]).optional(),
  category: z
    .enum([
      "study_material",
      "announcement",
      "event",
      "notification",
      "gallery",
    ])
    .optional(),
  url: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  priority: z.number().min(1).max(10).optional(),
  isActive: z.boolean().optional(),
});

const createNotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["info", "warning", "success", "error", "important"]),
  isImportant: z.boolean().optional(),
  targetAudience: z.enum(["all", "students", "faculty"]).optional(),
  expiryDate: z.string().optional(),
});

const updateNotificationSchema = z.object({
  title: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
  type: z.enum(["info", "warning", "success", "error", "important"]).optional(),
  isImportant: z.boolean().optional(),
  targetAudience: z.enum(["all", "students", "faculty"]).optional(),
  expiryDate: z.string().optional(),
  isActive: z.boolean().optional(),
});

// ====== RESOURCE ENDPOINTS ======

export const getResources: RequestHandler = (req, res) => {
  try {
    const { type, category, isActive, page = 1, pageSize = 10 } = req.query;

    const filters = {
      type: type as string,
      category: category as string,
      isActive:
        isActive === "true" ? true : isActive === "false" ? false : undefined,
      page: parseInt(page as string),
      pageSize: parseInt(pageSize as string),
    };

    const result = contentDb.getResources(filters);

    const response: ApiResponse<ContentResponse<Resource>> = {
      success: true,
      data: {
        items: result.resources,
        total: result.total,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching resources:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch resources",
    };
    res.status(500).json(response);
  }
};

export const getResourceById: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid resource ID",
      };
      return res.status(400).json(response);
    }

    const resource = contentDb.getResourceById(id);

    if (!resource) {
      const response: ApiResponse = {
        success: false,
        error: "Resource not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Resource> = {
      success: true,
      data: resource,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching resource:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch resource",
    };
    res.status(500).json(response);
  }
};

export const createResource: RequestHandler = (req, res) => {
  try {
    const validation = createResourceSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: validation.error.errors.map((e) => e.message).join(", "),
      };
      return res.status(400).json(response);
    }

    const resourceData = validation.data;

    const newResource = contentDb.createResource({
      ...resourceData,
      uploadDate: new Date().toISOString().split("T")[0],
      isActive: true,
      priority: resourceData.priority || 1,
      createdBy: 1, // TODO: Get from authenticated user
    });

    const response: ApiResponse<Resource> = {
      success: true,
      data: newResource,
      message: "Resource created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating resource:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to create resource",
    };
    res.status(500).json(response);
  }
};

export const updateResource: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid resource ID",
      };
      return res.status(400).json(response);
    }

    const validation = updateResourceSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: validation.error.errors.map((e) => e.message).join(", "),
      };
      return res.status(400).json(response);
    }

    const updates = validation.data;
    const updatedResource = contentDb.updateResource(id, updates);

    if (!updatedResource) {
      const response: ApiResponse = {
        success: false,
        error: "Resource not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Resource> = {
      success: true,
      data: updatedResource,
      message: "Resource updated successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Error updating resource:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to update resource",
    };
    res.status(500).json(response);
  }
};

export const deleteResource: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid resource ID",
      };
      return res.status(400).json(response);
    }

    const deleted = contentDb.deleteResource(id);

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: "Resource not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: "Resource deleted successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Error deleting resource:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to delete resource",
    };
    res.status(500).json(response);
  }
};

// ====== NOTIFICATION ENDPOINTS ======

export const getNotifications: RequestHandler = (req, res) => {
  try {
    const {
      type,
      isActive,
      isImportant,
      targetAudience,
      page = 1,
      pageSize = 10,
    } = req.query;

    const filters = {
      type: type as string,
      isActive:
        isActive === "true" ? true : isActive === "false" ? false : undefined,
      isImportant:
        isImportant === "true"
          ? true
          : isImportant === "false"
            ? false
            : undefined,
      targetAudience: targetAudience as string,
      page: parseInt(page as string),
      pageSize: parseInt(pageSize as string),
    };

    const result = contentDb.getNotifications(filters);

    const response: ApiResponse<ContentResponse<Notification>> = {
      success: true,
      data: {
        items: result.notifications,
        total: result.total,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch notifications",
    };
    res.status(500).json(response);
  }
};

export const createNotification: RequestHandler = (req, res) => {
  try {
    const validation = createNotificationSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: validation.error.errors.map((e) => e.message).join(", "),
      };
      return res.status(400).json(response);
    }

    const notificationData = validation.data;

    const newNotification = contentDb.createNotification({
      ...notificationData,
      isActive: true,
      isImportant: notificationData.isImportant || false,
      targetAudience: notificationData.targetAudience || "all",
      createdBy: 1, // TODO: Get from authenticated user
    });

    const response: ApiResponse<Notification> = {
      success: true,
      data: newNotification,
      message: "Notification created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating notification:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to create notification",
    };
    res.status(500).json(response);
  }
};

export const updateNotification: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid notification ID",
      };
      return res.status(400).json(response);
    }

    const validation = updateNotificationSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: validation.error.errors.map((e) => e.message).join(", "),
      };
      return res.status(400).json(response);
    }

    const updates = validation.data;
    const updatedNotification = contentDb.updateNotification(id, updates);

    if (!updatedNotification) {
      const response: ApiResponse = {
        success: false,
        error: "Notification not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Notification> = {
      success: true,
      data: updatedNotification,
      message: "Notification updated successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Error updating notification:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to update notification",
    };
    res.status(500).json(response);
  }
};

export const deleteNotification: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid notification ID",
      };
      return res.status(400).json(response);
    }

    const deleted = contentDb.deleteNotification(id);

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: "Notification not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: "Notification deleted successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Error deleting notification:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to delete notification",
    };
    res.status(500).json(response);
  }
};

// ====== STUDENT PORTAL CONTENT ======

export const getStudentPortalContent: RequestHandler = (req, res) => {
  try {
    const content = contentDb.getStudentPortalContent();

    const response: ApiResponse<StudentPortalContent> = {
      success: true,
      data: content,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching student portal content:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch student portal content",
    };
    res.status(500).json(response);
  }
};

export const updatePortalSettings: RequestHandler = (req, res) => {
  try {
    const { welcomeMessage, isMaintenanceMode, maintenanceMessage } = req.body;

    const updatedSettings = contentDb.updatePortalSettings({
      welcomeMessage,
      isMaintenanceMode,
      maintenanceMessage,
    });

    const response: ApiResponse = {
      success: true,
      data: updatedSettings,
      message: "Portal settings updated successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Error updating portal settings:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to update portal settings",
    };
    res.status(500).json(response);
  }
};
