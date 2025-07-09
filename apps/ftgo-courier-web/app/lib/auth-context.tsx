import { createContext, useContext, useEffect, useState } from "react";
import { defaultClient } from "@ftgo/util";

interface User {
  courierId: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (courierId: string, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on mount
    const storedUser = localStorage.getItem("ftgo_courier_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        defaultClient.setToken(parsedUser.token);
      } catch {
        localStorage.removeItem("ftgo_courier_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (courierId: string, token: string) => {
    const userData = { courierId, token };
    setUser(userData);
    defaultClient.setToken(token);
    localStorage.setItem("ftgo_courier_user", JSON.stringify(userData));
  };

  const logout = () => {
    if (user) {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(`ftgo_cart_${user.courierId}_`)) {
          localStorage.removeItem(key);
        }
      });
    }
    setUser(null);
    defaultClient.setToken(null);
    localStorage.removeItem("ftgo_courier_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
