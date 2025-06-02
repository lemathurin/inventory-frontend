"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { UserModel } from "@/domains/user/user.types";
import { useGetCurrentUser } from "@/domains/user/hooks/useGetCurrentUser";

const UserContext = createContext<UserModel | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserModel | null>(null);
  const getCurrentUser = useGetCurrentUser();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const data = await getCurrentUser();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
    fetchUserData();
  }, [getCurrentUser]);

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
