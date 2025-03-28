import { useEffect, useState } from "react";
import { getHomeById } from "../endpoints/getHomeById";
import { HomeModel } from "@/domains/home/home.types";

export function useGetHomeById(homeId: string) {
  const [homeData, setHomeData] = useState<HomeModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const data = await getHomeById(homeId);
        setHomeData(data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (homeId) {
      fetchHome();
    }
  }, [homeId]);

  return { homeData, isLoading };
}
