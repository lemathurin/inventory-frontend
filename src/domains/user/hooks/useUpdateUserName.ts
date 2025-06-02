import axios from "@/lib/axios";
import { USER_ENDPOINTS } from "../endpoints";
import { useUser } from "@/contexts/user.context";

export function useUpdateUserName() {
  const { refreshUserData } = useUser();

  return async (name: string): Promise<void> => {
    try {
      await axios.patch(USER_ENDPOINTS.updateName, { name });
      await refreshUserData();
    } catch (error) {
      console.error("Could not update name", error);
      throw error;
    }
  };
}
