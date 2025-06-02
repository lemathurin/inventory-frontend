import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";

export function useDeleteHome() {
  return async (homeId: string): Promise<void> => {
    try {
      await axios.delete(`${HOME_ENDPOINTS.home}/${homeId}`);
    } catch (error) {
      console.error("Could not fetch home", error);
      throw error;
    }
  };
}
