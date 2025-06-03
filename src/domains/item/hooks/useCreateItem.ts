import axios from "@/lib/axios";
import { ITEM_ENDPOINTS } from "../endpoints";

export function useCreateItem() {
  return async (
    homeId: string,
    name: string,
    roomId: string,
    description?: string,
  ): Promise<void> => {
    try {
      await axios.post(`${ITEM_ENDPOINTS.createItem}/${homeId}`, {
        name,
        roomId,
        description,
      });
    } catch (error) {
      console.error("Could not create item", error);
      throw error;
    }
  };
}
