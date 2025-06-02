import axios from "@/lib/axios";
import { USER_ENDPOINTS } from "../endpoints";

export function useUpdateUserPassword() {
  return async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    try {
      await axios.patch(USER_ENDPOINTS.updatePassword, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      console.error("Could not update password", error);
      throw error;
    }
  };
}
