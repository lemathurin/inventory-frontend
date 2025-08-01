import axios from "@/lib/axios";
import { USER_ENDPOINTS } from "../endpoints";
import { useUser } from "@/domains/user/user.context";

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
