import { RequestHandler } from "express";
import { z } from "zod";
import { db } from "../data/database";
import {
  ApiResponse,
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  EventsResponse,
} from "../../shared/api";

// Validation schemas
const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  maxAttendees: z.number().min(1, "Max attendees must be at least 1"),
  category: z.string().min(1, "Category is required"),
  organizerId: z.number().min(1, "Organizer ID is required"),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).optional(),
});

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  date: z.string().min(1).optional(),
  time: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  maxAttendees: z.number().min(1).optional(),
  category: z.string().min(1).optional(),
  organizerId: z.number().min(1).optional(),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).optional(),
  attendees: z.number().min(0).optional(),
  rating: z.number().min(0).max(5).optional(),
});

// Get all events with filters and pagination
export const getEvents: RequestHandler = (req, res) => {
  try {
    console.log("GET /api/events - Query params:", req.query);

    const {
      search,
      status,
      category,
      organizerId,
      page = 1,
      pageSize = 10,
    } = req.query;

    const filters = {
      search: search as string,
      status: status as string,
      category: category as string,
      organizerId: organizerId ? parseInt(organizerId as string) : undefined,
      page: parseInt(page as string),
      pageSize: parseInt(pageSize as string),
    };

    const result = db.getEvents(filters);
    console.log("Events query result:", {
      total: result.total,
      count: result.events.length,
    });

    const response: ApiResponse<EventsResponse> = {
      success: true,
      data: {
        events: result.events,
        total: result.total,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    };

    console.log("Sending events response:", {
      success: response.success,
      eventsCount: response.data.events.length,
      total: response.data.total,
    });

    res.json(response);
  } catch (error) {
    console.error("Error fetching events:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch events",
    };
    res.status(500).json(response);
  }
};

// Get event by ID
export const getEventById: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid event ID",
      };
      return res.status(400).json(response);
    }

    const event = db.getEventById(id);

    if (!event) {
      const response: ApiResponse = {
        success: false,
        error: "Event not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Event> = {
      success: true,
      data: event,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching event:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch event",
    };
    res.status(500).json(response);
  }
};

// Create new event
export const createEvent: RequestHandler = (req, res) => {
  try {
    const validation = createEventSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: validation.error.errors.map((e) => e.message).join(", "),
      };
      return res.status(400).json(response);
    }

    const eventData = validation.data;

    // Verify organizer exists
    const organizer = db.getUserById(eventData.organizerId);
    if (!organizer) {
      const response: ApiResponse = {
        success: false,
        error: "Organizer not found",
      };
      return res.status(400).json(response);
    }

    const newEvent = db.createEvent({
      ...eventData,
      status: eventData.status || "upcoming",
      image: "/placeholder.svg",
    });

    if (!newEvent) {
      const response: ApiResponse = {
        success: false,
        error: "Failed to create event",
      };
      return res.status(500).json(response);
    }

    const response: ApiResponse<Event> = {
      success: true,
      data: newEvent,
      message: "Event created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating event:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to create event",
    };
    res.status(500).json(response);
  }
};

// Update event
export const updateEvent: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid event ID",
      };
      return res.status(400).json(response);
    }

    const validation = updateEventSchema.safeParse(req.body);

    if (!validation.success) {
      const response: ApiResponse = {
        success: false,
        error: "Validation failed",
        message: validation.error.errors.map((e) => e.message).join(", "),
      };
      return res.status(400).json(response);
    }

    const updates = validation.data;

    // Verify organizer exists if updating organizerId
    if (updates.organizerId) {
      const organizer = db.getUserById(updates.organizerId);
      if (!organizer) {
        const response: ApiResponse = {
          success: false,
          error: "Organizer not found",
        };
        return res.status(400).json(response);
      }
      updates.organizer = organizer.name;
    }

    const updatedEvent = db.updateEvent(id, updates);

    if (!updatedEvent) {
      const response: ApiResponse = {
        success: false,
        error: "Event not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Event> = {
      success: true,
      data: updatedEvent,
      message: "Event updated successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Error updating event:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to update event",
    };
    res.status(500).json(response);
  }
};

// Delete event
export const deleteEvent: RequestHandler = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid event ID",
      };
      return res.status(400).json(response);
    }

    const deleted = db.deleteEvent(id);

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: "Event not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: "Event deleted successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Error deleting event:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to delete event",
    };
    res.status(500).json(response);
  }
};
