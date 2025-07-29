/**
 * Content Management API types
 */

export interface Resource {
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
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error" | "important";
  isActive: boolean;
  isImportant: boolean;
  targetAudience: "all" | "students" | "faculty";
  expiryDate?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentPortalContent {
  welcomeMessage: string;
  importantNotices: Notification[];
  announcements: Notification[];
  studyMaterials: Resource[];
  gallery: Resource[];
  quickLinks: Resource[];
  isMaintenanceMode: boolean;
  maintenanceMessage?: string;
}

export interface CreateResourceRequest {
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
  priority?: number;
}

export interface UpdateResourceRequest extends Partial<CreateResourceRequest> {
  id: number;
  isActive?: boolean;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error" | "important";
  isImportant?: boolean;
  targetAudience?: "all" | "students" | "faculty";
  expiryDate?: string;
}

export interface UpdateNotificationRequest
  extends Partial<CreateNotificationRequest> {
  id: number;
  isActive?: boolean;
}

export interface ContentFilters {
  type?: string;
  category?: string;
  isActive?: boolean;
  targetAudience?: string;
  page?: number;
  pageSize?: number;
}

export interface ContentResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
