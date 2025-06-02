import axios from "@/lib/axios";
import { USER_ENDPOINTS } from "../constants/endpoints";
import { useUser } from "@/contexts/user.context";

export function useUpdateUserEmail() {
  const { refreshUserData } = useUser();

  return async (email: string): Promise<void> => {
    try {
      await axios.patch(USER_ENDPOINTS.updateEmail, { email });
      await refreshUserData();
    } catch (error) {
      console.error("Could not update email", error);
      throw error;
    }
  };
}
