import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";

export function useGetHomeInvite() {
  return async (homeId: string) => {
    try {
      const endpoint = HOME_ENDPOINTS.invite.replace(":homeId", homeId);
      const response = await axios.get(endpoint, {
        params: { homeId },
      });
      return response.data;
    } catch (error) {
      console.error("Could not get invite", error);
      throw error;
    }
  };
}
