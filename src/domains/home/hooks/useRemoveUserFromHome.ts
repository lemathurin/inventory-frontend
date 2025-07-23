import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";
import { useHome } from "../home.context";

export function useRemoveUserFromHome() {
  const { refreshHomeData } = useHome();

  return async (homeId: string, userId: string): Promise<void> => {
    try {
      const endpoint = HOME_ENDPOINTS.removeHomeUser
        .replace(":homeId", homeId)
        .replace(":userId", userId);
      await axios.delete(endpoint);
      await refreshHomeData(homeId);
    } catch (error) {
      console.error("Could not remove user from home", error);
      throw error;
    }
  };
}
