import axios from "@/lib/axios";
import { AUTH_ENDPOINTS } from "../endpoints";

export function useLogout() {
  return async (): Promise<void> => {
    try {
      await axios.post(AUTH_ENDPOINTS.logout, {});
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };
}
