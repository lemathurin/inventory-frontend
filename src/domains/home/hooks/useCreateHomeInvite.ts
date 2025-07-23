import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";

export function useCreateHomeInvite() {
  return async (homeId: string, expiresInHours?: number) => {
    try {
      const endpoint = HOME_ENDPOINTS.invite.replace(":homeId", homeId);
      const response = await axios.post(endpoint, {
        expiresInHours,
      });
      return response.data;
    } catch (error) {
      console.error("Could not create invite", error);
      throw error;
    }
  };
}
