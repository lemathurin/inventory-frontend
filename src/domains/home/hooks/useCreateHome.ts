import axios from "@/lib/axios";
import { HOME_ENDPOINTS } from "../endpoints";

export function useCreateHome() {
  return async (name: string, address: string): Promise<void> => {
    try {
      await axios.post(HOME_ENDPOINTS.createHome, { name, address });
    } catch (error) {
      console.error("Could not create home", error);
      throw error;
    }
  };
}
