import axios from "@/lib/axios";
import { USER_ENDPOINTS } from "../constants/endpoints";

export function useUpdateUserEmail() {
  return async (email: string): Promise<void> => {
    try {
      await axios.patch(USER_ENDPOINTS.updateEmail, { email });
    } catch (error) {
      console.error("Could not update email", error);
      throw error;
    }
  };
}
