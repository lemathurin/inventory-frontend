import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";

export function useGetHomePermissions() {
  return async (homeId: string) => {
    try {
      const endpoint = HOME_ENDPOINTS.permissions.replace(":homeId", homeId);
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Could not get permissions", error);
      throw error;
    }
  };
}
