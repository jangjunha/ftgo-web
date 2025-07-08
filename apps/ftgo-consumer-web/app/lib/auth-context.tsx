import { createContext, useContext, useEffect, useState } from "react";
import { defaultClient } from "@ftgo/util";

interface User {
  consumerId: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (consumerId: string, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on mount
    const storedUser = localStorage.getItem("ftgo_consumer_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        defaultClient.setToken(parsedUser.token);
      } catch {
        localStorage.removeItem("ftgo_consumer_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (consumerId: string, token: string) => {
    const userData = { consumerId, token };
    setUser(userData);
    defaultClient.setToken(token);
    localStorage.setItem("ftgo_consumer_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    defaultClient.setToken(null);
    localStorage.removeItem("ftgo_consumer_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
