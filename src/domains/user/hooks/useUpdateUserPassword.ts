import axios from "@/lib/axios";
import { USER_ENDPOINTS } from "../constants/endpoints";

export function useUpdateUserPassword() {
  return async (password: string): Promise<void> => {
    try {
      await axios.patch(USER_ENDPOINTS.updatePassword, { password });
    } catch (error) {
      console.error("Could not update password", error);
      throw error;
    }
  };
}
