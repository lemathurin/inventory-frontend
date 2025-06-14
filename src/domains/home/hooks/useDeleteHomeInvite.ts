import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";

export function useDeleteHomeInvite() {
  return async (homeId: string, inviteId: string) => {
    try {
      const endpoint = HOME_ENDPOINTS.deleteInvite
        .replace(":homeId", homeId)
        .replace(":inviteId", inviteId);
      const response = await axios.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error("Could not delete invite", error);
      throw error;
    }
  };
}
