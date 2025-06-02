"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { UserModel } from "@/domains/user/user.types";
import { useGetCurrentUser } from "@/domains/user/hooks/useGetCurrentUser";

type UserContextType = {
  userData: UserModel | null;
  refreshUserData: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const getCurrentUser = useGetCurrentUser();

  const refreshUserData = useCallback(async () => {
    try {
      const data = await getCurrentUser();
      setUserData(data);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  }, []);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  return (
    <UserContext.Provider value={{ userData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
