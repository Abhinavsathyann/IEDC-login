import { RequestHandler } from "express";
import { z } from "zod";
import { db } from "../data/database";
import {
  ApiResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UsersResponse,
} from "../../shared/api";

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  role: z.enum(["admin", "faculty", "student"]),
  department: z.string().min(1, "Department is required"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["active", "inactive", "pending"]).optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "faculty", "student"]).optional(),
  department: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  status: z.enum(["active", "inactive", "pending"]).optional(),
});

// Get all users with filters and pagination
export const getUsers: RequestHandler = (req, res) => {
  try {
    const {
      search,
      role,
      status,
      department,
      page = 1,
      pageSize = 10,
    } = req.query;

    const filters = {
      search: search as string,
      role: role as string,
      status: status as string,
      department: department as string,
      page: parseInt(page as string),
      pageSize: parseInt(pageSize as string),
    };

    const result = db.getUsers(filters);

    const response: ApiResponse<UsersResponse> = {
      success: true,
      data: {
        users: result.users,
        total: result.total,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch users",
    };
    res.status(500).json(response);
  }
};

// Get user by ID
export const getUserById: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid user ID",
      };
      return res.status(400).json(response);
    }

    const user = db.getUserById(id);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch user",
    };
    res.status(500).json(response);
  }
};

// Create new user
export const createUser: RequestHandler = (req, res) => {
  try {
    const validation = createUserSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: validation.error.errors.map((e) => e.message).join(", "),
      };
      return res.status(400).json(response);
    }

    const userData = validation.data;

    // Check if email already exists
    const existingUsers = db.getUsers({ search: userData.email });
    if (existingUsers.users.some((user) => user.email === userData.email)) {
      const response: ApiResponse = {
        success: false,
        error: "Email already exists",
      };
      return res.status(409).json(response);
    }

    const newUser = db.createUser({
      ...userData,
      avatar: "/placeholder.svg",
      joinDate: new Date().toISOString().split("T")[0],
      status: userData.status || "pending",
    });

    const response: ApiResponse<User> = {
      success: true,
      data: newUser,
      message: "User created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating user:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to create user",
    };
    res.status(500).json(response);
  }
};

// Update user
export const updateUser: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid user ID",
      };
      return res.status(400).json(response);
    }

    const validation = updateUserSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: validation.error.errors.map((e) => e.message).join(", "),
      };
      return res.status(400).json(response);
    }

    const updates = validation.data;

    // Check if email already exists (if updating email)
    if (updates.email) {
      const existingUsers = db.getUsers({ search: updates.email });
      if (
        existingUsers.users.some(
          (user) => user.email === updates.email && user.id !== id,
        )
      ) {
        const response: ApiResponse = {
          success: false,
          error: "Email already exists",
        };
        return res.status(409).json(response);
      }
    }

    const updatedUser = db.updateUser(id, updates);

    if (!updatedUser) {
      const response: ApiResponse = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<User> = {
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Error updating user:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to update user",
    };
    res.status(500).json(response);
  }
};

// Delete user
export const deleteUser: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid user ID",
      };
      return res.status(400).json(response);
    }

    const deleted = db.deleteUser(id);

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: "User deleted successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Error deleting user:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to delete user",
    };
    res.status(500).json(response);
  }
};
