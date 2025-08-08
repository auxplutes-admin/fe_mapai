/**
 * Authentication Context
 * Manages global authentication state and related functions
 */
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
  } from "react";
  import {
    clearSession,
  } from "@/constant/session";
import { API_BASE_URL, SESSION_COOKIE_NAME } from "@/constant";
  
  interface studentProfile{
    firstName: string;
    lastName: string;
  }

  
  interface AuthContextType {
    user: studentProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
  }
  
  // Export the context for use in the hook
  export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
  );
  
  /**
   * Authentication Provider Component
   * Wraps the application with authentication context
   */
  export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [user, setUser] = useState<studentProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    const checkAuth = useCallback(async () => {
      try {
        const token = localStorage.getItem(SESSION_COOKIE_NAME);
        
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Get from local storage
        const user = JSON.parse(localStorage.getItem(SESSION_COOKIE_NAME) || "{}");
        setUser(user);
        

      } catch (error) {
        console.error("Auth check failed:", error);
        clearSession();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }, []);

    console.log("user",user)

  
    const login = () => {
      window.location.href = `${API_BASE_URL}/api/v1/auth/login`;
    };
  
    const logout = useCallback(() => {
      setUser(null);
      clearSession();
      window.location.href = "/";
    }, []);
  
    useEffect(() => {
      checkAuth();
    }, [checkAuth]);
  
    const value = {
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      checkAuth,
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  /**
   * Custom hook to use authentication context
   */
  export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  }