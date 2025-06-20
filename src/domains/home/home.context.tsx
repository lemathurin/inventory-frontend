"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { HomeModel } from "@/domains/home/home.types";
import { useGetHomeById } from "@/domains/home/hooks/useGetHomeById";
import { useParams } from "next/navigation";
import { useGetHomePermissions } from "@/domains/home/hooks/useGetHomePermissions";

type HomeContextType = {
  homeData: HomeModel | null;
  refreshHomeData: (homeId: string) => Promise<void>;
  isAdmin: boolean;
};

const HomeContext = createContext<HomeContextType | null>(null);

export function HomeProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const getHomeById = useGetHomeById();
  const getHomePermissions = useGetHomePermissions();
  const homeId = params?.homeId as string;
  const [homeData, setHomeData] = useState<HomeModel | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshHomeData = useCallback(
    async (homeId: string) => {
      try {
        const data = await getHomeById(homeId);
        setHomeData(data);
        console.log("Home context", data);
      } catch (error) {
        console.error("Failed to refresh home data:", error);
      }
    },
    [getHomeById],
  );

  useEffect(() => {
    if (homeId) {
      refreshHomeData(homeId);
      getHomePermissions(homeId).then((permissions) => {
        setIsAdmin(permissions.admin);
        console.log("Is home admin:", permissions.admin);
      });
    }
  }, [homeId]);

  return (
    <HomeContext.Provider value={{ homeData, refreshHomeData, isAdmin }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHome() {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
}
