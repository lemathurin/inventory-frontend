import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";

export function useDeleteHome() {
  return async (homeId: string): Promise<void> => {
    try {
      const endpoint = HOME_ENDPOINTS.home.replace(":homeId", homeId);
      await axios.delete(endpoint);
    } catch (error) {
      console.error("Could not delete home", error);
      throw error;
    }
  };
}
