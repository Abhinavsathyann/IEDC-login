import { User, Event, Activity } from "../../shared/api";

// In-memory database - replace with real database in production
class Database {
  private users: User[] = [];
  private events: Event[] = [];
  private activities: Activity[] = [];
  private nextUserId = 1;
  private nextEventId = 1;
  private nextActivityId = 1;

  constructor() {
    this.seedData();
  }

  // ====== USER OPERATIONS ======

  getUsers(filters?: {
    search?: string;
    role?: string;
    status?: string;
    department?: string;
    page?: number;
    pageSize?: number;
  }): { users: User[]; total: number } {
    let filteredUsers = [...this.users];

    // Apply filters
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.department.toLowerCase().includes(search),
      );
    }

    if (filters?.role && filters.role !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) => user.role === filters.role,
      );
    }

    if (filters?.status && filters.status !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) => user.status === filters.status,
      );
    }

    if (filters?.department && filters.department !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) => user.department === filters.department,
      );
    }

    const total = filteredUsers.length;

    // Apply pagination
    if (filters?.page && filters?.pageSize) {
      const start = (filters.page - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      filteredUsers = filteredUsers.slice(start, end);
    }

    return { users: filteredUsers, total };
  }

  getUserById(id: number): User | null {
    return this.users.find((user) => user.id === id) || null;
  }

  createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const now = new Date().toISOString();
    const user: User = {
      ...userData,
      id: this.nextUserId++,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);

    // Log activity
    this.logActivity(
      user.id,
      user.name,
      `Created new user account`,
      "user",
      user.id,
    );

    return user;
  }

  updateUser(id: number, updates: Partial<User>): User | null {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;

    const updatedUser = {
      ...this.users[userIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    this.users[userIndex] = updatedUser;

    // Log activity
    this.logActivity(id, updatedUser.name, `Updated user profile`, "user", id);

    return updatedUser;
  }

  deleteUser(id: number): boolean {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return false;

    const user = this.users[userIndex];
    this.users.splice(userIndex, 1);

    // Log activity
    this.logActivity(1, "Admin", `Deleted user ${user.name}`, "user", id);

    return true;
  }

  // ====== EVENT OPERATIONS ======

  getEvents(filters?: {
    search?: string;
    status?: string;
    category?: string;
    organizerId?: number;
    page?: number;
    pageSize?: number;
  }): { events: Event[]; total: number } {
    let filteredEvents = [...this.events];

    // Apply filters
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(search) ||
          event.description.toLowerCase().includes(search) ||
          event.organizer.toLowerCase().includes(search),
      );
    }

    if (filters?.status && filters.status !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.status === filters.status,
      );
    }

    if (filters?.category && filters.category !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.category.toLowerCase() === filters.category.toLowerCase(),
      );
    }

    if (filters?.organizerId) {
      filteredEvents = filteredEvents.filter(
        (event) => event.organizerId === filters.organizerId,
      );
    }

    const total = filteredEvents.length;

    // Apply pagination
    if (filters?.page && filters?.pageSize) {
      const start = (filters.page - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      filteredEvents = filteredEvents.slice(start, end);
    }

    return { events: filteredEvents, total };
  }

  getEventById(id: number): Event | null {
    return this.events.find((event) => event.id === id) || null;
  }

  createEvent(
    eventData: Omit<
      Event,
      "id" | "attendees" | "rating" | "organizer" | "createdAt" | "updatedAt"
    >,
  ): Event | null {
    const organizer = this.getUserById(eventData.organizerId);
    if (!organizer) return null;

    const now = new Date().toISOString();
    const event: Event = {
      ...eventData,
      id: this.nextEventId++,
      attendees: 0,
      rating: 0,
      organizer: organizer.name,
      createdAt: now,
      updatedAt: now,
    };
    this.events.push(event);

    // Log activity
    this.logActivity(
      organizer.id,
      organizer.name,
      `Created new event: ${event.title}`,
      "event",
      event.id,
    );

    return event;
  }

  updateEvent(id: number, updates: Partial<Event>): Event | null {
    const eventIndex = this.events.findIndex((event) => event.id === id);
    if (eventIndex === -1) return null;

    const updatedEvent = {
      ...this.events[eventIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    this.events[eventIndex] = updatedEvent;

    // Log activity
    this.logActivity(
      1,
      "Admin",
      `Updated event: ${updatedEvent.title}`,
      "event",
      id,
    );

    return updatedEvent;
  }

  deleteEvent(id: number): boolean {
    const eventIndex = this.events.findIndex((event) => event.id === id);
    if (eventIndex === -1) return false;

    const event = this.events[eventIndex];
    this.events.splice(eventIndex, 1);

    // Log activity
    this.logActivity(1, "Admin", `Deleted event: ${event.title}`, "event", id);

    return true;
  }

  // ====== ACTIVITY OPERATIONS ======

  getActivities(limit = 10): Activity[] {
    return this.activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, limit);
  }

  logActivity(
    userId: number,
    userName: string,
    action: string,
    targetType: "user" | "event" | "content" | "system",
    targetId?: number,
  ): void {
    const activity: Activity = {
      id: this.nextActivityId++,
      userId,
      userName,
      userAvatar: "/placeholder.svg",
      action,
      targetType,
      targetId,
      timestamp: new Date().toISOString(),
    };
    this.activities.push(activity);
  }

  // ====== STATISTICS ======

  getDashboardStats() {
    const totalUsers = this.users.length;
    const activeUsers = this.users.filter((u) => u.status === "active").length;
    const pendingUsers = this.users.filter(
      (u) => u.status === "pending",
    ).length;
    const inactiveUsers = this.users.filter(
      (u) => u.status === "inactive",
    ).length;

    const totalEvents = this.events.length;
    const upcomingEvents = this.events.filter(
      (e) => e.status === "upcoming",
    ).length;
    const ongoingEvents = this.events.filter(
      (e) => e.status === "ongoing",
    ).length;
    const completedEvents = this.events.filter(
      (e) => e.status === "completed",
    ).length;

    return {
      totalUsers,
      activeUsers,
      pendingUsers,
      inactiveUsers,
      totalEvents,
      upcomingEvents,
      ongoingEvents,
      completedEvents,
      totalRevenue: 45680,
      monthlyGrowth: 23.4,
    };
  }

  // ====== SEED DATA ======

  private seedData(): void {
    // Seed users
    const users: Omit<User, "id" | "createdAt" | "updatedAt">[] = [
      {
        name: "Arjun Krishnan",
        email: "arjun.k@kptciedc.edu",
        role: "student",
        status: "active",
        avatar: "/placeholder.svg",
        joinDate: "2024-01-15",
        department: "Computer Science",
        phone: "+91 9876543210",
        location: "Kollam, Kerala",
      },
      {
        name: "Priya Nair",
        email: "priya.n@kptciedc.edu",
        role: "faculty",
        status: "active",
        avatar: "/placeholder.svg",
        joinDate: "2023-08-20",
        department: "Electronics",
        phone: "+91 9876543211",
        location: "Thiruvananthapuram, Kerala",
      },
      {
        name: "Ravi Kumar",
        email: "ravi.k@kptciedc.edu",
        role: "admin",
        status: "active",
        avatar: "/placeholder.svg",
        joinDate: "2023-05-10",
        department: "Administration",
        phone: "+91 9876543212",
        location: "Kochi, Kerala",
      },
      {
        name: "Sneha Menon",
        email: "sneha.m@kptciedc.edu",
        role: "student",
        status: "pending",
        avatar: "/placeholder.svg",
        joinDate: "2024-11-01",
        department: "Mechanical",
        phone: "+91 9876543213",
        location: "Kottayam, Kerala",
      },
      {
        name: "Anish Thomas",
        email: "anish.t@kptciedc.edu",
        role: "student",
        status: "inactive",
        avatar: "/placeholder.svg",
        joinDate: "2023-12-15",
        department: "Civil",
        phone: "+91 9876543214",
        location: "Palakkad, Kerala",
      },
    ];

    users.forEach((userData) => this.createUser(userData));

    // Seed events
    const events: Omit<
      Event,
      "id" | "attendees" | "rating" | "organizer" | "createdAt" | "updatedAt"
    >[] = [
      {
        title: "Innovation Workshop 2024",
        description:
          "A comprehensive workshop on innovation and entrepreneurship for students and faculty.",
        date: "2024-12-15",
        time: "10:00 AM",
        location: "Main Auditorium, KPTC",
        status: "upcoming",
        maxAttendees: 100,
        category: "Workshop",
        organizerId: 2,
        image: "/placeholder.svg",
      },
      {
        title: "Startup Pitch Competition",
        description:
          "Annual startup pitch competition for emerging entrepreneurs.",
        date: "2024-12-20",
        time: "2:00 PM",
        location: "Conference Hall A",
        status: "upcoming",
        maxAttendees: 80,
        category: "Competition",
        organizerId: 3,
        image: "/placeholder.svg",
      },
      {
        title: "Tech Talk: AI in Education",
        description:
          "Exploring the applications of artificial intelligence in modern education.",
        date: "2024-11-25",
        time: "3:30 PM",
        location: "Virtual Event",
        status: "completed",
        maxAttendees: 100,
        category: "Tech Talk",
        organizerId: 5,
        image: "/placeholder.svg",
      },
    ];

    events.forEach((eventData) => this.createEvent(eventData));

    // Update event attendees manually since they're not set in createEvent
    this.events[0].attendees = 45;
    this.events[0].rating = 4.8;
    this.events[1].attendees = 67;
    this.events[1].rating = 4.9;
    this.events[2].attendees = 89;
    this.events[2].rating = 4.7;
  }
}

// Singleton instance
export const db = new Database();
