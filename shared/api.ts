/**
 * Shared code between client and server
 * Useful to share types between client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// ====== IEDC Admin API Types ======

// User Management
export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "faculty" | "student";
  status: "active" | "inactive" | "pending";
  avatar?: string;
  joinDate: string;
  department: string;
  phone: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: "admin" | "faculty" | "student";
  department: string;
  phone: string;
  location: string;
  status?: "active" | "inactive" | "pending";
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

// Event Management
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  attendees: number;
  maxAttendees: number;
  category: string;
  organizer: string;
  organizerId: number;
  rating: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  category: string;
  organizerId: number;
  status?: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: number;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  pageSize: number;
}

// Dashboard Statistics
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  inactiveUsers: number;
  totalEvents: number;
  upcomingEvents: number;
  ongoingEvents: number;
  completedEvents: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface Activity {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  action: string;
  targetType: "user" | "event" | "content" | "system";
  targetId?: number;
  timestamp: string;
}

export interface ActivitiesResponse {
  activities: Activity[];
  total: number;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Query parameters
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface UserFilters extends PaginationParams {
  search?: string;
  role?: string;
  status?: string;
  department?: string;
}

export interface EventFilters extends PaginationParams {
  search?: string;
  status?: string;
  category?: string;
  organizerId?: number;
}
