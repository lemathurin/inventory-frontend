import { useEffect, useState } from "react";
import { getHomeById } from "../endpoints/getHomeById";

export function useGetHomeById(homeId: string) {
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const data = await getHomeById(homeId);
        setHomeData(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (homeId) {
      fetchHome();
    }
  }, [homeId]);

  return { homeData, isLoading, error };
}
