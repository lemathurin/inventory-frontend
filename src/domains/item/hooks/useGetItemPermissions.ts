import axios from "@/lib/axios";
import { ITEM_ENDPOINTS } from "../endpoints";

export function useGetItemPermissions() {
  return async (itemId: string) => {
    try {
      const endpoint = ITEM_ENDPOINTS.permissions.replace(":itemId", itemId);
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Could not get permissions", error);
      throw error;
    }
  };
}
