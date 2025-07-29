import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  AuthUser,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@shared/auth";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Read response body as text first
      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse JSON
      let data: AuthResponse;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("Empty response");
      }

      if (data.success && data.user) {
        setUser(data.user);
        setToken(authToken);
        localStorage.setItem("auth_token", authToken);
      } else {
        localStorage.removeItem("auth_token");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("auth_token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log("Sending login request with credentials:", credentials);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      // Read response body as text first to avoid any stream issues
      const responseText = await response.text();
      console.log("Response text:", responseText);

      // Try to parse as JSON
      let data: AuthResponse;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
          console.log("Parsed response data:", data);
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError);
          return {
            success: false,
            error: `Invalid response format (status: ${response.status})`,
          };
        }
      } else {
        return {
          success: false,
          error: `Empty response (status: ${response.status})`,
        };
      }

      // Handle successful login
      if (data.success && data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("auth_token", data.token);
      }

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login request failed",
      };
    }
  };

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Read response body as text first to avoid any stream issues
      const responseText = await response.text();

      // Try to parse as JSON
      let data: AuthResponse;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError);
          return {
            success: false,
            error: `Invalid response format (status: ${response.status})`,
          };
        }
      } else {
        return {
          success: false,
          error: `Empty response (status: ${response.status})`,
        };
      }

      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Registration request failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
