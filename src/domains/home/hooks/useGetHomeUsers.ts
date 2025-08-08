import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";
import { UserModel } from "@/domains/user/user.types";

export function useGetHomeUsers() {
  return async (homeId: string): Promise<UserModel[]> => {
    try {
      const endpoint = HOME_ENDPOINTS.getHomeUsers.replace(":homeId", homeId);
      const response = await axios.get<UserModel[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error("Could not fetch home users", error);
      throw error;
    }
  };
}
