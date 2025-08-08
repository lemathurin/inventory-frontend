import axios from "@/lib/axios";
import { ITEM_ENDPOINTS } from "../endpoints";

export function useDeleteItem() {
  return async (itemId: string): Promise<void> => {
    try {
      const endpoint = ITEM_ENDPOINTS.item.replace(":itemId", itemId);
      await axios.delete(endpoint);
    } catch (error) {
      console.error("Could not delete item", error);
      throw error;
    }
  };
}
