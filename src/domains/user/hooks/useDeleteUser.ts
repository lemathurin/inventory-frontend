import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { USER_ENDPOINTS } from "../endpoints";

export function useDeleteUser() {
  return async (password: string): Promise<void> => {
    try {
      await axios.delete(USER_ENDPOINTS.me, { data: { password } });
    } catch (err) {
      if (isAxiosError(err)) {
        throw new Error(
          err.response?.data?.error || "Failed to delete account",
        );
      } else {
        throw new Error("Failed to delete account");
      }
    }
  };
}
