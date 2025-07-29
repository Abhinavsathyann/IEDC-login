import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

// Import IEDC Admin API routes
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./routes/users";

import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./routes/events";

import {
  getDashboardStats,
  getRecentActivities,
  getUpcomingEvents,
} from "./routes/dashboard";

import { login, register, verifyToken, approveUser } from "./routes/auth";

import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  getStudentPortalContent,
  updatePortalSettings,
} from "./routes/content";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ====== IEDC ADMIN API ROUTES ======

  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", register);
  app.get("/api/auth/verify", verifyToken);
  app.post("/api/auth/approve/:id", approveUser);

  // Dashboard routes
  app.get("/api/dashboard/stats", getDashboardStats);
  app.get("/api/dashboard/activities", getRecentActivities);
  app.get("/api/dashboard/upcoming-events", getUpcomingEvents);

  // User management routes
  app.get("/api/users", getUsers);
  app.get("/api/users/:id", getUserById);
  app.post("/api/users", createUser);
  app.put("/api/users/:id", updateUser);
  app.delete("/api/users/:id", deleteUser);

  // Event management routes
  app.get("/api/events", getEvents);
  app.get("/api/events/:id", getEventById);
  app.post("/api/events", createEvent);
  app.put("/api/events/:id", updateEvent);
  app.delete("/api/events/:id", deleteEvent);

  // Content management routes
  app.get("/api/content/resources", getResources);
  app.get("/api/content/resources/:id", getResourceById);
  app.post("/api/content/resources", createResource);
  app.put("/api/content/resources/:id", updateResource);
  app.delete("/api/content/resources/:id", deleteResource);

  app.get("/api/content/notifications", getNotifications);
  app.post("/api/content/notifications", createNotification);
  app.put("/api/content/notifications/:id", updateNotification);
  app.delete("/api/content/notifications/:id", deleteNotification);

  app.get("/api/content/student-portal", getStudentPortalContent);
  app.put("/api/content/portal-settings", updatePortalSettings);

  return app;
}
