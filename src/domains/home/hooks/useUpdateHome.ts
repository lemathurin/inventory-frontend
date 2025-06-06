import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";

export function useUpdateHome() {
  return async (
    homeId: string,
    name?: string,
    address?: string,
  ): Promise<void> => {
    try {
      const endpoint = HOME_ENDPOINTS.home.replace(":homeId", homeId);
      await axios.patch(endpoint, { name, address });
    } catch (error) {
      console.error("Could not update home", error);
      throw error;
    }
  };
}
