import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";
import { useHome } from "@/contexts/home.context";

export function useUpdateHome() {
  const { refreshHomeData } = useHome();

  return async (
    homeId: string,
    name?: string,
    address?: string,
  ): Promise<void> => {
    try {
      const endpoint = HOME_ENDPOINTS.home.replace(":homeId", homeId);
      await axios.patch(endpoint, { name, address });
      await refreshHomeData(homeId);
    } catch (error) {
      console.error("Could not update home", error);
      throw error;
    }
  };
}
