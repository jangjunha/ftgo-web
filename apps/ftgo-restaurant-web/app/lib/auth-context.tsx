import { createContext, useContext, useEffect, useState } from "react";
import { defaultClient } from "@ftgo/util";

interface User {
  id: string;
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on mount
    const storedUser = localStorage.getItem("ftgo_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        defaultClient.setToken(parsedUser.token);
      } catch {
        localStorage.removeItem("ftgo_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const tokenResponse = await defaultClient.issueToken({
      grant_type: "password",
      username,
      password,
    });

    const userData = {
      id: username, // Using username as ID for now
      username,
      token: tokenResponse.access_token,
    };

    setUser(userData);
    defaultClient.setToken(tokenResponse.access_token);
    localStorage.setItem("ftgo_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    defaultClient.setToken(null);
    localStorage.removeItem("ftgo_user");
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
