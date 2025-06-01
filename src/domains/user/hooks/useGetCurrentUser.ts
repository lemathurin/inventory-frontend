import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { USER_ENDPOINTS } from "../constants/endpoints";

export function useGetCurrentUser() {
  return async (): Promise<void> => {
    try {
      await axios.get(USER_ENDPOINTS.me);
    } catch (err) {
      if (isAxiosError(err)) {
        throw new Error(
          err.response?.data?.error || "Failed to get current user",
        );
      } else {
        throw new Error("Failed to get current user");
      }
    }
  };
}
