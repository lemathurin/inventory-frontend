import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getHomeById } from "../domains/home/endpoints/getHomeById";
import { HomeModel } from "@/domains/home/home.types";
import { useParams, usePathname } from "next/navigation";

export const HomeContext = createContext<{
  isInHome: boolean;
  isHomeLocation: boolean;
  currentHome: HomeModel | null;
  currentHomeId: string | null;
  isLoading: boolean;
  error: Error | null;
}>({
  isInHome: false,
  isHomeLocation: false,
  currentHome: null,
  currentHomeId: null,
  isLoading: false,
  error: null,
});

export function useHomeContext() {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
}

export function HomeProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const [currentHome, setCurrentHome] = useState<HomeModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const homeId = params?.homeId as string | undefined;
  const isInHome = !!currentHome;
  const isHomeLocation = pathname?.startsWith("/home/") ?? false;

  useEffect(() => {
    // This will be to check if the user is allowed to view this home
    if (isInHome) {
      console.log("Entered home", {
        isInHome,
        name: currentHome.name,
        homeId,
        currentHome,
      });
    } else {
      console.log("Left room", { isInHome, homeId, currentHome });
    }
  }, [currentHome]);

  //   const updateHome = async (data: Partial<Home>) => {
  // Implement update logic here
  // This could call an updateHome endpoint
  // and then update the local state
  //   };

  return (
    <HomeContext.Provider
      value={{
        isInHome,
        isHomeLocation,
        currentHome,
        currentHomeId: homeId || null,
        isLoading,
        error,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
