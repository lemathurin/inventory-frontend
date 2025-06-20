import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";

export function useAcceptHomeInvite() {
  return async (code: string) => {
    try {
      const response = await axios.post(HOME_ENDPOINTS.acceptInvite, {
        code,
      });
      return response.data;
    } catch (error) {
      console.error("Could not join home", error);
      throw error;
    }
  };
}
