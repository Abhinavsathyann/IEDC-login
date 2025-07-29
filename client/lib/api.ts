import {
  ApiResponse,
  User,
  Event,
  DashboardStats,
  ActivitiesResponse,
  UsersResponse,
  EventsResponse,
  CreateUserRequest,
  UpdateUserRequest,
  CreateEventRequest,
  UpdateEventRequest,
  UserFilters,
  EventFilters,
} from "@shared/api";

const API_BASE = "/api";

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      } catch {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    return response.json();
  } catch (error) {
    // If it's a network error or fetch failed
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Network error: Unable to connect to server. Please check if the server is running.",
      );
    }
    throw error;
  }
}

// ====== DASHBOARD API ======

export const dashboardApi = {
  getStats: () => apiRequest<DashboardStats>("/dashboard/stats"),
  getRecentActivities: (limit = 10) =>
    apiRequest<ActivitiesResponse>(`/dashboard/activities?limit=${limit}`),
  getUpcomingEvents: (limit = 5) =>
    apiRequest<Event[]>(`/dashboard/upcoming-events?limit=${limit}`),
};

// ====== USERS API ======

export const usersApi = {
  getUsers: (filters: UserFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.role) params.append("role", filters.role);
    if (filters.status) params.append("status", filters.status);
    if (filters.department) params.append("department", filters.department);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.pageSize)
      params.append("pageSize", filters.pageSize.toString());

    const query = params.toString();
    return apiRequest<UsersResponse>(`/users${query ? `?${query}` : ""}`);
  },

  getUserById: (id: number) => apiRequest<User>(`/users/${id}`),

  createUser: (userData: CreateUserRequest) =>
    apiRequest<User>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  updateUser: (id: number, updates: Partial<UpdateUserRequest>) =>
    apiRequest<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  deleteUser: (id: number) =>
    apiRequest(`/users/${id}`, {
      method: "DELETE",
    }),
};

// ====== EVENTS API ======

export const eventsApi = {
  getEvents: (filters: EventFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.category) params.append("category", filters.category);
    if (filters.organizerId)
      params.append("organizerId", filters.organizerId.toString());
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.pageSize)
      params.append("pageSize", filters.pageSize.toString());

    const query = params.toString();
    return apiRequest<EventsResponse>(`/events${query ? `?${query}` : ""}`);
  },

  getEventById: (id: number) => apiRequest<Event>(`/events/${id}`),

  createEvent: (eventData: CreateEventRequest) =>
    apiRequest<Event>("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    }),

  updateEvent: (id: number, updates: Partial<UpdateEventRequest>) =>
    apiRequest<Event>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  deleteEvent: (id: number) =>
    apiRequest(`/events/${id}`, {
      method: "DELETE",
    }),
};

// ====== ERROR HANDLING ======

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: ApiResponse,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  if (error instanceof ApiError) {
    return error.response?.error || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};
