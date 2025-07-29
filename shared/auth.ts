/**
 * Authentication related types
 */

export interface LoginRequest {
  email: string;
  password: string;
  userType: "admin" | "user";
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  location: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    role: "admin" | "faculty" | "student";
    status: "active" | "inactive" | "pending";
    department: string;
  };
  token?: string;
  error?: string;
  message?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "faculty" | "student";
  status: "active" | "inactive" | "pending";
  department: string;
}

// Default admin credentials
export const DEFAULT_ADMIN = {
  email: "admin@kptciedc.edu",
  password: "admin123",
  name: "Admin User",
  role: "admin" as const,
  status: "active" as const,
  department: "Administration",
};
