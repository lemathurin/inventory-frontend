import axios from "@/lib/axios";
import { USER_ENDPOINTS } from "../constants/endpoints";

export function useUpdateUserName() {
  return async (name: string): Promise<void> => {
    try {
      await axios.patch(USER_ENDPOINTS.updateName, { name });
    } catch (error) {
      console.error("Could not update name", error);
      throw error;
    }
  };
}
