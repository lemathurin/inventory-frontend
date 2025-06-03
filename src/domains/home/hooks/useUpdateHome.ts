import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";

export function useUpdateHome() {
  return async (
    homeId: string,
    name?: string,
    address?: string,
  ): Promise<void> => {
    try {
      await axios.patch(`${HOME_ENDPOINTS.home}/${homeId}`, { name, address });
    } catch (error) {
      console.error("Could not update home", error);
      throw error;
    }
  };
}
