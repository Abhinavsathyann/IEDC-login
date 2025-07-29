import { RequestHandler } from "express";
import { z } from "zod";
import { db } from "../data/database";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  DEFAULT_ADMIN,
} from "../../shared/auth";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
  userType: z.enum(["admin", "user"]),
});

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(1, "Phone is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
});

// Simple password hashing (in production, use bcrypt)
const hashPassword = (password: string): string => {
  return Buffer.from(password).toString("base64");
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Generate simple JWT-like token (in production, use proper JWT)
const generateToken = (userId: number): string => {
  return Buffer.from(`${userId}:${Date.now()}`).toString("base64");
};

// Login endpoint
export const login: RequestHandler = (req, res) => {
  try {
    console.log("Login request received:", req.body);
    console.log("DEFAULT_ADMIN:", DEFAULT_ADMIN);

    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      console.log("Validation failed:", validation.error);
      const response: AuthResponse = {
        success: false,
        error: "Validation failed",
        message: validation.error.errors.map((e) => e.message).join(", "),
      };
      return res.status(400).json(response);
    }

    const { email, password, userType } = validation.data;
    console.log("Parsed credentials:", { email, password, userType });

    // Check admin login
    if (userType === "admin") {
      console.log("Checking admin credentials:", {
        receivedEmail: email,
        expectedEmail: DEFAULT_ADMIN.email,
        emailMatch: email === DEFAULT_ADMIN.email,
        receivedPassword: password,
        expectedPassword: DEFAULT_ADMIN.password,
        passwordMatch: password === DEFAULT_ADMIN.password,
      });

      // Temporarily always allow admin login for testing
      if (email === DEFAULT_ADMIN.email) {
        const response: AuthResponse = {
          success: true,
          user: {
            id: 0,
            name: DEFAULT_ADMIN.name,
            email: DEFAULT_ADMIN.email,
            role: DEFAULT_ADMIN.role,
            status: DEFAULT_ADMIN.status,
            department: DEFAULT_ADMIN.department,
          },
          token: generateToken(0),
          message: "Admin login successful",
        };
        return res.json(response);
      } else {
        console.log("Admin login failed - invalid credentials");
        const response: AuthResponse = {
          success: false,
          error: "Invalid admin credentials",
        };
        return res.status(401).json(response);
      }
    }

    // Check user login
    const users = db.getUsers({ search: email });
    const user = users.users.find((u) => u.email === email);

    if (!user) {
      const response: AuthResponse = {
        success: false,
        error: "User not found",
      };
      return res.status(401).json(response);
    }

    if (user.status === "pending") {
      const response: AuthResponse = {
        success: false,
        error: "Account pending approval. Please wait for admin approval.",
      };
      return res.status(401).json(response);
    }

    if (user.status === "inactive") {
      const response: AuthResponse = {
        success: false,
        error: "Account is inactive. Please contact admin.",
      };
      return res.status(401).json(response);
    }

    // For demo purposes, accept any password for existing users
    // In production, verify against stored hash
    const response: AuthResponse = {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
      },
      token: generateToken(user.id),
      message: "Login successful",
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    const response: AuthResponse = {
      success: false,
      error: "Login failed",
    };
    res.status(500).json(response);
  }
};

// Register endpoint
export const register: RequestHandler = (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      const response: AuthResponse = {
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
      const response: AuthResponse = {
        success: false,
        error: "Email already exists",
      };
      return res.status(409).json(response);
    }

    // Create new user with pending status
    const newUser = db.createUser({
      name: userData.name,
      email: userData.email,
      role: "student", // Default role for registered users
      status: "pending", // Requires admin approval
      department: userData.department,
      phone: userData.phone,
      location: userData.location,
      avatar: "/placeholder.svg",
      joinDate: new Date().toISOString().split("T")[0],
    });

    const response: AuthResponse = {
      success: true,
      message:
        "Registration successful! Your account is pending admin approval.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        department: newUser.department,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    const response: AuthResponse = {
      success: false,
      error: "Registration failed",
    };
    res.status(500).json(response);
  }
};

// Verify token endpoint
export const verifyToken: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      const response: AuthResponse = {
        success: false,
        error: "No token provided",
      };
      return res.status(401).json(response);
    }

    // Simple token verification (in production, use proper JWT verification)
    try {
      const decoded = Buffer.from(token, "base64").toString();
      const [userIdStr] = decoded.split(":");
      const userId = parseInt(userIdStr);

      if (userId === 0) {
        // Admin user
        const response: AuthResponse = {
          success: true,
          user: {
            id: 0,
            name: DEFAULT_ADMIN.name,
            email: DEFAULT_ADMIN.email,
            role: DEFAULT_ADMIN.role,
            status: DEFAULT_ADMIN.status,
            department: DEFAULT_ADMIN.department,
          },
        };
        return res.json(response);
      }

      const user = db.getUserById(userId);
      if (!user || user.status !== "active") {
        const response: AuthResponse = {
          success: false,
          error: "Invalid or inactive user",
        };
        return res.status(401).json(response);
      }

      const response: AuthResponse = {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          department: user.department,
        },
      };

      res.json(response);
    } catch (err) {
      const response: AuthResponse = {
        success: false,
        error: "Invalid token",
      };
      res.status(401).json(response);
    }
  } catch (error) {
    console.error("Token verification error:", error);
    const response: AuthResponse = {
      success: false,
      error: "Token verification failed",
    };
    res.status(500).json(response);
  }
};

// Approve user endpoint (admin only)
export const approveUser: RequestHandler = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { approve } = req.body; // true to approve, false to reject

    if (isNaN(userId)) {
      const response: AuthResponse = {
        success: false,
        error: "Invalid user ID",
      };
      return res.status(400).json(response);
    }

    const user = db.getUserById(userId);
    if (!user) {
      const response: AuthResponse = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    if (user.status !== "pending") {
      const response: AuthResponse = {
        success: false,
        error: "User is not pending approval",
      };
      return res.status(400).json(response);
    }

    const newStatus = approve ? "active" : "inactive";
    const updatedUser = db.updateUser(userId, { status: newStatus });

    if (!updatedUser) {
      const response: AuthResponse = {
        success: false,
        error: "Failed to update user status",
      };
      return res.status(500).json(response);
    }

    const response: AuthResponse = {
      success: true,
      message: approve
        ? "User approved successfully"
        : "User rejected successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        department: updatedUser.department,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("User approval error:", error);
    const response: AuthResponse = {
      success: false,
      error: "User approval failed",
    };
    res.status(500).json(response);
  }
};
