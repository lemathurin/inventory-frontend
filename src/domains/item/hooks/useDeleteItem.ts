import axios from "@/lib/axios";
import { ITEM_ENDPOINTS } from "../endpoints";

export function useDeleteItem() {
  return async (itemId: string): Promise<void> => {
    try {
      await axios.delete(`${ITEM_ENDPOINTS.item}/${itemId}`);
    } catch (error) {
      console.error("Could not delete item", error);
      throw error;
    }
  };
}
