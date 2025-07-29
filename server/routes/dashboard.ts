import { RequestHandler } from "express";
import { db } from "../data/database";
import {
  ApiResponse,
  DashboardStats,
  ActivitiesResponse,
} from "../../shared/api";

// Get dashboard statistics
export const getDashboardStats: RequestHandler = (req, res) => {
  try {
    const stats = db.getDashboardStats();

    const response: ApiResponse<DashboardStats> = {
      success: true,
      data: stats,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch dashboard statistics",
    };
    res.status(500).json(response);
  }
};

// Get recent activities
export const getRecentActivities: RequestHandler = (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const activities = db.getActivities(limit);

    const response: ApiResponse<ActivitiesResponse> = {
      success: true,
      data: {
        activities,
        total: activities.length,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching activities:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch activities",
    };
    res.status(500).json(response);
  }
};

// Get upcoming events for dashboard
export const getUpcomingEvents: RequestHandler = (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const result = db.getEvents({
      status: "upcoming",
      page: 1,
      pageSize: limit,
    });

    const response: ApiResponse = {
      success: true,
      data: result.events,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch upcoming events",
    };
    res.status(500).json(response);
  }
};
